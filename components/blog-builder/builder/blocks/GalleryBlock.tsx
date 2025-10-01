'use client';

import { useRef, useState } from 'react';
import { uploadFile } from '@/lib/actions/file';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import Image from 'next/image';

type Props = {
  images: string[];
  onChange: (images: string[]) => void;
};

export default function GalleryBlock({ images, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handleFiles = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(async file => {
        try {
          const uploadedFile = await uploadFile(file);
          return uploadedFile.url;
        } catch (error) {
          console.error('Failed to upload file:', error);
          toast.error('Зураг оруулахад алдаа гарлаа');
          throw error;
        }
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      onChange([...images, ...uploadedUrls]);
    } catch (error) {
      console.error('Failed to upload files:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="border p-4 rounded space-y-2">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {images.map((img, i) => (
          <Image
            key={i}
            src={img}
            width={200}
            height={200}
            alt={`Gallery ${i}`}
            className="w-full h-32 object-cover rounded"
          />
        ))}
      </div>

      <input type="file" multiple accept="image/*" hidden ref={inputRef} onChange={handleFiles} />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {uploading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Оруулж байна...
          </>
        ) : (
          '📸 Зураг нэмэх'
        )}
      </button>
    </div>
  );
}
