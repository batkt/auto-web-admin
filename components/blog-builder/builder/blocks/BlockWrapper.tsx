'use client';

import { Trash2 } from 'lucide-react';
import TextBlock from './TextBlock';
import ImageBlock from './ImageBlock';
import VideoBlock from './VideoBlock';
import GalleryBlock from './GalleryBlock';

import { Block, UploadedImage } from '@/lib/types/block.types';
import React from 'react';
import { uploadFile } from '@/lib/actions/file';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export function BlockWrapper({
  block,
  updateBlock,
  remove,
  notDelete = false,
}: {
  block: Block;
  remove?: () => void;
  notDelete?: boolean;
  updateBlock?: (block: Block) => void;
}) {
  const renderBlock = (_block: Block) => {
    if (_block.type === 'image') {
      return (
        <ImageBlock
          data={_block.data}
          onUpload={async (file: File) => {
            try {
              const uploadedFileResponse = await uploadFile(file);
              const uploadedFile: UploadedImage = {
                id: (Math.random() * 899999 + 100000).toString(),
                url: uploadedFileResponse.url,
                alt: '',
              };
              updateBlock?.({ ..._block, data: uploadedFile });
              return uploadedFile;
            } catch (error) {
              console.error('Failed to upload image:', error);
              toast.error('Зураг оруулахад алдаа гарлаа');
              throw error;
            }
          }}
        />
      );
    }
    if (_block.type === 'video') {
      return <VideoBlock url={_block.url} onChange={url => updateBlock?.({ ..._block, url })} />;
    }
    if (_block.type === 'gallery') {
      return (
        <GalleryBlock
          images={_block.images}
          onChange={imgs => updateBlock?.({ ..._block, images: imgs })}
        />
      );
    }

    return (
      <TextBlock
        value={_block.content}
        onChange={v => {
          updateBlock?.({ ..._block, content: v });
        }}
      />
    );
  };
  return (
    <div className="relative z-0 bg-background rounded-md group">
      {/* Buttons */}
      {!notDelete && (
        <div className="absolute group-hover:z-10 top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100">
          <Button
            size="sm"
            type="button"
            variant="destructive"
            className="size-6 p-0 transition-all duration-200 bg-destructive hover:bg-destructive/90 backdrop-blur-sm"
            onClick={remove}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}

      {renderBlock(block)}
    </div>
  );
}
