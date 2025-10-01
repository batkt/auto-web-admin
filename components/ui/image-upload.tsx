'use client';

import { useCallback, useMemo, useRef, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { Loader2, RefreshCcw, Trash2, Upload, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from './badge';
import { Button } from './button';
import { getImageUrl } from '@/utils';

interface ImageUploadProps {
  mode: 'single' | 'multi';
  value?: string | string[];
  onChange: (value: string | string[]) => void;
  onUpload: (file: File) => Promise<string>;
  maxFiles?: number;
  maxSize?: number; // in MB
  acceptedTypes?: string[];
  className?: string;
  disabled?: boolean;
}

export function ImageUpload({
  mode,
  value,
  onChange,
  onUpload,
  maxFiles = 10,
  maxSize = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  className,
  disabled,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const currentImages = useMemo(() => {
    return mode === 'single'
      ? typeof value === 'string' && value
        ? [value]
        : []
      : Array.isArray(value)
      ? value
      : [];
  }, [mode, value]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;

      if (mode === 'single') {
        setUploading(true);
        try {
          const uploadedUrl = await onUpload(acceptedFiles[0]);
          onChange(uploadedUrl);
        } finally {
          setUploading(false);
        }
      } else {
        // Multi mode
        const newImages = [...currentImages];

        for (let i = 0; i < acceptedFiles.length && newImages.length < maxFiles; i++) {
          const file = acceptedFiles[i];
          const insertIndex = newImages.length;

          setUploadingIndex(insertIndex);
          try {
            const uploadedUrl = await onUpload(file);
            newImages.push(uploadedUrl);
            onChange(newImages);
          } finally {
            setUploadingIndex(null);
          }
        }
      }
    },
    [mode, onUpload, onChange, currentImages, maxFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
    },
    maxFiles: mode === 'single' ? 1 : maxFiles - currentImages.length,
    noClick: true,
    disabled: disabled,
  });

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  const removeImage = (index: number) => {
    if (mode === 'single') {
      onChange('');
    } else {
      const newImages = currentImages.filter((_, i) => i !== index);
      onChange(newImages);
    }
  };

  const replaceImage = async (index: number) => {
    if (!replaceInputRef.current) return;

    replaceInputRef.current.onchange = async e => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      setUploadingIndex(index);
      try {
        const uploadedUrl = await onUpload(file);
        if (mode === 'single') {
          onChange(uploadedUrl);
        } else {
          const newImages = [...currentImages];
          newImages[index] = uploadedUrl;
          onChange(newImages);
        }
      } finally {
        setUploadingIndex(null);
      }
    };

    replaceInputRef.current.click();
  };

  const renderSingleMode = () => {
    const image = currentImages[0];
    const url = getImageUrl(image);

    return (
      <div
        {...getRootProps()}
        className={cn(
          'border border-dashed transition-all duration-200 hover:border-primary/50',
          isDragActive ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-muted-foreground/25',
          className
        )}
      >
        <input {...getInputProps()} ref={inputRef} />
        <input
          type="file"
          accept={acceptedTypes.join(',')}
          ref={replaceInputRef}
          style={{ display: 'none' }}
        />

        {image ? (
          <div className="overflow-hidden group duration-200">
            <div className={cn('relative border-none', isDragActive ? 'border-primary' : '')}>
              {/* Image */}
              <Image
                src={url}
                alt="Uploaded image"
                width={800}
                height={600}
                className="w-full object-cover"
              />
              {/* Overlay */}
              <div className="absolute z-[1] inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />

              {/* Action Buttons */}
              {!disabled && (
                <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-[2] duration-200">
                  <Button
                    type="button"
                    size="sm"
                    variant="secondary"
                    className="h-8 p-0 backdrop-blur-sm"
                    onClick={e => {
                      e.stopPropagation();
                      replaceImage(0);
                    }}
                  >
                    <RefreshCcw className="h-3.5 w-3.5" /> Солих
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    className="h-8 p-0 backdrop-blur-sm"
                    onClick={e => {
                      e.stopPropagation();
                      removeImage(0);
                    }}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              )}

              {/* Loading Overlay */}
              {uploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
                  <Loader2 className="animate-spin size-6 text-white" />
                </div>
              )}

              {/* Drag Overlay */}
              <div
                className={cn(
                  'absolute inset-0 flex items-center justify-center bg-white/50',
                  isDragActive ? 'z-10 opacity-100' : 'z-0 opacity-0'
                )}
              >
                <div className="text-center">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-primary" />
                  <p className="font-semibold">Зургийг энд байршуулна уу</p>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div
            className={cn(
              'relative flex items-center justify-center transition-all duration-200 cursor-pointer min-h-[200px]',
              isDragActive
                ? 'border-primary bg-primary/5 scale-[1.02]'
                : 'border-muted-foreground/25'
            )}
            onClick={!disabled ? openFileDialog : undefined}
          >
            {/* Loading Overlay */}
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
                <Loader2 className="animate-spin size-6 text-white" />
              </div>
            )}

            <div className="w-full flex flex-col items-center justify-center p-6 text-center">
              <div
                className={cn(
                  'rounded-full p-4 mb-4 transition-all duration-200',
                  isDragActive ? 'bg-primary/10 scale-110' : 'bg-transparent'
                )}
              >
                <Upload
                  className={cn(
                    'h-8 w-8 transition-colors duration-200',
                    isDragActive ? 'text-primary' : 'text-muted-foreground'
                  )}
                />
              </div>

              <h3 className="font-semibold mb-2">
                {isDragActive ? 'Зургийг энд байршуулна уу' : 'Зураг оруулах'}
              </h3>

              <p className="text-sm text-muted-foreground mb-4">
                {isDragActive ? 'Хуулахад бэлэн' : 'Зургийг энд чирж тавих эсвэл дарж сонгоно уу'}
              </p>

              <div className="flex flex-wrap justify-center gap-2">
                <Badge variant="outline" className="text-xs">
                  {maxSize}MB хүртэлх файл
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {acceptedTypes.map(type => type.split('/')[1]).join(', ')}
                </Badge>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderMultiMode = () => {
    return (
      <div className="space-y-4">
        {/* Images Grid */}
        {currentImages.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            {currentImages.map((image, index) => {
              const url = getImageUrl(image);
              return (
                <div key={index} className="relative group aspect-square">
                  <Image
                    src={url}
                    alt={`Image ${index + 1}`}
                    width={200}
                    height={200}
                    className="w-full h-full object-cover rounded-md"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 rounded-md" />

                  {/* Action Buttons */}
                  {!disabled && (
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <Button
                        type="button"
                        size="sm"
                        variant="secondary"
                        className="h-6 w-6 p-0 backdrop-blur-sm"
                        onClick={() => replaceImage(index)}
                      >
                        <RefreshCcw className="h-3 w-3" />
                      </Button>
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className="h-6 w-6 p-0 backdrop-blur-sm"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}

                  {/* Loading Overlay */}
                  {uploadingIndex === index && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-md">
                      <Loader2 className="animate-spin size-4 text-white" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Upload Area */}
        {currentImages.length < maxFiles && (
          <div
            {...getRootProps()}
            className={cn(
              'border border-dashed transition-all duration-200 hover:border-primary/50 rounded-md',
              isDragActive
                ? 'border-primary bg-primary/5 scale-[1.02]'
                : 'border-muted-foreground/25'
            )}
          >
            <input {...getInputProps()} ref={inputRef} />
            <input
              type="file"
              accept={acceptedTypes.join(',')}
              ref={replaceInputRef}
              style={{ display: 'none' }}
            />

            <div
              className={cn(
                'relative flex items-center justify-center transition-all duration-200 cursor-pointer min-h-[120px]',
                isDragActive
                  ? 'border-primary bg-primary/5 scale-[1.02]'
                  : 'border-muted-foreground/25'
              )}
              onClick={!disabled ? openFileDialog : undefined}
            >
              <div className="w-full flex flex-col items-center justify-center p-4 text-center">
                <div
                  className={cn(
                    'rounded-full p-3 mb-2 transition-all duration-200',
                    isDragActive ? 'bg-primary/10 scale-110' : 'bg-transparent'
                  )}
                >
                  <Upload
                    className={cn(
                      'h-6 w-6 transition-colors duration-200',
                      isDragActive ? 'text-primary' : 'text-muted-foreground'
                    )}
                  />
                </div>

                <h3 className="font-semibold text-sm mb-1">
                  {isDragActive ? 'Зургийг энд байршуулна уу' : 'Зураг нэмэх'}
                </h3>

                <p className="text-xs text-muted-foreground mb-2">
                  {isDragActive ? 'Хуулахад бэлэн' : 'Зургийг энд чирж тавих эсвэл дарж сонгоно уу'}
                </p>

                <div className="flex flex-wrap justify-center gap-1">
                  <Badge variant="outline" className="text-xs">
                    {maxSize}MB
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {acceptedTypes.map(type => type.split('/')[1]).join(', ')}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return mode === 'single' ? renderSingleMode() : renderMultiMode();
}
