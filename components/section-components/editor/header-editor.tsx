import { useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ImageUpload } from '@/components/ui/image-upload';
import { updateSectionData } from '@/lib/actions/section';
import { uploadFile } from '@/lib/actions/file';
import { toast } from 'sonner';
import LanguageTabs from '../language-tabs';
import { cn } from '@/lib/utils';

// Types
export type TranslatedText = { en: string; mn: string };
export interface MenuItem {
  path: string;
  name: TranslatedText;
}
export interface HeaderFormData {
  logoImage: string;
  menuList: MenuItem[];
}

interface HeaderEditorProps {
  data: HeaderFormData;
  onDataChange: (updatedData: any) => void;
  sectionId?: string;
}

const HeaderEditor = ({ data, onDataChange, sectionId }: HeaderEditorProps) => {
  const { register, handleSubmit, watch, setValue, control } = useForm<HeaderFormData>({
    defaultValues: data,
  });
  const { fields } = useFieldArray({
    control: control,
    name: 'menuList',
  });

  const [lang, setLang] = useState<'en' | 'mn'>('en');
  const [isSaving, setIsSaving] = useState(false);

  const [errors, setErrors] = useState<{
    logoImage?: boolean;
  }>({});

  const [itemErrors, setItemErrors] = useState<{
    [key: number]: {
      nameEn?: boolean;
      nameMn?: boolean;
    };
  }>({});

  const onSubmit = async (values: HeaderFormData) => {
    const newErrors: typeof errors = {};
    if (!values.logoImage) newErrors.logoImage = true;

    const newItemErrors: typeof itemErrors = {};
    values.menuList.forEach((item, idx) => {
      const err: { nameEn?: boolean; nameMn?: boolean } = {};
      if (!item.name.en?.trim()) err.nameEn = true;
      if (!item.name.mn?.trim()) err.nameMn = true;
      if (Object.keys(err).length > 0) newItemErrors[idx] = err;
    });
    setErrors(newErrors);
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
      const errorMessage = error instanceof Error ? error.message : 'Хадгалахад алдаа гарлаа';
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  // Real-time update
  const handleFieldChange = (field: any, value: any) => {
    setValue(field, value);
    const currentValues = watch();
    onDataChange(currentValues);
  };

  const handleChangeLang = (v: string) => {
    setLang(v as 'en' | 'mn');
  };

  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      const uploadedFile = await uploadFile(file);
      return uploadedFile.url;
    } catch (error) {
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
            {/* Logo Image Section */}
            <div className="space-y-4">
              <Controller
                control={control}
                name="logoImage"
                render={({ field, fieldState }) => (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium text-gray-700">
                      Зураг оруулах <span className="text-red-500">*</span>
                    </Label>

                    <ImageUpload
                      mode="single"
                      value={field.value || ''}
                      onChange={value => {
                        handleFieldChange('logoImage', value);
                      }}
                      onUpload={handleImageUpload}
                      maxSize={5}
                      acceptedTypes={['image/jpeg', 'image/png', 'image/webp']}
                      className={cn('mt-1', errors.logoImage && 'border-red-500')}
                    />
                    {fieldState.error && (
                      <p className="text-xs text-red-500 mt-1">Зураг оруулна уу</p>
                    )}
                  </div>
                )}
              />
            </div>

            <Separator />

            {/* Menu List Section */}
            <div className="space-y-4">
              <div className="space-y-3">
                {fields.map((item, idx) => (
                  <div key={idx} className="flex items-end gap-2 border p-3 rounded-lg bg-muted/30">
                    <div className="flex-1 space-y-2">
                      <Label className="text-xs">Path</Label>
                      <Input
                        value={item.path}
                        disabled
                        className="mt-1 bg-muted/50 cursor-not-allowed"
                        readOnly
                      />
                      <Label className="text-xs mt-2">
                        Name ({lang === 'en' ? 'English' : 'Монгол'})
                      </Label>
                      <Input
                        {...register(`menuList.${idx}.name.${lang}` as const)}
                        onChange={e =>
                          handleFieldChange(`menuList.${idx}.name.${lang}`, e.target.value)
                        }
                        className="mt-1"
                        placeholder={lang === 'en' ? 'Menu name (English)' : 'Цэсний нэр (Монгол)'}
                      />
                      {itemErrors[idx]?.nameEn && (
                        <p className="text-xs text-red-500 mt-1">Англи талбар заавал бөглөх</p>
                      )}
                      {itemErrors[idx]?.nameMn && (
                        <p className="text-xs text-red-500 mt-1">Монгол талбар заавал бөглөх</p>
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

export default HeaderEditor;
