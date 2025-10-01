'use client';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ImageUpload } from '@/components/ui/image-upload';
import { updateSectionData } from '@/lib/actions/section';
import { uploadFile } from '@/lib/actions/file';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import LanguageTabs from '../language-tabs';

type TranslatedText = {
  en: string;
  mn: string;
};

type AboutStructureFormData = {
  title: TranslatedText;
  description: TranslatedText;
  image: string;
};

interface AboutStructureEditorProps {
  data: AboutStructureFormData;
  onDataChange: (data: AboutStructureFormData) => void;
  sectionId?: string;
}

const AboutStructureEditor = ({ data, onDataChange, sectionId }: AboutStructureEditorProps) => {
  const { register, handleSubmit, watch, setValue, control } = useForm<AboutStructureFormData>({
    defaultValues: data,
  });

  const [lang, setLang] = useState<'en' | 'mn'>('en');
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{
    titleEn?: boolean;
    titleMn?: boolean;
    descEn?: boolean;
    descMn?: boolean;
    image?: boolean;
  }>({});

  const onSubmit = async (values: AboutStructureFormData) => {
    const newErrors: typeof errors = {};
    if (!values.title.en.trim()) newErrors.titleEn = true;
    if (!values.title.mn.trim()) newErrors.titleMn = true;
    if (!values.description.en.trim()) newErrors.descEn = true;
    if (!values.description.mn.trim()) newErrors.descMn = true;
    if (!values.image) newErrors.image = true;
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      toast.error('Бүх талбарыг бүрэн бөглөнө үү');
      return;
    }

    if (!sectionId) {
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

  // Real file upload function using the API
  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      const response = await uploadFile(file);
      console.log('response ', response);
      return response.url;
    } catch (error) {
      console.error('Error uploading file:', error);
      const errorMessage = error instanceof Error ? error.message : 'Файл хуулж амжилтгүй';
      toast.error(errorMessage);
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
                    Гарчиг <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="title"
                    {...register(`title.${lang}`)}
                    onChange={e => handleFieldChange(`title.${lang}`, e.target.value)}
                    className={cn('mt-1', errors.titleEn && 'border-red-500')}
                    placeholder={
                      lang === 'en'
                        ? 'Enter title in English'
                        : 'Гарчигийг монгол хэлээр оруулна уу'
                    }
                  />
                  {errors.titleEn && lang === 'en' && (
                    <p className="text-xs text-red-500 mt-1">Англи гарчиг шаардлагатай</p>
                  )}
                  {errors.titleMn && lang === 'mn' && (
                    <p className="text-xs text-red-500 mt-1">Монгол гарчиг шаардлагатай</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                    Тайлбар <span className="text-red-500">*</span>
                  </Label>
                  <Textarea
                    id="description"
                    {...register(`description.${lang}`)}
                    onChange={e => handleFieldChange(`description.${lang}`, e.target.value)}
                    className={cn('mt-1', errors.descEn && 'border-red-500')}
                    placeholder={
                      lang === 'en'
                        ? 'Enter description in English'
                        : 'Тайлбарыг монгол хэлээр оруулна уу'
                    }
                    rows={3}
                  />
                  {errors.descEn && lang === 'en' && (
                    <p className="text-xs text-red-500 mt-1">Англи тайлбар шаардлагатай</p>
                  )}
                  {errors.descMn && lang === 'mn' && (
                    <p className="text-xs text-red-500 mt-1">Монгол тайлбар шаардлагатай</p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Image Section */}
            <div className="space-y-4">
              <Controller
                control={control}
                name="image"
                render={({ field, fieldState }) => (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">
                      Зураг оруулах <span className="text-red-500">*</span>
                    </Label>

                    <ImageUpload
                      mode="single"
                      value={field.value}
                      onChange={value => {
                        handleFieldChange('image', value);
                      }}
                      onUpload={handleImageUpload}
                      maxSize={5}
                      acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
                      className={cn('mt-1', errors.image && 'border-red-500')}
                    />
                    {fieldState.error && (
                      <p className="text-xs text-red-500 mt-1">Зураг оруулна уу</p>
                    )}
                  </div>
                )}
              />
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

export default AboutStructureEditor;
