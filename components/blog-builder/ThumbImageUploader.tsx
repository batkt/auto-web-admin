'use client';

import { useCallback, useRef, useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import Image from 'next/image';
import { Loader2, RefreshCcw, Trash2, Upload, UploadCloud } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { FieldError } from 'react-hook-form';
import { getImageUrl } from '@/utils';

type Props = {
  value?: string; // already uploaded image URL
  onUpload: (file: File) => Promise<string>; // return uploaded image URL
  onRemove?: () => void;
  error?: FieldError;
};

export default function ThumbImageUploader({ value, onUpload, onRemove, error }: Props) {
  const [preview, setPreview] = useState<string | null>(value || null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
  const maxSize = 5;

  // Update preview when value prop changes (for edit mode)
  useEffect(() => {
    console.log('ThumbImageUploader value changed:', value);
    setPreview(value || null);
  }, [value]);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      const file = acceptedFiles[0];

      setLoading(true);
      try {
        const uploadedUrl = await onUpload(file);
        setPreview(uploadedUrl);
      } finally {
        setLoading(false);
      }
    },
    [onUpload]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
    },
    maxFiles: 1,
    noClick: true,
  });

  const openFileDialog = () => {
    inputRef.current?.click();
  };

  return (
    <div>
      <div
        {...getRootProps()}
        className={cn(
          'relative flex items-center justify-center border border-dashed transition-all duration-200',
          isDragActive ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-muted-foreground/25',
          error ? 'border-destructive hover:border-border' : 'hover:border-primary/50'
        )}
      >
        <input {...getInputProps()} ref={inputRef} />

        {preview ? (
          <div className="overflow-hidden w-full group">
            <div className={cn('relative border-none', isDragActive ? 'border-primary' : '')}>
              <Image
                src={getImageUrl(preview)}
                alt={'thumbimage'}
                width={800}
                height={800}
                className="w-full object-contain"
              />
              <div className="absolute z-[1] inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />

              <div className="absolute z-[2] bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Button
                  size="sm"
                  type="button"
                  variant="secondary"
                  className="h-6 p-0 backdrop-blur-sm"
                  onClick={openFileDialog}
                >
                  <RefreshCcw className="h-3.5 w-3.5" /> Солих
                </Button>
              </div>

              <div
                className={cn(
                  'absolute inset-0 flex items-center justify-center bg-white/50',
                  isDragActive ? 'z-10 opacity-100' : 'z-0 opacity-0'
                )}
              >
                <div className="relative w-full">
                  <div className="w-full flex flex-col items-center justify-center p-6 text-center">
                    <div
                      className={cn(
                        'rounded-full p-4 mb-4 transition-all duration-200 bg-primary/10 scale-110'
                      )}
                    >
                      <Upload
                        className={cn('h-8 w-8 transition-colors duration-200 text-primary')}
                      />
                    </div>

                    <h3 className="font-semibold mb-2">Зургийг энд байршуулна уу.</h3>

                    <p className="text-sm text-muted-foreground mb-4">Хуулахад бэлэн</p>

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
              </div>
            </div>
          </div>
        ) : (
          <div
            className="relative aspect-video w-full flex items-center justify-center cursor-pointer"
            onClick={openFileDialog}
          >
            <Image
              src={'/admin/assets/images/thumbnail.jpg'}
              alt={'thumbimage'}
              width={640}
              height={360}
              className="absolute z-0 inset-0 w-full object-contain"
            />
            <div className="z-10 size-full bg-background/50 flex flex-col items-center justify-center p-6 text-center">
              <div
                className={cn(
                  'rounded-full p-4 pt-0 transition-all duration-200',
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

              <h3 className="font-semibold mb-6">
                {isDragActive ? 'Зургийг энд байршуулна уу.' : 'Зураг оруулах'}
              </h3>

              <p className="text-sm text-muted-foreground mb-4 mt-24">
                {isDragActive ? 'Хуулахад бэлэн' : 'Зургийг энд чирж тавих эсвэл дарж сонгоно уу.'}
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

        {loading && (
          <div className="absolute z-10 bg-black/20 transition-colors duration-200 flex items-center justify-center">
            <Loader2 className="animate-spin size-6 text-muted-foreground" />
          </div>
        )}
      </div>
      {error && <span className="text-destructive text-sm">{error.message}</span>}
    </div>
  );
}
