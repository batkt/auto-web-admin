import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { updateSectionData } from '@/lib/actions/section';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import LanguageTabs from '../language-tabs';

export type TranslatedText = { en: string; mn: string };
export interface SocialMediaItem {
  name: string;
  url: string;
}
export interface FooterFormData {
  description: TranslatedText;
  socialMedia: SocialMediaItem[];
}

interface FooterEditorProps {
  data: FooterFormData;
  onDataChange: (updatedData: any) => void;
  sectionId?: string;
}

const FooterEditor = ({ data, onDataChange, sectionId }: FooterEditorProps) => {
  const { register, handleSubmit, setValue, watch } = useForm<FooterFormData>({
    defaultValues: data,
  });
  const watchedValues = watch();
  const [lang, setLang] = useState<'en' | 'mn'>('en');
  const [isSaving, setIsSaving] = useState(false);

  const onSubmit = async (values: FooterFormData) => {
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
            {/* Description Section */}
            <div className="space-y-4">
              <div className="space-y-3">
                <Label className="text-sm font-medium text-gray-700">
                  Description ({lang === 'en' ? 'English' : 'Монгол'})
                </Label>
                <Textarea
                  {...register(`description.${lang}` as const)}
                  onChange={e => handleFieldChange(`description.${lang}`, e.target.value)}
                  className="mt-1"
                  placeholder={
                    lang === 'en' ? 'Footer description (English)' : 'Хөл тайлбар (Монгол)'
                  }
                  rows={3}
                />
              </div>
            </div>

            <Separator />

            {/* Social Media Section */}
            <div className="space-y-4">
              <div className="space-y-3">
                {watchedValues.socialMedia?.map((item, idx) => (
                  <div key={idx} className="flex items-end gap-2 border p-3 rounded-lg bg-muted/30">
                    <div className="flex-1 space-y-2">
                      <Label className="text-xs">Name</Label>
                      <Input
                        value={item.name}
                        disabled
                        className="mt-1 bg-muted/50 cursor-not-allowed"
                        readOnly
                      />
                      <Label className="text-xs mt-2">URL</Label>
                      <Input
                        {...register(`socialMedia.${idx}.url` as const)}
                        onChange={e => handleFieldChange(`socialMedia.${idx}.url`, e.target.value)}
                        className="mt-1"
                        placeholder="https://..."
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

export default FooterEditor;
