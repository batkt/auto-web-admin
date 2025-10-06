'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
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

type HeroFormData = {
  mainTitle: TranslatedText;
  ctaText: TranslatedText;
  ctaUrl: string;
  backgroundImage: string;
  secondaryTitle: TranslatedText;
  description: TranslatedText;
  productImage: string;
};

interface HomeHeroEditorProps {
  data: any;
  onDataChange: (updatedData: any) => void;
  sectionId?: string;
}

const HomeHeroEditor = ({ data, onDataChange, sectionId }: HomeHeroEditorProps) => {
  const { register, handleSubmit, watch, setValue } = useForm<HeroFormData>({
    defaultValues: data,
  });

  const [lang, setLang] = useState<'en' | 'mn'>('en');
  const [isSaving, setIsSaving] = useState(false);
  const watchedValues = watch();
  const [statsError, setStatsError] = useState<
    | {
        key: string;
        value: boolean;
      }
    | undefined
  >();

  const [errors, setErrors] = useState<{
    titleEn?: boolean;
    titleMn?: boolean;
    subtitleEn?: boolean;
    subtitleMn?: boolean;
    ctaUrl?: boolean;
  }>({});

  const onSubmit = async (values: HeroFormData) => {
    const newErrors: typeof errors = {};
    if (!values.mainTitle.en.trim()) newErrors.titleEn = true;
    if (!values.mainTitle.mn.trim()) newErrors.titleMn = true;
    if (!values.secondaryTitle.en.trim()) newErrors.titleEn = true;
    if (!values.secondaryTitle.mn.trim()) newErrors.titleEn = true;
    if (!values.description.en.trim()) newErrors.titleEn = true;
    if (!values.description.mn.trim()) newErrors.titleEn = true;

    if (!values.ctaText.en.trim()) newErrors.subtitleEn = true;
    if (!values.ctaText.mn.trim()) newErrors.subtitleMn = true;

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
          <div className="p-6 space-y-6">
            {/* Main Content Section */}
            <div className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label htmlFor="mainTitle" className="text-sm font-medium text-gray-700">
                    Гарчиг
                  </Label>
                  <Input
                    id="mainTitle"
                    {...register(`mainTitle.${lang}`)}
                    onChange={e => handleFieldChange(`mainTitle.${lang}`, e.target.value)}
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
                  <Label htmlFor="secondaryTitle" className="text-sm font-medium text-gray-700">
                    2 дахь гарчиг
                  </Label>
                  <Input
                    id="secondaryTitle"
                    {...register(`secondaryTitle.${lang}`)}
                    onChange={e => handleFieldChange(`secondaryTitle.${lang}`, e.target.value)}
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
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                    Цогцолбор нэмэх
                  </Label>
                  <Input
                    id="description"
                    {...register(`description.${lang}`)}
                    onChange={e => handleFieldChange(`description.${lang}`, e.target.value)}
                    className={cn('mt-1', errors.titleEn || errors.titleMn ? 'border-red-500' : '')}
                    placeholder="Цогцолбор оруулах"
                  />
                  {errors.titleEn && (
                    <p className="text-red-500 text-xs mt-1">Англи хэлний гарчиг заавал бөглөх</p>
                  )}
                  {errors.titleMn && (
                    <p className="text-red-500 text-xs mt-1">Монгол хэлний гарчиг заавал бөглөх</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="ctaText" className="text-sm font-medium text-gray-700">
                    CTA Text
                  </Label>
                  <Input
                    id="ctaText"
                    {...register(`ctaText.${lang}`)}
                    onChange={e => handleFieldChange(`ctaText.${lang}`, e.target.value)}
                    className={cn(
                      'mt-1',
                      errors.subtitleEn || errors.subtitleMn ? 'border-red-500' : ''
                    )}
                    placeholder="Дэд гарчиг оруулах"
                  />
                  {errors.subtitleEn && (
                    <p className="text-red-500 text-xs mt-1">
                      Англи хэлний дэд гарчиг заавал бөглөх
                    </p>
                  )}
                  {errors.subtitleMn && (
                    <p className="text-red-500 text-xs mt-1">
                      Монгол хэлний дэд гарчиг заавал бөглөх
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="ctaUrl" className="text-sm font-medium text-gray-700">
                    CTA URL
                  </Label>
                  <Input
                    id="ctaUrl"
                    {...register('ctaUrl')}
                    onChange={e => handleFieldChange('ctaUrl', e.target.value)}
                    className="mt-1"
                    placeholder="https://example.com"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Background Images Section */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Арын Зураг
              </h3>

              <div className="space-y-3">
                <ImageUpload
                  mode="single"
                  value={watchedValues.backgroundImage || ''}
                  onChange={value => handleFieldChange('backgroundImage', value)}
                  onUpload={handleImageUpload}
                  maxFiles={1}
                  maxSize={5}
                  acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
                />
              </div>
            </div>

            <Separator />
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Бүтээгдэхүүний Зураг
              </h3>

              <div className="space-y-3">
                <ImageUpload
                  mode="single"
                  value={watchedValues.productImage || ''}
                  onChange={value => handleFieldChange('productImage', value)}
                  onUpload={handleImageUpload}
                  maxFiles={1}
                  maxSize={5}
                  acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
                />
              </div>
            </div>

            {/* Statistics Section */}
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

export default HomeHeroEditor;
