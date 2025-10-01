'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/ui/image-upload';
import { updateSectionData } from '@/lib/actions/section';
import { uploadFile } from '@/lib/actions/file';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Controller } from 'react-hook-form';
import LanguageTabs from '../language-tabs';

type TranslatedText = {
  en: string;
  mn: string;
};

type ContactHeroFormData = {
  title: TranslatedText;
  description: TranslatedText;
  image: string;
};

interface ContactHeroEditorProps {
  data: any;
  onDataChange: (updatedData: any) => void;
  sectionId?: string;
}

const ContactHeroEditor = ({ data, onDataChange, sectionId }: ContactHeroEditorProps) => {
  const { register, handleSubmit, watch, setValue, control } = useForm<ContactHeroFormData>({
    defaultValues: data,
  });

  const [lang, setLang] = useState<'en' | 'mn'>('en');
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{
    titleEn?: boolean;
    titleMn?: boolean;
    descriptionEn?: boolean;
    descriptionMn?: boolean;
    image?: boolean;
  }>({});

  const onSubmit = async (values: ContactHeroFormData) => {
    const newErrors: typeof errors = {};
    if (!values.title.en?.trim()) newErrors.titleEn = true;
    if (!values.title.mn?.trim()) newErrors.titleMn = true;
    if (!values.description.en?.trim()) newErrors.descriptionEn = true;
    if (!values.description.mn?.trim()) newErrors.descriptionMn = true;
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

  // Upload function using the actual API
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
          <div className="p-6 space-y-6 flex-1">
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
                    className={cn('mt-1', errors.titleEn || errors.titleMn ? 'border-red-500' : '')}
                    placeholder={
                      lang === 'en'
                        ? 'Enter title in English'
                        : 'Гарчигийг монгол хэлээр оруулна уу'
                    }
                  />
                  {errors.titleEn && (
                    <p className="text-xs text-red-500 mt-1">Англи гарчиг шаардлагатай</p>
                  )}
                  {errors.titleMn && (
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
                    className={cn(
                      'mt-1',
                      errors.descriptionEn || errors.descriptionMn ? 'border-red-500' : ''
                    )}
                    placeholder={
                      lang === 'en'
                        ? 'Enter description in English'
                        : 'Тайлбарыг монгол хэлээр оруулна уу'
                    }
                    rows={3}
                  />
                  {errors.descriptionEn && (
                    <p className="text-xs text-red-500 mt-1">Англи тайлбар шаардлагатай</p>
                  )}
                  {errors.descriptionMn && (
                    <p className="text-xs text-red-500 mt-1">Монгол тайлбар шаардлагатай</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="image" className="text-sm font-medium text-gray-700">
                    Зураг <span className="text-red-500">*</span>
                  </Label>
                  <Controller
                    control={control}
                    name="image"
                    render={({ field }) => (
                      <ImageUpload
                        mode="single"
                        value={field.value}
                        onChange={value => handleFieldChange('image', value)}
                        onUpload={handleImageUpload}
                        className={cn('mt-1', errors.image && 'border-red-500')}
                      />
                    )}
                  />
                  {errors.image && <p className="text-xs text-red-500 mt-1">Зураг оруулна уу</p>}
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

export default ContactHeroEditor;
