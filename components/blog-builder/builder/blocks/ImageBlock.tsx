import React, { useCallback, useRef, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { Loader2, RefreshCcw, Upload } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { UploadedImage } from '@/lib/types/block.types';
import { useDropzone } from 'react-dropzone';
import { getImageUrl } from '@/utils';

const validateFile = (file: File, acceptedTypes: string[], maxSize: number): string | null => {
  if (!acceptedTypes.includes(file.type)) {
    return `Файлын формат буруу.`;
  }
  if (file.size > maxSize * 1024 * 1024) {
    return `Файлын хэмжээ ${maxSize}MB-с их байна.`;
  }
  return null;
};

const ImageBlock = ({
  acceptedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
  maxSize = 10,
  data,
  onUpload,
}: {
  acceptedTypes?: string[];
  maxSize?: number;
  data?: UploadedImage;
  onUpload?: (file: File) => Promise<UploadedImage>;
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [image, setImage] = useState<UploadedImage | undefined>(data);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (acceptedFiles.length === 0) return;
      const file = acceptedFiles[0];

      setUploading(true);
      try {
        const uploadedUrl = await onUpload?.(file);
        setImage(uploadedUrl);
      } finally {
        setUploading(false);
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
    fileInputRef.current?.click();
  };

  return (
    <div
      {...getRootProps()}
      className={cn(
        'border border-dashed transition-all duration-200 hover:border-primary/50',
        isDragActive ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-muted-foreground/25'
      )}
    >
      <input {...getInputProps()} ref={fileInputRef} />

      {image ? (
        <div className="overflow-hidden group duration-200">
          <div className={cn('relative border-none', isDragActive ? 'border-primary' : '')}>
            {/* Image */}
            <Image
              src={getImageUrl(image.url)}
              alt={image.alt}
              width={800}
              height={800}
              className="w-full object-contain"
            />
            {/* Overlay */}
            <div className="absolute z-[1] inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200" />

            {/* Action Buttons */}
            <div className="absolute bottom-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity z-[2] duration-200">
              <Button
                type="button"
                size="sm"
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
                    <Upload className={cn('h-8 w-8 transition-colors duration-200 text-primary')} />
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
          className={cn(
            'relative flex items-center justify-center transition-all duration-200 cursor-pointer',
            isDragActive ? 'border-primary bg-primary/5 scale-[1.02]' : 'border-muted-foreground/25'
          )}
          onClick={openFileDialog}
        >
          <div className="relative h-64 w-full">
            {/* Loader */}
            {uploading && (
              <div className="absolute z-10 bg-black/20 transition-colors duration-200 flex items-center justify-center">
                <Loader2 className="animate-spin size-6 text-muted-foreground" />
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
                {isDragActive ? 'Зургийг энд байршуулна уу.' : 'Зураг оруулах'}
              </h3>

              <p className="text-sm text-muted-foreground mb-4">
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
        </div>
      )}
    </div>
  );
};

export default ImageBlock;
