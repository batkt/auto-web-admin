'use client';

import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Plus, Trash2 } from 'lucide-react';
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

type QuoteItem = {
  quote: TranslatedText;
  author: TranslatedText;
};

type QuoteFormData = {
  backgroundImage: string;
  items: QuoteItem[];
};

interface HomeQuoteEditorProps {
  data: QuoteFormData;
  onDataChange: (data: QuoteFormData) => void;
  sectionId?: string;
}

const HomeQuoteEditor = ({ data, onDataChange, sectionId }: HomeQuoteEditorProps) => {
  const { register, handleSubmit, watch, setValue, control } = useForm<QuoteFormData>({
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
    backgroundImage?: boolean;
  }>({});
  const [itemErrors, setItemErrors] = useState<{
    [key: number]: {
      quoteEn?: boolean;
      quoteMn?: boolean;
      authorEn?: boolean;
      authorMn?: boolean;
    };
  }>({});

  const onSubmit = async (values: QuoteFormData) => {
    // Validate main fields
    const newErrors: typeof errors = {};
    if (!values.backgroundImage?.trim()) newErrors.backgroundImage = true;
    setErrors(newErrors);

    // Validate all items
    const newItemErrors: typeof itemErrors = {};
    (values.items || []).forEach((item, idx) => {
      const err: { quoteEn?: boolean; quoteMn?: boolean; authorEn?: boolean; authorMn?: boolean } =
        {};
      if (!item.quote.en.trim()) err.quoteEn = true;
      if (!item.quote.mn.trim()) err.quoteMn = true;
      if (!item.author.en.trim()) err.authorEn = true;
      if (!item.author.mn.trim()) err.authorMn = true;
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
  const handleImageUpload = async file => {
    try {
      const response = await uploadFile(file);
      return response.url;
    } catch (error) {
      toast.error('Зураг оруулахад алдаа гарлаа');
      throw error;
    }
  };

  // Add new quote item
  const addQuoteItem = () => {
    const newItem: QuoteItem = {
      quote: { en: '', mn: '' },
      author: { en: '', mn: '' },
    };
    const currentItems = watchedValues.items || [];
    const updatedItems = [...currentItems, newItem];
    setValue('items', updatedItems);
    const currentValues = watch();
    onDataChange(currentValues);
  };

  // Remove quote item
  const removeQuoteItem = (index: number) => {
    const currentItems = watchedValues.items || [];
    const updatedItems = currentItems.filter((_: any, i: number) => i !== index);
    setValue('items', updatedItems);
    const currentValues = watch();
    onDataChange(currentValues);
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
            {/* Background Image Section */}
            <div className="space-y-4">
              <div className="space-y-3">
                <ImageUpload
                  mode="single"
                  value={watchedValues.backgroundImage || ''}
                  onChange={url => handleFieldChange('backgroundImage', url)}
                  onUpload={handleImageUpload}
                  className={cn('mt-1', errors.backgroundImage ? 'border-red-500' : '')}
                />

                {errors.backgroundImage && (
                  <p className="text-xs text-red-500 mt-1">Зураг шаардлагатай</p>
                )}
              </div>
            </div>

            <Separator />

            {/* Quote Items Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                  Ишлэл нэмэлт
                </h3>
              </div>

              <div className="space-y-4">
                {fields.map((item: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-700">Ишлэл {index + 1}</h4>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeQuoteItem(index)}
                        className="flex items-center gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        Устгах
                      </Button>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <Label
                          htmlFor={`quote-${index}-${lang}`}
                          className="text-sm font-medium text-gray-700"
                        >
                          Ишлэл
                        </Label>
                        <Textarea
                          id={`quote-${index}-${lang}`}
                          {...register(`items.${index}.quote.${lang}`)}
                          onChange={e =>
                            handleFieldChange(`items.${index}.quote.${lang}`, e.target.value)
                          }
                          className={cn(
                            'mt-1',
                            itemErrors[index]?.quoteEn || itemErrors[index]?.quoteMn
                              ? 'border-red-500'
                              : ''
                          )}
                          placeholder="Ишлэл оруулах"
                          rows={3}
                        />
                        {itemErrors[index]?.quoteEn && (
                          <p className="text-xs text-red-500 mt-1">Англи ишлэл шаардлагатай</p>
                        )}
                        {itemErrors[index]?.quoteMn && (
                          <p className="text-xs text-red-500 mt-1">Монгол ишлэл шаардлагатай</p>
                        )}
                      </div>

                      <div>
                        <Label
                          htmlFor={`author-${index}-${lang}`}
                          className="text-sm font-medium text-gray-700"
                        >
                          Зохиогч
                        </Label>
                        <Input
                          id={`author-${index}-${lang}`}
                          {...register(`items.${index}.author.${lang}`)}
                          onChange={e =>
                            handleFieldChange(`items.${index}.author.${lang}`, e.target.value)
                          }
                          className={cn(
                            'mt-1',
                            itemErrors[index]?.authorEn ? 'border-red-500' : ''
                          )}
                          placeholder="Зохиогчийн нэр оруулах"
                        />
                        {itemErrors[index]?.authorEn && (
                          <p className="text-xs text-red-500 mt-1">Англи зохиогч шаардлагатай</p>
                        )}
                        {itemErrors[index]?.authorMn && (
                          <p className="text-xs text-red-500 mt-1">Монгол зохиогч шаардлагатай</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <Button
                  type="button"
                  size="sm"
                  onClick={addQuoteItem}
                  className="flex items-center gap-1"
                >
                  <Plus className="h-3 w-3" />
                  Ишлэл нэмэх
                </Button>
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

export default HomeQuoteEditor;
