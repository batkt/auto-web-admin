'use client';

import { useState } from 'react';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ImageUpload } from '@/components/ui/image-upload';
import { Trash2, Plus } from 'lucide-react';
import { updateSectionData } from '@/lib/actions/section';
import { uploadFile } from '@/lib/actions/file';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import LanguageTabs from '../language-tabs';

type TranslatedText = {
  en: string;
  mn: string;
};

type BankAccount = {
  bankName: string;
  accountName: string;
  iban: string;
  accountNumber: string;
  transferDescription: TranslatedText;
};

type DonatePaymentFormData = {
  title: TranslatedText;
  description: TranslatedText;
  bankAccount: {
    title: TranslatedText;
    accounts: BankAccount[];
  };
  qpay: {
    title: TranslatedText;
    description: TranslatedText;
    qrCode: string;
  };
  giveInPerson: {
    title: TranslatedText;
    description: TranslatedText;
  };
};

interface DonatePaymentEditorProps {
  data: any;
  onDataChange: (updatedData: any) => void;
  sectionId?: string;
}

const DonatePaymentEditor = ({ data, onDataChange, sectionId }: DonatePaymentEditorProps) => {
  const { register, handleSubmit, watch, setValue, control } = useForm<DonatePaymentFormData>({
    defaultValues: data,
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'bankAccount.accounts',
  });

  const [lang, setLang] = useState<'en' | 'mn'>('en');
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{
    titleEn?: boolean;
    titleMn?: boolean;
    descEn?: boolean;
    descMn?: boolean;
    bankAccount?: boolean;
    qpay?: boolean;
    qrCode?: boolean;
    giveInPerson?: boolean;
  }>({});

  // bank accounts
  const [itemErrors, setItemErrors] = useState<{
    bankName?: boolean;
    accountName?: boolean;
    iban?: boolean;
    accountNumber?: boolean;
    transferDescriptionMn?: boolean;
    transferDescriptionEn?: boolean;
  }>({});

  const onSubmit = async (values: DonatePaymentFormData) => {
    const newErrors: typeof errors = {};
    if (!values.title.en?.trim()) newErrors.titleEn = true;
    if (!values.title.mn?.trim()) newErrors.titleMn = true;
    if (!values.description.en?.trim()) newErrors.descEn = true;
    if (!values.description.mn?.trim()) newErrors.descMn = true;
    if (!values.qpay.qrCode?.trim()) newErrors.qrCode = true;
    if (fields.length === 0) newErrors.bankAccount = true;
    // Add more checks for bankAccount, qpay, giveInPerson as needed

    // Validate all bank accounts
    const newItemErrors: typeof itemErrors = {};
    (values.bankAccount.accounts || []).forEach((item, idx) => {
      const err: {
        bankName?: boolean;
        accountName?: boolean;
        iban?: boolean;
        accountNumber?: boolean;
        transferDescriptionMn?: boolean;
        transferDescriptionEn?: boolean;
      } = {};
      if (!item.bankName?.trim()) err.bankName = true;
      if (!item.accountName?.trim()) err.accountName = true;
      if (!item.iban?.trim()) err.iban = true;
      if (!item.accountNumber?.trim()) err.accountNumber = true;
      if (!item.transferDescription.en?.trim()) err.transferDescriptionEn = true;
      if (!item.transferDescription.mn?.trim()) err.transferDescriptionMn = true;
      if (Object.keys(err).length > 0) newItemErrors[idx] = err;
    });

    setItemErrors(newItemErrors);
    setErrors(newErrors);

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

  const addNewBankAccount = () => {
    append({
      bankName: '',
      accountName: '',
      iban: '',
      accountNumber: '',
      transferDescription: { en: '', mn: '' },
    });
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
                    Хэсгийн гарчиг
                  </Label>
                  <Input
                    id="title"
                    {...register(`title.${lang}`)}
                    onChange={e => handleFieldChange(`title.${lang}`, e.target.value)}
                    className={cn('mt-1', errors.titleEn || errors.titleMn ? 'border-red-500' : '')}
                    placeholder="Хэсгийн гарчиг оруулах"
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
                    Хэсгийн тайлбар
                  </Label>
                  <Textarea
                    id="description"
                    {...register(`description.${lang}`)}
                    onChange={e => handleFieldChange(`description.${lang}`, e.target.value)}
                    className={cn('mt-1', errors.descEn || errors.descMn ? 'border-red-500' : '')}
                    placeholder="Хэсгийн тайлбар оруулах"
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

            {/* Bank Account Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addNewBankAccount}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Данс нэмэх
                </Button>
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700">Гарчиг</Label>
                <Input
                  {...register(`bankAccount.title.${lang}`)}
                  onChange={e => handleFieldChange(`bankAccount.title.${lang}`, e.target.value)}
                  className={cn('mt-1', errors.bankAccount ? 'border-red-500' : '')}
                  placeholder="Гарчиг оруулах"
                />
                {errors.bankAccount && (
                  <p className="text-red-500 text-xs mt-1">Гарчиг заавал бөглөх</p>
                )}
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div key={field.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-medium text-gray-700">Данс {index + 1}</h4>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => remove(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">Банкны нэр</Label>
                      <Input
                        {...register(`bankAccount.accounts.${index}.bankName`)}
                        onChange={e =>
                          handleFieldChange(
                            `bankAccount.accounts.${index}.bankName`,
                            e.target.value
                          )
                        }
                        className={cn('mt-1', itemErrors[index]?.bankName ? 'border-red-500' : '')}
                        placeholder="Банкны нэр оруулах"
                      />
                      {itemErrors[index]?.bankName && (
                        <p className="text-red-500 text-xs mt-1">Банкны нэр заавал бөглөх</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">Дансны нэр</Label>
                      <Input
                        {...register(`bankAccount.accounts.${index}.accountName`)}
                        onChange={e =>
                          handleFieldChange(
                            `bankAccount.accounts.${index}.accountName`,
                            e.target.value
                          )
                        }
                        className={cn(
                          'mt-1',
                          itemErrors[index]?.accountName ? 'border-red-500' : ''
                        )}
                        placeholder="Дансны нэр оруулах"
                      />
                      {itemErrors[index]?.accountName && (
                        <p className="text-red-500 text-xs mt-1">Дансны нэр заавал бөглөх</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">IBAN</Label>
                      <Input
                        {...register(`bankAccount.accounts.${index}.iban`)}
                        onChange={e =>
                          handleFieldChange(`bankAccount.accounts.${index}.iban`, e.target.value)
                        }
                        className={cn('mt-1', itemErrors[index]?.iban ? 'border-red-500' : '')}
                        placeholder="IBAN оруулах"
                      />
                      {itemErrors[index]?.iban && (
                        <p className="text-red-500 text-xs mt-1">IBAN заавал бөглөх</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">Дансны дугаар</Label>
                      <Input
                        {...register(`bankAccount.accounts.${index}.accountNumber`)}
                        onChange={e =>
                          handleFieldChange(
                            `bankAccount.accounts.${index}.accountNumber`,
                            e.target.value
                          )
                        }
                        className={cn(
                          'mt-1',
                          itemErrors[index]?.accountNumber ? 'border-red-500' : ''
                        )}
                        placeholder="Дансны дугаар оруулах"
                      />
                      {itemErrors[index]?.accountNumber && (
                        <p className="text-red-500 text-xs mt-1">Дансны дугаар заавал бөглөх</p>
                      )}
                    </div>

                    <div>
                      <Label className="text-sm font-medium text-gray-700">Тайлбар</Label>
                      <Textarea
                        {...register(`bankAccount.accounts.${index}.transferDescription.${lang}`)}
                        onChange={e =>
                          handleFieldChange(
                            `bankAccount.accounts.${index}.transferDescription.${lang}`,
                            e.target.value
                          )
                        }
                        className={cn(
                          'mt-1',
                          itemErrors[index]?.transferDescriptionEn ||
                            itemErrors[index]?.transferDescriptionMn
                            ? 'border-red-500'
                            : ''
                        )}
                        placeholder="Тайлбар оруулах"
                        rows={2}
                      />
                      {itemErrors[index]?.transferDescriptionEn && (
                        <p className="text-xs text-red-500 mt-1">Англи тайлбар шаардлагатай</p>
                      )}
                      {itemErrors[index]?.transferDescriptionMn && (
                        <p className="text-xs text-red-500 mt-1">Монгол тайлбар шаардлагатай</p>
                      )}
                    </div>
                  </div>
                ))}

                {fields.length === 0 && (
                  <div
                    className={cn(
                      'text-center py-8 rounded-lg border-2 border-dashed',
                      errors.bankAccount
                        ? 'border-red-300 bg-red-50 text-red-600'
                        : 'border-gray-300 text-gray-500'
                    )}
                  >
                    <p className={cn(errors.bankAccount ? 'text-red-600' : 'text-gray-500')}>
                      Одоогоор банкны данс нэмэгдээгүй байна.
                    </p>
                    <p
                      className={cn(
                        'text-sm',
                        errors.bankAccount ? 'text-red-500' : 'text-gray-500'
                      )}
                    >
                      &quot;Данс нэмэх&quot; товчийг дарж банкны данс нэмж эхлээрэй.
                    </p>
                    {errors.bankAccount && (
                      <p className="text-red-500 text-xs mt-2">
                        Хамгийн багадаа нэг банкны данс заавал байх ёстой
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <Separator />

            {/* QR Payment Section */}
            <div className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-700">QR төлбөрийн гарчиг</Label>
                  <Input
                    {...register(`qpay.title.${lang}`)}
                    onChange={e => handleFieldChange(`qpay.title.${lang}`, e.target.value)}
                    className={cn('mt-1', errors.qpay ? 'border-red-500' : '')}
                    placeholder="QR төлбөрийн гарчиг оруулах"
                  />
                  {errors.qpay && (
                    <p className="text-red-500 text-xs mt-1">QR төлбөрийн гарчиг заавал бөглөх</p>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">QR төлбөрийн тайлбар</Label>
                  <Textarea
                    {...register(`qpay.description.${lang}`)}
                    onChange={e => handleFieldChange(`qpay.description.${lang}`, e.target.value)}
                    className={cn('mt-1', errors.qpay ? 'border-red-500' : '')}
                    placeholder="QR төлбөрийн тайлбар оруулах"
                    rows={3}
                  />
                  {errors.qpay && (
                    <p className="text-red-500 text-xs mt-1">QR төлбөрийн тайлбар заавал бөглөх</p>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">QR кодын зураг</Label>
                  <Controller
                    control={control}
                    name="qpay.qrCode"
                    render={({ field }) => (
                      <ImageUpload
                        mode="single"
                        value={field.value}
                        onChange={value => handleFieldChange('qpay.qrCode', value)}
                        onUpload={async file => {
                          try {
                            const response = await uploadFile(file);
                            return response.url;
                          } catch (error) {
                            toast.error('Зураг оруулахад алдаа гарлаа');
                            throw error;
                          }
                        }}
                        className={cn('mt-1', errors.qrCode ? 'border-red-500' : '')}
                      />
                    )}
                  />
                  {errors.qrCode && (
                    <p className="text-red-500 text-xs mt-1">QR кодын зураг заавал оруулах</p>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* In-Person Donation Section */}
            <div className="space-y-4">
              <div className="space-y-3">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Хандив гарчиг</Label>
                  <Input
                    {...register(`giveInPerson.title.${lang}`)}
                    onChange={e => handleFieldChange(`giveInPerson.title.${lang}`, e.target.value)}
                    className={cn('mt-1', errors.giveInPerson ? 'border-red-500' : '')}
                    placeholder="Хувь хүнээр хандивлах гарчиг оруулах"
                  />
                  {errors.giveInPerson && (
                    <p className="text-xs text-red-500 mt-1">Хандив гарчиг шаардлагатай</p>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-700">Хандив тайлбар</Label>
                  <Textarea
                    {...register(`giveInPerson.description.${lang}`)}
                    onChange={e =>
                      handleFieldChange(`giveInPerson.description.${lang}`, e.target.value)
                    }
                    className={cn('mt-1', errors.giveInPerson ? 'border-red-500' : '')}
                    placeholder="Хувь хүнээр хандивлах тайлбар оруулах"
                    rows={3}
                  />
                  {errors.giveInPerson && (
                    <p className="text-xs text-red-500 mt-1">Хандив тайлбар шаардлагатай</p>
                  )}
                </div>
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

export default DonatePaymentEditor;
