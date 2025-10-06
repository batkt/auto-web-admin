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
import { uploadFile } from '@/lib/actions/file';
import { updateSectionData } from '@/lib/actions/section';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import LanguageTabs from '../language-tabs';

type TranslatedText = { en: string; mn: string };

type ProductItem = {
  productImage: string;
  name: TranslatedText;
  model: string;
  description: TranslatedText;
  price: string;
};

type HomeQuoteFormData = {
  title: TranslatedText;
  secondaryTitle: TranslatedText;
  description: TranslatedText;
  backgroundImage: string;
  items: ProductItem[];
};

interface HomeQuoteEditorProps {
  data: HomeQuoteFormData;
  onDataChange: (data: HomeQuoteFormData) => void;
  sectionId?: string;
}

const HomeQuoteEditor = ({ data, onDataChange, sectionId }: HomeQuoteEditorProps) => {
  const { register, handleSubmit, watch, setValue, control } = useForm<HomeQuoteFormData>({
    defaultValues: {
      ...data,
      items: data?.items ?? [],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  const values = watch();

  const [lang, setLang] = useState<'en' | 'mn'>('en');
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{ titleEn?: boolean; titleMn?: boolean }>({});
  const [itemErrors, setItemErrors] = useState<
    Record<number, { nameEn?: boolean; nameMn?: boolean }>
  >({});

  const handleFieldChange = (field: any, value: any) => {
    setValue(field, value, { shouldDirty: true });
    onDataChange(watch());
  };

  const handleChangeLang = (v: string) => setLang(v as 'en' | 'mn');

  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      const uploaded = await uploadFile(file);
      return uploaded.url;
    } catch (e) {
      console.error(e);
      toast.error('Зураг оруулахад алдаа гарлаа');
      throw e;
    }
  };

  const addProduct = () => {
    append({
      productImage: '',
      name: { en: '', mn: '' },
      model: '',
      description: { en: '', mn: '' },
      price: '',
    });
    onDataChange(watch());
  };

  const removeProduct = (idx: number) => {
    remove(idx);
    onDataChange(watch());
  };

  const onSubmit = async (form: HomeQuoteFormData) => {
    const newErrors: typeof errors = {};
    if (!form.title.en?.trim()) newErrors.titleEn = true;
    if (!form.title.mn?.trim()) newErrors.titleMn = true;

    const newItemErrors: typeof itemErrors = {};
    form.items?.forEach((it, i) => {
      const err: { nameEn?: boolean; nameMn?: boolean } = {};
      if (!it.name?.en?.trim()) err.nameEn = true;
      if (!it.name?.mn?.trim()) err.nameMn = true;
      if (Object.keys(err).length) newItemErrors[i] = err;
    });

    setErrors(newErrors);
    setItemErrors(newItemErrors);

    if (Object.keys(newErrors).length || Object.keys(newItemErrors).length) {
      toast.error('Бүх шаардлагатай талбарыг бөглөнө үү');
      return;
    }

    if (!sectionId) {
      onDataChange(form);
      return;
    }

    setIsSaving(true);
    try {
      const res = await updateSectionData(sectionId, form);
      if (res.code === 200) {
        toast.success('Амжилттай хадгаллаа');
        onDataChange(form);
      } else {
        throw new Error(res.message || 'Хадгалахад алдаа гарлаа');
      }
    } catch (e: any) {
      console.error(e);
      toast.error(e?.message ?? 'Хадгалахад алдаа гарлаа');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-full  flex flex-col">
      <div className="p-6 border-b border-gray-200 flex-shrink-0">
        <LanguageTabs lang={lang} handleChangeLang={handleChangeLang} />
      </div>

      <div className="flex-1 overflow-y-auto">
        <form key={lang} onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col">
          <div className="p-6 space-y-8">
            <div className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Гарчиг</Label>
                  <Input
                    {...register(`title.${lang}`)}
                    onChange={e => handleFieldChange(`title.${lang}`, e.target.value)}
                    className={cn('mt-1', errors.titleEn || errors.titleMn ? 'border-red-500' : '')}
                    placeholder="Гарчиг оруулах"
                  />
                  {errors.titleEn && (
                    <p className="text-red-500 text-xs mt-1">Англи гарчиг шаардлагатай</p>
                  )}
                  {errors.titleMn && (
                    <p className="text-red-500 text-xs mt-1">Монгол гарчиг шаардлагатай</p>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">2-р Гарчиг</Label>
                  <Input
                    {...register(`secondaryTitle.${lang}`)}
                    onChange={e => handleFieldChange(`secondaryTitle.${lang}`, e.target.value)}
                    className="mt-1"
                    placeholder="Хоёрдогч гарчиг"
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                    Арын зураг
                  </h3>
                  <ImageUpload
                    mode="single"
                    value={values.backgroundImage || ''}
                    onChange={v => handleFieldChange('backgroundImage', v as string)}
                    onUpload={handleImageUpload}
                    maxFiles={1}
                    maxSize={5}
                    acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
                  />
                  <p className="text-xs text-gray-500">Нүүрэн дээр харагдах арын зураг.</p>
                </div>
              </div>
            </div>

            <Separator />
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-semibold">Products</h3>
                <Button type="button" size="sm" onClick={addProduct} className="gap-1">
                  <Plus className="h-4 w-4" /> Нэмэх
                </Button>
              </div>

              <div className="space-y-4">
                {fields.map((f, index) => (
                  <div key={f.id} className="rounded-lg border p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="text-sm font-medium text-gray-700">Бараа {index + 1}</h4>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={() => removeProduct(index)}
                        className="gap-1"
                      >
                        <Trash2 className="h-3 w-3" />
                        Устгах
                      </Button>
                    </div>

                    {/* --- Бараа бүрийн форм: Image → Name → Model → Description → Price --- */}
                    <div className="space-y-4">
                      {/* Image */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Зураг</Label>
                        <ImageUpload
                          mode="single"
                          value={values.items?.[index]?.productImage || ''}
                          onChange={v =>
                            handleFieldChange(`items.${index}.productImage`, v as string)
                          }
                          onUpload={handleImageUpload}
                          maxFiles={1}
                          maxSize={5}
                          acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
                        />
                        <p className="text-[11px] text-gray-500">
                          PNG/WebP зөвлөмжтэй (ил тод фон боломжтой).
                        </p>
                      </div>

                      {/* Name (i18n) */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          Нэр ({lang.toUpperCase()})
                        </Label>
                        <Input
                          {...register(`items.${index}.name.${lang}`)}
                          onChange={e =>
                            handleFieldChange(`items.${index}.name.${lang}`, e.target.value)
                          }
                          className={cn(
                            'mt-1',
                            itemErrors[index]?.nameEn && lang === 'en' && 'border-red-500',
                            itemErrors[index]?.nameMn && lang === 'mn' && 'border-red-500'
                          )}
                          placeholder={lang === 'en' ? 'Product name (EN)' : 'Барааны нэр (MN)'}
                        />
                        {itemErrors[index]?.nameEn && lang === 'en' && (
                          <p className="text-xs text-red-500 mt-1">Англи нэр шаардлагатай</p>
                        )}
                        {itemErrors[index]?.nameMn && lang === 'mn' && (
                          <p className="text-xs text-red-500 mt-1">Монгол нэр шаардлагатай</p>
                        )}
                      </div>

                      {/* Model */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Модел</Label>
                        <Input
                          {...register(`items.${index}.model`)}
                          onChange={e => handleFieldChange(`items.${index}.model`, e.target.value)}
                          className="mt-1"
                          placeholder="Ж: S123, XR-500..."
                        />
                      </div>

                      {/* Description (i18n) */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                          Тайлбар ({lang.toUpperCase()})
                        </Label>
                        <Textarea
                          rows={4}
                          {...register(`items.${index}.description.${lang}`)}
                          onChange={e =>
                            handleFieldChange(`items.${index}.description.${lang}`, e.target.value)
                          }
                          className="mt-1"
                          placeholder={
                            lang === 'en' ? 'Short description (EN)' : 'Товч тайлбар (MN)'
                          }
                        />
                      </div>

                      {/* Price */}
                      <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">Үнэ</Label>
                        <Input
                          {...register(`items.${index}.price`)}
                          onChange={e => handleFieldChange(`items.${index}.price`, e.target.value)}
                          className="mt-1"
                          placeholder="Ж: 199,000"
                          inputMode="numeric"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </form>
      </div>

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
