'use client';

import { Block } from '@/lib/types/block.types';
import ThumbImageUploader from '../ThumbImageUploader';
import TitleInput from '../TitleInput';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { ImageIcon, Type, Video, Loader2 } from 'lucide-react';
import { BlogFormValues } from '@/lib/types/blog-builder.types';
import { BlockWrapper } from './blocks/BlockWrapper';
import { createBlog, updateBlog } from '@/lib/actions/blog';
import { uploadFile } from '@/lib/actions/file';
import { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { Category } from '@/lib/types/category.types';
import { Blog } from '@/lib/types/blog.types';
import { EnhancedCategorySelector } from '@/components/category';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

interface BlogBuilderProps {
  categories: Category[];
  blog?: Blog;
  mode?: 'create' | 'edit';
}

export default function BlogBuilder({ categories, blog, mode = 'create' }: BlogBuilderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const router = useRouter();
  const idCounter = useRef(0);
  const [categoryError, setCategoryError] = useState(false);
  const [blockError, setBlockError] = useState(false);

  // Client-side only ID generator
  const generateId = () => {
    idCounter.current += 1;
    return `block_${idCounter.current}`;
  };

  const { control, handleSubmit, trigger, setValue, watch, reset } = useForm<BlogFormValues>({
    defaultValues: {
      title: '',
      thumbImage: '',
      categories: [],
      blocks: [],
      language: blog?.language || 'mn',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'blocks',
  });

  // Initialize form with blog data when editing
  useEffect(() => {
    if (blog && mode === 'edit') {
      console.log('BlogBuilder initializing with blog data:', blog);
      reset({
        title: blog.title,
        thumbImage: blog.thumbImage,
        categories: blog.categories.map(category => category._id) || [],
        blocks: blog.blocks.length > 0 ? blog.blocks : [],
        language: blog.language,
      });
    }
  }, [blog, mode, reset]);

  // Add initial text block on client side only
  useEffect(() => {
    const currentBlocks = watch('blocks');
    if (currentBlocks.length === 0) {
      append({
        id: generateId(),
        type: 'text',
        content: '',
      });
    }
  }, [append, watch]);

  const addBlock = (type: Block['type']) => {
    const base: Block = { id: generateId(), type } as Block;
    if (base.type === 'gallery') base.images = [];

    append(base);
  };

  // Helper: Check if at least one block has value
  function hasAtLeastOneBlockWithValue(blocks: Block[]): boolean {
    return blocks.some(block => {
      if (block.type === 'text') return !!block.content && block.content.trim() !== '';
      if (block.type === 'image') return !!block.data && !!block.data.url;
      if (block.type === 'video') return !!block.url && block.url.trim() !== '';
      if (block.type === 'gallery') return Array.isArray(block.images) && block.images.length > 0;
      return false;
    });
  }

  const save = async () => {
    const formData = watch();
    let valid = true;
    setCategoryError(false);
    setBlockError(false);
    if (!formData.categories || formData.categories.length === 0) {
      setCategoryError(true);
      toast.error('Ядаж нэг категори сонгоно уу');
      valid = false;
    }
    if (!formData.blocks || !hasAtLeastOneBlockWithValue(formData.blocks)) {
      setBlockError(true);
      toast.error('Ядаж нэг блок утгатай байх ёстой');
      valid = false;
    }
    const isValid = await trigger();
    if (!isValid || !valid) return;

    setIsLoading(true);
    try {
      const formData = watch();

      if (mode === 'edit' && blog) {
        const response = await updateBlog(blog._id, {
          title: formData.title,
          thumbImage: formData.thumbImage,
          categories: formData.categories || [],
          blocks: formData.blocks,
          status: 'draft',
        });

        if (response.data) {
          toast.success('Блог амжилттай хадгалагдлаа');
        }
      } else {
        const response = await createBlog({
          title: formData.title,
          thumbImage: formData.thumbImage,
          categories: formData.categories || [],
          blocks: formData.blocks,
          status: 'draft',
          language: formData.language,
        });

        if (response.data) {
          toast.success('Блог амжилттай хадгалагдлаа');
          router.push('/blogs/list');
        }
      }
    } catch (error) {
      console.error('Failed to save blog:', error);
      toast.error('Блог хадгалахад алдаа гарлаа');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: BlogFormValues) => {
    setCategoryError(false);
    setBlockError(false);
    let valid = true;
    if (!data.categories || data.categories.length === 0) {
      setCategoryError(true);
      toast.error('Ядаж нэг категори сонгоно уу');
      valid = false;
    }
    if (!data.blocks || !hasAtLeastOneBlockWithValue(data.blocks)) {
      setBlockError(true);
      toast.error('Ядаж нэг блок утгатай байх ёстой');
      valid = false;
    }
    if (!valid) return;

    setIsPublishing(true);
    try {
      if (mode === 'edit' && blog) {
        const response = await updateBlog(blog._id, {
          title: data.title,
          thumbImage: data.thumbImage,
          categories: data.categories || [],
          blocks: data.blocks,
          status: 'published',
        });

        if (response.data) {
          toast.success('Блог амжилттай нийтлэгдлээ');
          router.push('/blogs/list');
        }
      } else {
        const response = await createBlog({
          title: data.title,
          thumbImage: data.thumbImage,
          categories: data.categories || [],
          blocks: data.blocks,
          status: 'published',
        });

        if (response.data) {
          toast.success('Блог амжилттай нийтлэгдлээ');
          router.push('/blogs/list');
        }
      }
    } catch (error) {
      console.error('Failed to publish blog:', error);
      toast.error('Блог нийтлэхэд алдаа гарлаа');
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="flex">
      <div className="max-w-3xl w-full mx-auto">
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
          <div className="space-y-3">
            <Label>Хэл</Label>
            <Controller
              control={control}
              name="language"
              defaultValue="mn"
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Хэл сонгох" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mn">Монгол</SelectItem>
                    <SelectItem value="en">Англи</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <Controller
            control={control}
            name="categories"
            render={({ field }) => (
              <div className={cn(categoryError && 'border border-red-500 rounded-md p-2')}>
                {' '}
                {/* highlight error */}
                <EnhancedCategorySelector
                  categories={categories}
                  selectedCategories={field.value || []}
                  onSelectionChange={field.onChange}
                  label="Категориуд"
                  placeholder="Категориуд сонгох"
                  maxSelections={5}
                  showDescriptions={true}
                />
              </div>
            )}
          />

          <Controller
            control={control}
            name="title"
            rules={{
              required: 'Гарчиг заавал оруулна уу.',
            }}
            render={({ field, fieldState: { error } }) => (
              <div className="space-y-2">
                <TitleInput
                  value={field.value}
                  onChange={value => {
                    field.onChange(value);
                  }}
                  error={error}
                />
              </div>
            )}
          />
          <Controller
            control={control}
            name="thumbImage"
            rules={{
              required: 'Ковер зураг оруулна уу.',
            }}
            render={({ field, fieldState: { error } }) => (
              <ThumbImageUploader
                value={field.value}
                onUpload={async file => {
                  try {
                    const uploadedFile = await uploadFile(file);
                    field.onChange(uploadedFile.url);
                    return uploadedFile.url;
                  } catch (error) {
                    console.error('Failed to upload image:', error);
                    toast.error('Зураг оруулахад алдаа гарлаа');
                    throw error;
                  }
                }}
                error={error}
              />
            )}
          />

          <div className={cn(blockError && 'border border-red-500 rounded-md p-2')}>
            {' '}
            {/* highlight error */}
            {fields.map((block, index) => (
              <Controller
                key={block.id}
                control={control}
                name={`blocks.${index}`}
                render={({ field }) => {
                  return (
                    <BlockWrapper
                      key={block.id}
                      block={field.value}
                      notDelete={index === 0}
                      updateBlock={field.onChange}
                      remove={() => remove(index)}
                    ></BlockWrapper>
                  );
                }}
              />
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { type: 'text', name: 'Text', icon: <Type className="size-4" /> },
              { type: 'image', name: 'Image', icon: <ImageIcon className="size-4" /> },
              { type: 'video', name: 'Video', icon: <Video className="size-4" /> },
              // { type: 'gallery', name: 'Gallery', icon: <Images className="size-4" /> },
            ].map(item => (
              <Button
                key={item.type}
                type="button"
                variant="outline"
                className="flex gap-2"
                onClick={() => addBlock(item.type as Block['type'])}
              >
                {item.icon}
                {item.name}
              </Button>
            ))}
          </div>
          <div className="flex justify-end gap-4">
            <Button
              type="button"
              onClick={save}
              disabled={isLoading}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/50"
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Хадгалах
            </Button>
            <Button type="submit" disabled={isPublishing}>
              {isPublishing && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {mode === 'edit' && blog?.status === 'published' ? 'Шинэчлэх' : 'Нийтлэх'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
