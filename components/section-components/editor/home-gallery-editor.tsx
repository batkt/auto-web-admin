'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ImageUpload } from '@/components/ui/image-upload';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2 } from 'lucide-react';
import { updateSectionData } from '@/lib/actions/section';
import { uploadFile } from '@/lib/actions/file';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import LanguageTabs from '../language-tabs';

type TranslatedText = { en: string; mn: string };

type Item = {
  proName: string;
  proComment: string;
  proImage: string;
};

type HomeGalleryFormData = {
  title: TranslatedText;
  secondaryTitle: TranslatedText;
  backgroundImage: string;
  item: Item[]; // ← бүх fieldArray энэ нэрийг ашиглана
};

interface HomeGalleryEditorProps {
  data: HomeGalleryFormData;
  onDataChange: (data: HomeGalleryFormData) => void;
  sectionId?: string;
}

const HomeGalleryEditor = ({ data, onDataChange, sectionId }: HomeGalleryEditorProps) => {
  const { register, handleSubmit, watch, setValue, control } = useForm<HomeGalleryFormData>({
    defaultValues: data,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'item', // ← зөв
  });

  const [lang, setLang] = useState<'en' | 'mn'>('en');
  const [isSaving, setIsSaving] = useState(false);
  const watchedValues = watch();

  const [errors, setErrors] = useState<{
    titleEn?: boolean;
    titleMn?: boolean;
    descriptionEn?: boolean;
    descriptionMn?: boolean;
  }>({});

  const [itemErrors, setItemErrors] = useState<{
    [key: number]: { proName?: boolean; proImage?: boolean };
  }>({});

  const onSubmit = async (values: HomeGalleryFormData) => {
    const newErrors: typeof errors = {};

    const newItemErrors: typeof itemErrors = {};

    setErrors(newErrors);
    setItemErrors(newItemErrors);

    if (Object.keys(newErrors).length || Object.keys(newItemErrors).length) {
      toast.error('Бүх талбарыг зөв бөглөнө үү.');
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

  // RHF state + эцэг компонент руу live дамжуулах
  const handleFieldChange = (field: any, value: any) => {
    setValue(field, value, { shouldDirty: true, shouldValidate: false, shouldTouch: true });
    const currentValues = watch();
    onDataChange(currentValues);
  };

  const handleChangeLang = (v: string) => setLang(v as 'en' | 'mn');

  const handleAddItem = () => {
    append({ proName: '', proComment: '', proImage: '' });
    onDataChange(watch());
  };

  const handleRemoveItem = (index: number) => {
    remove(index);
    onDataChange(watch());
  };

  // Upload function
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
                    className="mt-1"
                    placeholder="Гарчиг оруулах"
                  />
                </div>

                <div>
                  <Label htmlFor="secondaryTitle" className="text-sm font-medium text-gray-700">
                    2-р гарчиг
                  </Label>
                  <Textarea
                    id="secondaryTitle"
                    {...register(`secondaryTitle.${lang}`)}
                    onChange={e => handleFieldChange(`secondaryTitle.${lang}`, e.target.value)}
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
              </div>
            </div>

            <Separator />

            {/* Gallery Items Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                  Хэрэглэгчийн сэтгэгдлүүд
                </h3>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleAddItem}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-4 w-4" />
                  Нэмэх
                </Button>
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id ?? index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-700">Item {index + 1}</h4>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => handleRemoveItem(index)}
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        Устгах
                      </Button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Нэр</Label>
                        <Input
                          {...register(`item.${index}.proName` as const)}
                          onChange={e => handleFieldChange(`item.${index}.proName`, e.target.value)}
                          className="mt-1"
                          placeholder="Жишээ: Dior Homme"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Сэтгэгдэл</Label>
                        <Textarea
                          rows={3}
                          {...register(`item.${index}.proComment` as const)}
                          onChange={e =>
                            handleFieldChange(`item.${index}.proComment`, e.target.value)
                          }
                          placeholder="Тайлбар бичих"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Профайл зураг</Label>
                      <ImageUpload
                        mode="single"
                        value={watchedValues.item?.[index]?.proImage || ''}
                        onChange={value => handleFieldChange(`item.${index}.proImage`, value)}
                        onUpload={handleImageUpload}
                        maxFiles={1}
                        maxSize={5}
                        acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
                      />
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

export default HomeGalleryEditor;
