'use client';

import { useSortable } from '@dnd-kit/sortable';

import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2 } from 'lucide-react';
import TextBlock from './TextBlock';
import ImageBlock from './ImageBlock';
import VideoBlock from './VideoBlock';
import GalleryBlock from './GalleryBlock';

import { cn } from '@/lib/utils';
import { Block, UploadedImage } from '@/lib/types/block.types';
import { Control, Controller } from 'react-hook-form';
import { BlogFormValues } from '@/lib/types/blog-builder.types';
import React from 'react';

export function SortableBuilderItem({
  block,
  index,
  control,
  remove,
}: {
  block: Block;
  remove: (index: number) => void;
  index: number;
  control: Control<BlogFormValues>;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: block.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const createImagePreview = (file: File): string => {
    return URL.createObjectURL(file);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="relative z-0 bg-background rounded-md group"
      {...attributes}
    >
      <div
        className={cn(
          'absolute inset-0 bg-white/50 transition-colors duration-200',
          isDragging ? 'z-20 opacity-100 visible' : '-z-10 invisible opacity-0'
        )}
      ></div>

      {/* Buttons */}
      <div className="absolute group-hover:z-10 top-0 left-0 -translate-x-full flex flex-col gap-2 opacity-0 group-hover:opacity-100 p-2">
        <button className="cursor-grab p-1 rounded hover:bg-muted" {...listeners}>
          <GripVertical size={16} />
        </button>
        <button
          onClick={() => {
            remove(index);
          }}
          className="text-destructive p-1 hover:bg-destructive/10 rounded"
        >
          <Trash2 size={16} />
        </button>
      </div>

      <Controller
        key={block.id}
        control={control}
        name={`blocks.${index}`}
        render={({ field }) => {
          const _block = field.value;
          if (_block.type === 'image') {
            return (
              <ImageBlock
                data={_block.data}
                onUpload={(file: File) => {
                  const url = createImagePreview(file);
                  const uploadedFile: UploadedImage = {
                    id: (Math.random() * 899999 + 100000).toString(),
                    url: url,
                    alt: '',
                  };
                  field.onChange?.({ ..._block, data: uploadedFile });
                  return Promise.resolve(uploadedFile);
                }}
              />
            );
          }
          if (_block.type === 'video') {
            return (
              <VideoBlock
                url={_block.url}
                isDragging={isDragging}
                onChange={url => field.onChange?.({ ..._block, url })}
              />
            );
          }
          if (_block.type === 'gallery') {
            return (
              <GalleryBlock
                images={_block.images}
                onChange={imgs => field.onChange?.({ ..._block, images: imgs })}
              />
            );
          }

          return (
            <TextBlock
              value={_block.content}
              isDragging={isDragging}
              onChange={v => {
                field.onChange({ ..._block, content: v });
              }}
            />
          );
        }}
      />
    </div>
  );
}
