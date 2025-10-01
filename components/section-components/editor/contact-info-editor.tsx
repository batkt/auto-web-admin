import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { Trash2, Plus } from 'lucide-react';
import { updateSectionData } from '@/lib/actions/section';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import LanguageTabs from '../language-tabs';

export type TranslatedText = { en: string; mn: string };
export interface ServiceItem {
  name: TranslatedText;
  description: TranslatedText;
}
export interface ContactInfoData {
  title: TranslatedText;
  description: TranslatedText;
  address: TranslatedText;
  phone: string;
  email: string;
  services: {
    name: TranslatedText;
    data: ServiceItem[];
  };
}

interface ContactInfoEditorProps {
  data: ContactInfoData;
  onDataChange: (updatedData: any) => void;
  sectionId?: string;
}

const ContactInfoEditor = ({ data, onDataChange, sectionId }: ContactInfoEditorProps) => {
  const { register, handleSubmit, watch, setValue, control } = useForm<ContactInfoData>({
    defaultValues: data,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'services.data',
  });

  const [lang, setLang] = useState<'en' | 'mn'>('en');
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{
    titleEn?: boolean;
    titleMn?: boolean;
    descriptionEn?: boolean;
    descriptionMn?: boolean;
    addressEn?: boolean;
    addressMn?: boolean;
    phone?: boolean;
    email?: boolean;
    titleServiceEn?: boolean;
    titleServiceMn?: boolean;
  }>({});
  const [itemErrors, setItemErrors] = useState<{
    [key: number]: {
      titleEn?: boolean;
      titleMn?: boolean;
      descriptionEn?: boolean;
      descriptionMn?: boolean;
      icon?: boolean;
    };
  }>({});

  const onSubmit = async (values: ContactInfoData) => {
    // Validate main fields
    const newErrors: typeof errors = {};
    if (!values.title.en?.trim()) newErrors.titleEn = true;
    if (!values.title.mn?.trim()) newErrors.titleMn = true;
    if (!values.description.en?.trim()) newErrors.descriptionEn = true;
    if (!values.description.mn?.trim()) newErrors.descriptionMn = true;
    if (!values.address.en?.trim()) newErrors.addressEn = true;
    if (!values.address.mn?.trim()) newErrors.addressMn = true;
    if (!values.phone?.trim()) newErrors.phone = true;
    if (!values.email?.trim()) newErrors.email = true;
    if (!values.services.name.en?.trim()) newErrors.titleServiceEn = true;
    if (!values.services.name.mn?.trim()) newErrors.titleServiceMn = true;
    setErrors(newErrors);

    // Validate all contact items
    const newItemErrors: typeof itemErrors = {};
    (values.services.data || []).forEach((item, idx) => {
      const err: {
        titleEn?: boolean;
        titleMn?: boolean;
        descriptionEn?: boolean;
        descriptionMn?: boolean;
        icon?: boolean;
      } = {};
      if (!item.name.en?.trim()) err.titleEn = true;
      if (!item.name.mn?.trim()) err.titleMn = true;
      if (!item.description.en?.trim()) err.descriptionEn = true;
      if (!item.description.mn?.trim()) err.descriptionMn = true;
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

  const handleAddService = () => {
    append({ name: { en: '', mn: '' }, description: { en: '', mn: '' } });
    setTimeout(() => onDataChange(watch()), 0);
  };

  const handleRemoveService = (idx: number) => {
    remove(idx);
    setTimeout(() => onDataChange(watch()), 0);
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
                    <p className="text-xs text-red-500 mt-1">Англи гарчиг шаардлагатай</p>
                  )}
                  {errors.titleMn && (
                    <p className="text-xs text-red-500 mt-1">Монгол гарчиг шаардлагатай</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                    Тайлбар
                  </Label>
                  <Textarea
                    id="description"
                    {...register(`description.${lang}`)}
                    onChange={e => handleFieldChange(`description.${lang}`, e.target.value)}
                    className={cn(
                      'mt-1',
                      errors.descriptionEn || errors.descriptionMn ? 'border-red-500' : ''
                    )}
                    placeholder="Тайлбар оруулах"
                    rows={3}
                  />
                  {errors.descriptionEn && (
                    <p className="text-xs text-red-500 mt-1">Англи тайлбар шаардлагатай</p>
                  )}
                  {errors.descriptionMn && (
                    <p className="text-xs text-red-500 mt-1">Монгол тайлбар шаардлагатай</p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Хаяг
              </Label>
              <Input
                {...register(`address.${lang}` as const)}
                onChange={e => handleFieldChange(`address.${lang}`, e.target.value)}
                className={cn('mt-1', errors.addressEn || errors.addressMn ? 'border-red-500' : '')}
                placeholder={lang === 'en' ? 'Address' : 'Хаяг'}
              />
              {errors.addressEn && (
                <p className="text-xs text-red-500 mt-1">Англи хаяг шаардлагатай</p>
              )}
              {errors.addressMn && (
                <p className="text-xs text-red-500 mt-1">Монгол хаяг шаардлагатай</p>
              )}
            </div>

            <div>
              <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
                Утасны дугаар
              </Label>
              <Input
                {...register('phone')}
                onChange={e => handleFieldChange('phone', e.target.value)}
                className={cn('mt-1', errors.phone ? 'border-red-500' : '')}
                placeholder="XXXXXXXX"
              />
              {errors.phone && (
                <p className="text-xs text-red-500 mt-1">Утасны дугаар шаардлагатай</p>
              )}
            </div>
            <div>
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                И-мэйл хаяг
              </Label>
              <Input
                {...register('email')}
                onChange={e => handleFieldChange('email', e.target.value)}
                className={cn('mt-1', errors.email ? 'border-red-500' : '')}
                placeholder="test@example.com"
              />
              {errors.email && (
                <p className="text-xs text-red-500 mt-1">И-мэйл хаяг шаардлагатай</p>
              )}
            </div>

            <Separator />

            {/* Contact Items Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                  Үйлчилгээ
                </h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAddService}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Нэмэх
                </Button>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Нэр</Label>
                <Input
                  {...register(`services.name.${lang}` as const)}
                  onChange={e => handleFieldChange(`services.name.${lang}`, e.target.value)}
                  className={cn(
                    'mt-1',
                    errors.titleServiceEn || errors.titleServiceMn ? 'border-red-500' : ''
                  )}
                  placeholder={lang === 'en' ? 'Service' : 'Үйлчилгээ'}
                />
                {errors.titleServiceEn && (
                  <p className="text-xs text-red-500 mt-1">Англи нэр шаардлагатай</p>
                )}
                {errors.titleServiceMn && (
                  <p className="text-xs text-red-500 mt-1">Монгол нэр шаардлагатай</p>
                )}
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-700">Үйлчилгээ {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveService(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">Гарчиг</Label>
                      <Input
                        {...register(`services.data.${index}.name.${lang}`)}
                        onChange={e =>
                          handleFieldChange(`services.data.${index}.name.${lang}`, e.target.value)
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
                        <p className="text-xs text-red-500 mt-1">Монгол гарчиг шаардлагатай</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">Тайлбар</Label>
                      <Textarea
                        {...register(`services.data.${index}.description.${lang}`)}
                        onChange={e =>
                          handleFieldChange(
                            `services.data.${index}.description.${lang}`,
                            e.target.value
                          )
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
                        <p className="text-xs text-red-500 mt-1">Англи тайлбар шаардлагатай</p>
                      )}
                      {itemErrors[index]?.descriptionMn && (
                        <p className="text-xs text-red-500 mt-1">Монгол тайлбар шаардлагатай</p>
                      )}
                    </div>
                  </div>
                ))}

                {fields.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>Одоогоор холбоо барих жагсаалт нэмэгдээгүй байна.</p>
                    <p className="text-sm">
                      &quot;Нэмэх&quot; товчийг дарж холбоо барих жагсаалт нэмж эхлээрэй.
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

export default ContactInfoEditor;
