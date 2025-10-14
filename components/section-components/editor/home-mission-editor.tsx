'use client';

import { useCallback, useMemo, useState } from 'react';
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

type TranslatedText = { en: string; mn: string };

// UI-д цэгцтэй байлгахын тулд items-ийг (stat + desc) гэсэн нэгдсэн хэлбэрээр засна
type StatItemForm = {
  stat: string;
  desc: TranslatedText;
};

type HomeStatsFormData = {
  backgroundImage: string;
  stats: TranslatedText;
  title: TranslatedText;
  description: TranslatedText;
  items: StatItemForm[]; // UI-д энэ хэлбэрээр засна (submit дээр stat1/stat2/stat3 болгож хөрвүүлнэ)
};

interface HomeStatsEditorProps {
  data: any; // таны өгсөн home-stats дата
  onDataChange: (updatedData: any) => void;
  sectionId?: string;
}

const HomeMissionEditor = ({ data, onDataChange, sectionId }: HomeStatsEditorProps) => {
  // -------- Normalize incoming data -> form shape --------
  const normalizedDefault = useMemo<HomeStatsFormData>(() => {
    const rawItems = Array.isArray(data?.items) ? data.items : [];
    const toUnified = (item: any): StatItemForm => ({
      stat: item?.stat1 || item?.stat2 || item?.stat3 || '',
      desc: item?.desc ?? { en: '', mn: '' },
    });
    const items: StatItemForm[] = rawItems.length
      ? rawItems.map(toUnified)
      : [
          { stat: '', desc: { en: '', mn: '' } },
          { stat: '', desc: { en: '', mn: '' } },
          { stat: '', desc: { en: '', mn: '' } },
        ];

    return {
      backgroundImage: data?.backgroundImage ?? '',
      stats: data?.stats ?? { en: '', mn: '' },
      title: data?.title ?? { en: '', mn: '' },
      description: data?.description ?? { en: '', mn: '' },
      items,
    };
  }, [data]);

  const { register, handleSubmit, watch, setValue } = useForm<HomeStatsFormData>({
    defaultValues: normalizedDefault,
  });

  const [lang, setLang] = useState<'en' | 'mn'>('en');
  const [isSaving, setIsSaving] = useState(false);

  const [errors, setErrors] = useState<{
    statsEn?: boolean;
    statsMn?: boolean;
    titleEn?: boolean;
    titleMn?: boolean;
    descEn?: boolean;
    descMn?: boolean;
    items?: { stat?: boolean; descEn?: boolean; descMn?: boolean }[];
  }>({});

  const watchedValues = watch();

  const handleChangeLang = (v: string) => setLang(v as 'en' | 'mn');

  // Realtime change -> parent
  const handleFieldChange = useCallback(
    (field: any, value: any) => {
      setValue(field, value, { shouldDirty: true, shouldTouch: true, shouldValidate: false });
      const current = watch();
      onDataChange(current);
    },
    [onDataChange, setValue, watch]
  );

  // Image upload
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

  const onSubmit = async (values: HomeStatsFormData) => {
    // ---- Validate
    const newErrors: typeof errors = {};

    const itemErrs = values.items.map(it => {
      const ie: { stat?: boolean; descEn?: boolean; descMn?: boolean } = {};
      if (!`${it.stat ?? ''}`.trim()) ie.stat = true;
      return ie;
    });
    if (itemErrs.some(ie => ie.stat)) newErrors.items = itemErrs;

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error('Бүх талбарыг бүрэн бөглөнө үү');
      return;
    }

    // ---- Transform back to server shape (stat1/stat2/stat3)
    const payload = {
      backgroundImage: values.backgroundImage,
      stats: values.stats,
      title: values.title,
      description: values.description,
      items: values.items.map((it, idx) => {
        const key = `stat${idx + 1}` as 'stat1' | 'stat2' | 'stat3';
        return { [key]: it.stat, desc: it.desc };
      }),
    };

    if (!sectionId) {
      console.log('📝 Submitted Values:', payload);
      onDataChange(payload);
      toast.success('Формын өгөгдөл шинэчлэгдлээ (локал).');
      return;
    }

    // ---- Save
    setIsSaving(true);
    try {
      const res = await updateSectionData(sectionId, payload as any);
      if (res.code === 200) {
        toast.success('Амжилттай хадгалагдлаа');
        onDataChange(payload);
      } else {
        throw new Error(res.message || 'Хадгалахад алдаа гарлаа');
      }
    } catch (e) {
      console.error(e);
      toast.error(e instanceof Error ? e.message : 'Хадгалахад алдаа гарлаа');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 flex-shrink-0">
        <LanguageTabs lang={lang} handleChangeLang={handleChangeLang} />
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <form key={lang} onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col">
          <div className="p-6 space-y-8">
            {/* Background */}
            <div className="space-y-3">
              <Label className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Арын зураг
              </Label>
              <ImageUpload
                mode="single"
                value={watchedValues.backgroundImage || ''}
                onChange={v => handleFieldChange('backgroundImage', v)}
                onUpload={handleImageUpload}
                maxFiles={1}
                maxSize={5}
                acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
              />
            </div>

            {/* Texts */}
            <div className="grid gap-6">
              <div className="space-y-2">
                <Label htmlFor="stats" className="text-sm font-medium text-gray-700">
                  Жижиг гарчиг (stats)
                </Label>
                <Input
                  id="stats"
                  {...register(`stats.${lang}`)}
                  onChange={e => handleFieldChange(`stats.${lang}`, e.target.value)}
                  className="mt-1"
                  placeholder="e.g. Let us show you some stats"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                  Үндсэн гарчиг (title)
                </Label>
                <Input
                  id="title"
                  {...register(`title.${lang}`)}
                  onChange={e => handleFieldChange(`title.${lang}`, e.target.value)}
                  className="mt-1"
                  placeholder="e.g. Check our numbers over the past few years."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Тайлбар (description)
                </Label>
                <Textarea
                  id="description"
                  rows={3}
                  {...register(`description.${lang}`)}
                  onChange={e => handleFieldChange(`description.${lang}`, e.target.value)}
                  className="mt-1"
                  placeholder="There are many variations of passages..."
                />
              </div>
            </div>

            {/* Stats items */}
            <Separator />
            <div className="space-y-4">
              <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                Статистик мөрүүд (items)
              </h3>

              {watchedValues.items?.map((item, idx) => (
                <div key={idx} className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                  {/* Stat number */}
                  <div className="sm:col-span-1">
                    <Label className="text-sm text-gray-700">Stat #{idx + 1}</Label>
                    <Input
                      value={item.stat ?? ''}
                      onChange={e => handleFieldChange(`items.${idx}.stat`, e.target.value)}
                      className={cn('mt-1', errors.items?.[idx]?.stat ? 'border-red-500' : '')}
                      placeholder={idx === 0 ? '150' : idx === 1 ? '599' : '780'}
                    />
                    {errors.items?.[idx]?.stat && (
                      <p className="text-red-500 text-xs mt-1">Stat утга шаардлагатай</p>
                    )}
                  </div>

                  {/* Desc (lang) */}
                  <div className="sm:col-span-2">
                    <Label className="text-sm text-gray-700">
                      Тайлбар #{idx + 1} ({lang})
                    </Label>
                    <Input
                      value={item.desc?.[lang] ?? ''}
                      onChange={e => handleFieldChange(`items.${idx}.desc.${lang}`, e.target.value)}
                      className="mt-1"
                      placeholder={
                        idx === 0
                          ? 'Product Delivered'
                          : idx === 1
                          ? 'Happy Customers'
                          : 'Product Delivered'
                      }
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </form>
      </div>

      {/* Footer */}
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

export default HomeMissionEditor;
