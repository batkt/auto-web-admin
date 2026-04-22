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

type HelpFormData = {
  title: TranslatedText;
  secondaryTitle: TranslatedText;
  location: TranslatedText;
  description: TranslatedText;
  address: TranslatedText;
  phone: string;
  email: string;
  backgroundImage: string;
  youtubeUrl?: string;
};

interface HomeHelpEditorProps {
  data: HelpFormData;
  onDataChange: (data: HelpFormData) => void;
  sectionId?: string;
}

const HomeHelpEditor = ({ data, onDataChange, sectionId }: HomeHelpEditorProps) => {
  const { register, handleSubmit, watch, setValue } = useForm<HelpFormData>({
    defaultValues: {
      ...data,
      youtubeUrl: data.youtubeUrl ?? '',
    },
    mode: 'onChange',
  });

  const [lang, setLang] = useState<'en' | 'mn'>('en');
  const [isSaving, setIsSaving] = useState(false);
  const watchedValues = watch();

  // UI error flags (simple)
  const [errors, setErrors] = useState<{
    titleEn?: boolean;
    titleMn?: boolean;
    secondaryTitleEn?: boolean;
    secondaryTitleMn?: boolean;
    backgroundImage?: boolean;
    email?: boolean;
    phone?: boolean;
  }>({});

  const onSubmit = async (values: HelpFormData) => {
    // ---- Client-side validations (simple) ----
    const nextErrors: typeof errors = {};

    // very light checks
    if (!values.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email))
      nextErrors.email = true;
    if (!values.phone?.trim() || !/^\+?[0-9\-()\s]{7,20}$/.test(values.phone))
      nextErrors.phone = true;

    if (!values.backgroundImage?.trim()) nextErrors.backgroundImage = true;
    setErrors(nextErrors);

    const hasErr = Object.values(nextErrors).some(Boolean);
    if (hasErr && !sectionId) {
      // local only mode — зүгээр log хийгээд гарна
      console.log('📝 Submitted Values (with validation errs):', values);
      onDataChange(values);
      return;
    } else if (hasErr) {
      toast.error('Талбаруудыг шалгана уу.');
      return;
    }

    // ---- If no sectionId, just bubble up to parent (preview/save outside) ----
    if (!sectionId) {
      console.log('📝 Submitted Values:', values);
      onDataChange(values);
      return;
    }

    // ---- Persist to server ----
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
      const msg = error instanceof Error ? error.message : 'Хадгалахад алдаа гарлаа';
      toast.error(msg);
    } finally {
      setIsSaving(false);
    }
  };

  // Local change helper → form state + parent sync
  const handleFieldChange = <K extends keyof HelpFormData>(
    field: K | `${keyof HelpFormData}.${'en' | 'mn'}`,
    value: any
  ) => {
    setValue(field as any, value, { shouldDirty: true, shouldTouch: true, shouldValidate: false });
    const current = watch();
    onDataChange(current);
  };

  const handleChangeLang = (v: string) => setLang(v as 'en' | 'mn');

  // Upload function using real API
  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      const uploaded = await uploadFile(file);
      return uploaded.url; // must return a url string
    } catch (err) {
      console.error('Error uploading file:', err);
      toast.error('Зураг оруулахад алдаа гарлаа');
      throw err;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 flex-shrink-0">
        <LanguageTabs lang={lang} handleChangeLang={handleChangeLang} />
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <form key={lang} onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col">
          <div className="p-6 space-y-6">
            {/* Main fields */}
            <div className="space-y-4">
              <div className="space-y-3">
                {/* Title */}
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

                {/* Secondary Title */}
                <div>
                  <Label htmlFor="secondaryTitle" className="text-sm font-medium text-gray-700">
                    Дэд гарчиг
                  </Label>
                  <Input
                    id="secondaryTitle"
                    {...register(`secondaryTitle.${lang}`)}
                    onChange={e => handleFieldChange(`secondaryTitle.${lang}`, e.target.value)}
                    className="mt-1"
                    placeholder="Дэд гарчиг оруулах"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Location / Description / Address */}
            <div className="space-y-4">
              {/* Location */}
              <div>
                <Label htmlFor="location" className="text-sm font-medium text-gray-700">
                  Байршлын гарчиг
                </Label>
                <Input
                  id="location"
                  {...register(`location.${lang}`)}
                  onChange={e => handleFieldChange(`location.${lang}`, e.target.value)}
                  className="mt-1"
                  placeholder="Ж: Our Location / Манай байршил"
                />
              </div>

              {/* Description */}
              <div>
                <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                  Тайлбар
                </Label>
                <Textarea
                  id="description"
                  rows={3}
                  {...register(`description.${lang}`)}
                  onChange={e => handleFieldChange(`description.${lang}`, e.target.value)}
                  className="mt-1"
                  placeholder="Тайлбар оруулах"
                />
              </div>

              {/* Address */}
              <div>
                <Label htmlFor="address" className="text-sm font-medium text-gray-700">
                  Хаяг
                </Label>
                <Input
                  id="address"
                  {...register(`address.${lang}`)}
                  onChange={e => handleFieldChange(`address.${lang}`, e.target.value)}
                  className="mt-1"
                  placeholder="Хаяг оруулах"
                />
              </div>

              {/* Phone / Email */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                    Утас
                  </Label>
                  <Input
                    id="phone"
                    {...register('phone')}
                    onChange={e => handleFieldChange('phone', e.target.value)}
                    className={cn('mt-1', errors.phone ? 'border-red-500' : '')}
                    placeholder="+976 88XX XXXX"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-xs mt-1">Зөв утасны дугаар оруулна уу</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                    Имэйл
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    {...register('email')}
                    onChange={e => handleFieldChange('email', e.target.value)}
                    className={cn('mt-1', errors.email ? 'border-red-500' : '')}
                    placeholder="example@domain.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-xs mt-1">Зөв имэйл оруулна уу</p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* YouTube */}
            <div className="space-y-3">
              <Label htmlFor="youtubeUrl" className="text-sm font-medium text-gray-700">
                YouTube видео холбоос
              </Label>
              <Input
                id="youtubeUrl"
                type="url"
                placeholder="https://www.youtube.com/watch?v=... эсвэл https://youtu.be/..."
                {...register('youtubeUrl')}
                onChange={e => handleFieldChange('youtubeUrl', e.target.value)}
                className="mt-1"
              />
              <p className="text-xs text-muted-foreground">
                Зөвхөн YouTube (watch, youtu.be, shorts, embed). Хоосон бол видео харуулахгүй.
              </p>
            </div>

            <Separator />

            {/* Background Image */}
            <div className="space-y-4">
              <Label className="text-sm font-medium text-gray-700">Background зураг</Label>
              <ImageUpload
                mode="single"
                value={watchedValues.backgroundImage}
                onChange={val => handleFieldChange('backgroundImage', val)}
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

export default HomeHelpEditor;
