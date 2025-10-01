'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
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

type HelpItem = {
  icon: string;
  title: TranslatedText;
  description: TranslatedText;
};

type HelpFormData = {
  title: TranslatedText;
  subtitle: TranslatedText;
  backgroundImage: string;
  items: HelpItem[];
};

interface HomeHelpEditorProps {
  data: HelpFormData;
  onDataChange: (data: HelpFormData) => void;
  sectionId?: string;
}

const HomeHelpEditor = ({ data, onDataChange, sectionId }: HomeHelpEditorProps) => {
  const { register, handleSubmit, watch, setValue, control } = useForm<HelpFormData>({
    defaultValues: data,
  });

  const { fields } = useFieldArray({
    control,
    name: 'items',
  });

  const [lang, setLang] = useState<'en' | 'mn'>('en');
  const [isSaving, setIsSaving] = useState(false);
  const watchedValues = watch();
  const [errors, setErrors] = useState<{
    titleEn?: boolean;
    titleMn?: boolean;
    subtitleEn?: boolean;
    subtitleMn?: boolean;
    backgroundImage?: boolean;
  }>({});
  const [itemErrors, setItemErrors] = useState<{
    [key: number]: {
      titleEn?: boolean;
      titleMn?: boolean;
      descriptionEn?: boolean;
      descriptionMn?: boolean;
    };
  }>({});

  const onSubmit = async (values: HelpFormData) => {
    // Validate main fields
    const newErrors: typeof errors = {};
    if (!values.title.en.trim()) newErrors.titleEn = true;
    if (!values.title.mn.trim()) newErrors.titleMn = true;
    if (!values.subtitle.en.trim()) newErrors.subtitleEn = true;
    if (!values.subtitle.mn.trim()) newErrors.subtitleMn = true;
    if (!values.backgroundImage?.trim()) newErrors.backgroundImage = true;
    setErrors(newErrors);

    // Validate all items
    const newItemErrors: typeof itemErrors = {};
    (values.items || []).forEach((item, idx) => {
      const err: {
        titleEn?: boolean;
        titleMn?: boolean;
        descriptionEn?: boolean;
        descriptionMn?: boolean;
        icon?: boolean;
      } = {};
      if (!item.title.en.trim()) err.titleEn = true;
      if (!item.title.mn.trim()) err.titleMn = true;
      if (!item.description.en.trim()) err.descriptionEn = true;
      if (!item.description.mn.trim()) err.descriptionMn = true;
      if (Object.keys(err).length > 0) newItemErrors[idx] = err;
    });
    setItemErrors(newItemErrors);

    if (Object.keys(newErrors).length > 0 || Object.keys(newItemErrors).length > 0) {
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
                  <Label htmlFor="subtitle" className="text-sm font-medium text-gray-700">
                    Дэд гарчиг
                  </Label>
                  <Input
                    id="subtitle"
                    {...register(`subtitle.${lang}`)}
                    onChange={e => handleFieldChange(`subtitle.${lang}`, e.target.value)}
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
              </div>
            </div>

            <Separator />

            {/* Background Image Section */}
            <div className="space-y-4">
              <div className="space-y-3">
                <ImageUpload
                  mode="single"
                  value={watchedValues.backgroundImage}
                  onChange={value => handleFieldChange('backgroundImage', value)}
                  onUpload={handleImageUpload}
                  maxSize={5}
                  acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
                  className={cn('mt-1', errors.backgroundImage ? 'border-red-500' : '')}
                />

                {errors.backgroundImage && (
                  <p className="text-red-500 text-xs mt-1">Зураг заавал оруулах</p>
                )}
              </div>
            </div>

            <Separator />

            {/* Help Items Section */}
            <div className="space-y-4">
              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-700">Тусламж {index + 1}</h4>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">Гарчиг</Label>
                      <Input
                        {...register(`items.${index}.title.${lang}`)}
                        onChange={e =>
                          handleFieldChange(`items.${index}.title.${lang}`, e.target.value)
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
                      <Label className="text-sm font-medium text-gray-700">Тайлбар</Label>
                      <Textarea
                        {...register(`items.${index}.description.${lang}`)}
                        onChange={e =>
                          handleFieldChange(`items.${index}.description.${lang}`, e.target.value)
                        }
                        className={cn(
                          'mt-1',
                          itemErrors[index]?.descriptionEn || itemErrors[index]?.descriptionMn
                            ? 'border-red-500'
                            : ''
                        )}
                        placeholder="Тайлбар оруулах"
                        rows={2}
                      />
                      {itemErrors[index]?.descriptionEn && (
                        <p className="text-red-500 text-xs mt-1">
                          Англи хэлний тайлбар заавал бөглөх
                        </p>
                      )}
                      {itemErrors[index]?.descriptionMn && (
                        <p className="text-red-500 text-xs mt-1">
                          Монгол хэлний тайлбар заавал бөглөх
                        </p>
                      )}
                    </div>
                  </div>
                ))}

                {fields.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>Одоогоор тусламжийн жагсаалт нэмэгдээгүй байна.</p>
                    <p className="text-sm">
                      &quot;Нэмэх&quot; товчийг дарж тусламжийн жагсаалт нэмж эхлээрэй.
                    </p>
                  </div>
                )}
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

export default HomeHelpEditor;
