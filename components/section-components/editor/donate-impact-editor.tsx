'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { updateSectionData } from '@/lib/actions/section';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import LanguageTabs from '../language-tabs';

type TranslatedText = {
  en: string;
  mn: string;
};

type ImpactItem = {
  title: TranslatedText;
  description: TranslatedText;
};

type DonateImpactFormData = {
  title: TranslatedText;
  description: TranslatedText;
  items: ImpactItem[];
};

interface DonateImpactEditorProps {
  data: any;
  onDataChange: (updatedData: any) => void;
  sectionId?: string;
}

const DonateImpactEditor = ({ data, onDataChange, sectionId }: DonateImpactEditorProps) => {
  // Ensure data has proper structure with items array
  const defaultData = {
    title: { en: '', mn: '' },
    description: { en: '', mn: '' },
    items: [],
    ...data,
  };

  const { register, handleSubmit, watch, setValue } = useForm<DonateImpactFormData>({
    defaultValues: defaultData,
  });

  const [lang, setLang] = useState<'en' | 'mn'>('en');
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{
    titleEn?: boolean;
    titleMn?: boolean;
    descEn?: boolean;
    descMn?: boolean;
  }>({});
  const [itemErrors, setItemErrors] = useState<{
    [key: number]: { titleEn?: boolean; titleMn?: boolean; descEn?: boolean; descMn?: boolean };
  }>({});

  const onSubmit = async (values: DonateImpactFormData) => {
    // Validate main fields
    const newErrors: typeof errors = {};
    if (!values.title.en?.trim()) newErrors.titleEn = true;
    if (!values.title.mn?.trim()) newErrors.titleMn = true;
    if (!values.description.en?.trim()) newErrors.descEn = true;
    if (!values.description.mn?.trim()) newErrors.descMn = true;
    setErrors(newErrors);

    // Validate all items
    const newItemErrors: typeof itemErrors = {};
    (values.items || []).forEach((item, idx) => {
      const err: { titleEn?: boolean; titleMn?: boolean; descEn?: boolean; descMn?: boolean } = {};
      if (!item.title.en?.trim()) err.titleEn = true;
      if (!item.title.mn?.trim()) err.titleMn = true;
      if (!item.description.en?.trim()) err.descEn = true;
      if (!item.description.mn?.trim()) err.descMn = true;
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
                    placeholder="Гарчиг оруулах"
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
                    className={cn('mt-1', errors.descEn || errors.descMn ? 'border-red-500' : '')}
                    placeholder="Тайлбар оруулах"
                    rows={3}
                  />
                  {errors.descEn && (
                    <p className="text-xs text-red-500 mt-1">Англи тайлбар шаардлагатай</p>
                  )}
                  {errors.descMn && (
                    <p className="text-xs text-red-500 mt-1">Монгол тайлбар шаардлагатай</p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* Impact Items Section */}
            <div className="space-y-4">
              <div className="space-y-4">
                {[0, 1, 2, 3].map(index => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <h4 className="text-sm font-medium text-gray-700">Хэсэг {index + 1}</h4>

                    <div className="space-y-3">
                      <div>
                        <Label className="text-sm font-medium text-gray-700">Гарчиг</Label>
                        <Input
                          {...register(`items.${index}.title.${lang}`)}
                          onChange={e =>
                            handleFieldChange(`items.${index}.title.${lang}`, e.target.value)
                          }
                          className={cn(
                            'mt-1',
                            itemErrors[index]?.titleEn && 'border-red-500 focus:ring-red-500'
                          )}
                          placeholder="Гарчиг оруулах"
                        />
                        {itemErrors[index]?.titleEn && (
                          <p className="text-xs text-red-500 mt-1">Англи гарчиг шаардлагатай</p>
                        )}
                        {itemErrors[index]?.titleMn && (
                          <p className="text-xs text-red-500 mt-1">Монгол гарчиг шаардлагатай</p>
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
                            itemErrors[index]?.descEn && 'border-red-500 focus:ring-red-500'
                          )}
                          placeholder="Тайлбар оруулах"
                          rows={2}
                        />
                        {itemErrors[index]?.descEn && (
                          <p className="text-xs text-red-500 mt-1">Англи тайлбар шаардлагатай</p>
                        )}
                        {itemErrors[index]?.descMn && (
                          <p className="text-xs text-red-500 mt-1">Монгол тайлбар шаардлагатай</p>
                        )}
                      </div>
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

export default DonateImpactEditor;
