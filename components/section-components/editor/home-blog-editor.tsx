'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/ui/image-upload';
import { Separator } from '@/components/ui/separator';

import { uploadFile } from '@/lib/actions/file';

import { updateSectionData } from '@/lib/actions/section';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import LanguageTabs from '../language-tabs';

type TranslatedText = {
  en: string;
  mn: string;
};

type HomeBlogFormData = {
  title: TranslatedText;
  secondaryTitle: TranslatedText;
  description: TranslatedText;
  backgroundImage: string;
};

interface HomeBlogEditorProps {
  data: HomeBlogFormData;
  onDataChange: (data: HomeBlogFormData) => void;
  sectionId?: string;
}

const HomeBlogEditor = ({ data, onDataChange, sectionId }: HomeBlogEditorProps) => {
  const { register, handleSubmit, watch, setValue } = useForm<HomeBlogFormData>({
    defaultValues: data,
  });
  const watchedValues = watch();

  const [lang, setLang] = useState<'en' | 'mn'>('en');
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{
    titleEn?: boolean;
    titleMn?: boolean;
    secondaryTitleEn?: boolean;
    secondaryTitleMn?: boolean;

    descriptionEn?: boolean;
    descriptionMn?: boolean;
  }>({});

  const onSubmit = async (values: HomeBlogFormData) => {
    const newErrors: typeof errors = {};
    if (!values.title.en.trim()) newErrors.titleEn = true;
    if (!values.title.mn.trim()) newErrors.titleMn = true;
    if (!values.secondaryTitle.en.trim()) newErrors.secondaryTitleEn = true;
    if (!values.secondaryTitle.mn.trim()) newErrors.titleMn = true;

    if (!values.description.en.trim()) newErrors.descriptionEn = true;
    if (!values.description.mn.trim()) newErrors.descriptionMn = true;

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error('Бүх талбарыг бүрэн бөглөнө үү');
      return;
    }

    if (!sectionId) {
      console.log('📝 Submitted Values:', values);
      onDataChange(values);
      return;
    }

    setIsSaving(true);
    try {
      const response = await updateSectionData(sectionId, values);
      if (response.code === 200) {
        toast.success('Амжилттай хадгалагдлаа');
        onDataChange(values);
      } else {
        throw new Error(response.message || 'Хадгалахад алдаа гарлаа');
      }
    } catch (error) {
      console.error('Error saving section data:', error);
      const errorMessage = error instanceof Error ? error.message : 'Хадгалахад алдаа гарлаа';
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle real-time updates on field changes
  const handleFieldChange = (field: any, value: any) => {
    setValue(field, value);
    const currentValues = watch();
    onDataChange(currentValues);
  };

  const handleChangeLang = (v: string) => {
    setLang(v as 'en' | 'mn');
  };
  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      const uploadedFile = await uploadFile(file);
      return uploadedFile.url;
    } catch (error) {
      console.error('Error uploading file:', error);
      toast.error('Зураг оруулахад алдаа гарлаа');
      throw error;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Sidebar Header - Fixed */}
      <div className="p-6 border-b border-gray-200 flex-shrink-0">
        <LanguageTabs lang={lang} handleChangeLang={handleChangeLang} />
      </div>

      {/* Sidebar Content - Scrollable */}
      <div className="flex-1 overflow-y-auto">
        <form key={lang} onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col">
          <div className="p-6 space-y-6">
            {/* Main Content Section */}
            <div className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                    Гарчиг
                  </Label>
                  <Input
                    id="title"
                    {...register(`title.${lang}`)}
                    onChange={e => handleFieldChange(`title.${lang}`, e.target.value)}
                    className={cn('mt-1', errors.titleEn || errors.titleMn ? 'border-red-500' : '')}
                    placeholder="Гарчиг оруулах"
                  />
                  {errors.titleEn && (
                    <p className="text-red-500 text-xs mt-1">Англи хэлний гарчиг заавал бөглөх</p>
                  )}
                  {errors.titleMn && (
                    <p className="text-red-500 text-xs mt-1">Монгол хэлний гарчиг заавал бөглөх</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                    2-р Гарчиг
                  </Label>
                  <Input
                    id="title"
                    {...register(`secondaryTitle.${lang}`)}
                    onChange={e => handleFieldChange(`secondaryTitle.${lang}`, e.target.value)}
                    className={cn(
                      'mt-1',
                      errors.secondaryTitleEn || errors.secondaryTitleEn ? 'border-red-500' : ''
                    )}
                    placeholder="Гарчиг оруулах"
                  />
                  {errors.titleEn && (
                    <p className="text-red-500 text-xs mt-1">Англи хэлний гарчиг заавал бөглөх</p>
                  )}
                  {errors.titleMn && (
                    <p className="text-red-500 text-xs mt-1">Монгол хэлний гарчиг заавал бөглөх</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                    Тайлбар
                  </Label>
                  <Textarea
                    id="description"
                    {...register(`description.${lang}`)}
                    onChange={e => handleFieldChange(`description.${lang}`, e.target.value)}
                    className={cn(
                      'mt-1',
                      errors.descriptionEn || errors.descriptionMn ? 'border-red-500' : ''
                    )}
                    placeholder="Тайлбар оруулах"
                    rows={3}
                  />
                  {errors.descriptionEn && (
                    <p className="text-red-500 text-xs mt-1">Англи хэлний тайлбар заавал бөглөх</p>
                  )}
                  {errors.descriptionMn && (
                    <p className="text-red-500 text-xs mt-1">Монгол хэлний тайлбар заавал бөглөх</p>
                  )}
                </div>

                <Separator />
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                    Арын зураг
                  </h3>
                  <ImageUpload
                    mode="single"
                    value={watchedValues.backgroundImage || ''}
                    onChange={value => handleFieldChange('backgroundImage', value as string)}
                    onUpload={handleImageUpload}
                    maxFiles={1}
                    maxSize={5}
                    acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
                  />
                  <p className="text-xs text-gray-500">
                    Нүүрэн дээр харагдах гол зураг. Ил тод фон (PNG) зөвлөмжтэй.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* Sidebar Footer - Fixed */}
      <div className="p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
        <Button
          type="submit"
          className="w-full"
          onClick={handleSubmit(onSubmit)}
          disabled={isSaving}
        >
          {isSaving ? 'Хадгалж байна...' : 'Хадгалах'}
        </Button>
      </div>
    </div>
  );
};

export default HomeBlogEditor;
