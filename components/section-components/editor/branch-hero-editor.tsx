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
import { Controller } from 'react-hook-form';
import LanguageTabs from '../language-tabs';

type TranslatedText = {
  en: string;
  mn: string;
};

type StatsItem = {
  name: TranslatedText;
  stats: string;
};

type BranchHeroFormData = {
  title: TranslatedText;
  description: TranslatedText;
  image: string;
  items: StatsItem[];
};

interface BranchHeroEditorProps {
  data: any;
  onDataChange: (updatedData: any) => void;
  sectionId?: string;
}

const BranchHeroEditor = ({ data, onDataChange, sectionId }: BranchHeroEditorProps) => {
  const { register, handleSubmit, watch, setValue, control } = useForm<BranchHeroFormData>({
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
  const [itemErrors, setItemErrors] = useState<{
    [key: number]: {
      titleEn?: boolean;
      titleMn?: boolean;
      stats?: boolean;
    };
  }>({});

  const onSubmit = async (values: BranchHeroFormData) => {
    const newErrors: typeof errors = {};
    if (!values.title.en?.trim()) newErrors.titleEn = true;
    if (!values.title.mn?.trim()) newErrors.titleMn = true;
    if (!values.description.en?.trim()) newErrors.descriptionEn = true;
    if (!values.description.mn?.trim()) newErrors.descriptionMn = true;
    if (!values.image) newErrors.image = true;
    setErrors(newErrors);

    // Validate all items
    const newItemErrors: typeof itemErrors = {};
    (values.items || []).forEach((item, idx) => {
      const err: { titleEn?: boolean; titleMn?: boolean; stats?: boolean } = {};
      if (!item.name?.en?.trim()) err.titleEn = true;
      if (!item.name?.mn?.trim()) err.titleMn = true;
      if (!item.stats?.trim()) err.stats = true;
      if (Object.keys(err).length > 0) newItemErrors[idx] = err;
    });
    setItemErrors(newItemErrors);

    if (Object.keys(newErrors).length > 0 || Object.keys(newItemErrors).length > 0) {
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

            <Separator />

            {/* Statistics Section */}
            <div className="space-y-4">
              <div className="space-y-3">
                {[0, 1, 2].map(index => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-700">Статистик {index + 1}</h4>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">Гарчиг</Label>
                      <Input
                        {...register(`items.${index}.name.${lang}`)}
                        onChange={e =>
                          handleFieldChange(`items.${index}.name.${lang}`, e.target.value)
                        }
                        className={cn(
                          'mt-1',
                          itemErrors[index]?.titleEn || itemErrors[index]?.titleMn
                            ? 'border-red-500'
                            : ''
                        )}
                        placeholder="Гарчиг оруулах"
                      />
                      {itemErrors[index]?.titleEn && (
                        <p className="text-red-500 text-xs mt-1">
                          Англи хэлний гарчиг заавал бөглөх
                        </p>
                      )}
                      {itemErrors[index]?.titleMn && (
                        <p className="text-red-500 text-xs mt-1">
                          Монгол хэлний гарчиг заавал бөглөх
                        </p>
                      )}
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">Тоо утга</Label>
                      <Input
                        {...register(`items.${index}.stats`)}
                        onChange={e => handleFieldChange(`items.${index}.stats`, e.target.value)}
                        className={cn('mt-1', itemErrors[index]?.stats ? 'border-red-500' : '')}
                        placeholder="Тоо утга оруулах"
                      />
                      {itemErrors[index]?.stats && (
                        <p className="text-red-500 text-xs mt-1">Тоо утга заавал бөглөх</p>
                      )}
                    </div>
                  </div>
                ))}
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

export default BranchHeroEditor;
