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
import LanguageTabs from '../language-tabs';

type TranslatedText = {
  en: string;
  mn: string;
};

export type HomeVideoFormData = {
  title: TranslatedText;
  description: TranslatedText;
  videoUrl: string;
};

interface HomeVideoEditorProps {
  data: HomeVideoFormData;
  onDataChange: (data: HomeVideoFormData) => void;
  sectionId?: string;
}

const HomeVideoEditor = ({ data, onDataChange, sectionId }: HomeVideoEditorProps) => {
  const { register, handleSubmit, watch, setValue } = useForm<HomeVideoFormData>({
    defaultValues: {
      ...data,
      videoUrl: data.videoUrl ?? '',
    },
    mode: 'onChange',
  });

  const [lang, setLang] = useState<'en' | 'mn'>('en');
  const [isSaving, setIsSaving] = useState(false);

  const handleFieldChange = (field: string, value: string) => {
    setValue(field as keyof HomeVideoFormData, value as never, {
      shouldDirty: true,
      shouldTouch: true,
      shouldValidate: false,
    });
    onDataChange(watch());
  };

  const onSubmit = async (values: HomeVideoFormData) => {
    if (!sectionId) {
      onDataChange(values);
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        ...values,
        videoUrl: (values.videoUrl ?? '').trim(),
      };
      const response = await updateSectionData(sectionId, payload);
      if (response.code === 200) {
        toast.success('Амжилттай хадгалагдлаа');
        onDataChange(payload);
      } else {
        throw new Error(response.message || 'Хадгалахад алдаа гарлаа');
      }
    } catch (error) {
      console.error(error);
      const msg = error instanceof Error ? error.message : 'Хадгалахад алдаа гарлаа';
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-6 border-b border-gray-200 flex-shrink-0">
        <LanguageTabs lang={lang} handleChangeLang={v => setLang(v as 'en' | 'mn')} />
      </div>

      <div className="flex-1 overflow-y-auto">
        <form key={lang} onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col">
          <div className="p-6 space-y-6">
            <div>
              <Label htmlFor="title" className="text-sm font-medium text-gray-700">
                Гарчиг
              </Label>
              <Input
                id="title"
                {...register(`title.${lang}`)}
                onChange={e => handleFieldChange(`title.${lang}`, e.target.value)}
                className="mt-1"
                placeholder="Гарчиг"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Тайлбар
              </Label>
              <Textarea
                id="description"
                rows={4}
                {...register(`description.${lang}`)}
                onChange={e => handleFieldChange(`description.${lang}`, e.target.value)}
                className="mt-1"
                placeholder="Тайлбар"
              />
            </div>

            <Separator />

            <div>
              <Label htmlFor="videoUrl" className="text-sm font-medium text-gray-700">
                Видео холбоос (YouTube)
              </Label>
              <Input
                id="videoUrl"
                type="url"
                placeholder="https://www.youtube.com/watch?v=... эсвэл https://youtu.be/..."
                {...register('videoUrl')}
                onChange={e => handleFieldChange('videoUrl', e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground mt-1">
                YouTube watch, youtu.be, shorts, embed холбоосыг дэмжинэ.
              </p>
            </div>
          </div>
        </form>
      </div>

      <div className="p-6 border-t border-gray-200 bg-gray-50 flex-shrink-0">
        <Button
          type="button"
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

export default HomeVideoEditor;
