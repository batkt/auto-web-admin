'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChipInput } from '@/components/ui/chip-input';
import { Page } from '@/lib/types/page.types';
import { Edit } from 'lucide-react';
import { toast } from 'sonner';
import { updatePage } from '@/lib/actions/page';
import { cn } from '@/lib/utils';

type PageFormData = {
  name: {
    en: string;
    mn: string;
  };
  description: {
    en: string;
    mn: string;
  };
  keywords: string[];
};

interface PageEditDialogProps {
  page: Page;
  onPageUpdated: (updatedPage: Page) => void;
}

export function PageEditDialog({ page, onPageUpdated }: PageEditDialogProps) {
  const [open, setOpen] = useState(false);
  const [lang, setLang] = useState<'en' | 'mn'>('en');
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<{
    nameEn?: boolean;
    nameMn?: boolean;
    descEn?: boolean;
    descMn?: boolean;
    keywords?: boolean;
  }>({});

  const { register, handleSubmit, watch, setValue, reset } = useForm<PageFormData>({
    defaultValues: {
      name: page.name,
      description: page.description,
      keywords: page.keywords || [],
    },
  });

  const watchedKeywords = watch('keywords');

  // Reset form when modal opens/closes or page changes
  useEffect(() => {
    if (open) {
      reset({
        name: page.name,
        description: page.description,
        keywords: page.keywords || [],
      });
      setLang('en');
    }
  }, [open, page, reset]);

  const onSubmit = async (values: PageFormData) => {
    const newErrors: typeof errors = {};
    if (!values.name.en.trim()) newErrors.nameEn = true;
    if (!values.name.mn.trim()) newErrors.nameMn = true;
    if (!values.description.en.trim()) newErrors.descEn = true;
    if (!values.description.mn.trim()) newErrors.descMn = true;
    if (!values.keywords || values.keywords.length === 0) newErrors.keywords = true;
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      toast.error('Бүх талбарыг бүрэн бөглөнө үү');
      return;
    }
    setIsSaving(true);
    try {
      const response = await updatePage(page._id, values);

      if (response.code === 200) {
        const updatedPage = {
          ...page,
          ...values,
        };

        onPageUpdated(updatedPage);
        toast.success('Хуудасны мэдээлэл амжилттай шинэчлэгдлээ');
        setOpen(false);
      } else {
        throw new Error(response.message || 'Хадгалахад алдаа гарлаа');
      }
    } catch (error) {
      console.error('Error updating page:', error);
      const errorMessage =
        error instanceof Error ? error.message : 'Алдаа гарлаа. Дахин оролдоно уу.';
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    reset({
      name: page.name,
      description: page.description,
      keywords: page.keywords || [],
    });
    setLang('en');
    setOpen(false);
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      // Reset form when modal is closing
      reset({
        name: page.name,
        description: page.description,
        keywords: page.keywords || [],
      });
      setLang('en');
    }
    setOpen(newOpen);
  };

  const handleChangeLang = (v: string) => {
    setLang(v as 'en' | 'mn');
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <Edit className="h-4 w-4 mr-2" />
        Засах
      </Button>

      <DialogContent className="max-w-4xl p-0 max-h-[70vh] flex flex-col gap-0">
        <DialogHeader className="p-6 border-b border-gray-200">
          <DialogTitle>Хуудасны мэдээлэл засах</DialogTitle>
          <div className="space-y-4 mt-4 mb-2">
            <div className="space-y-3">
              <div>
                <Label htmlFor="slug" className="text-sm font-medium text-gray-700">
                  Түлхүүр үг
                </Label>
                <p className="mt-1">{page.slug}</p>
              </div>
            </div>
          </div>
          <Tabs value={lang} onValueChange={v => handleChangeLang(v)}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="en">English</TabsTrigger>
              <TabsTrigger value="mn">Монгол</TabsTrigger>
            </TabsList>
          </Tabs>
        </DialogHeader>
        {/* Sidebar - Editor */}
        <div className="w-full flex flex-col border-r border-gray-200 flex-1 overflow-y-auto">
          {/* Sidebar Content - Scrollable */}
          <div className="flex-1">
            <form key={lang} onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col">
              <div className="p-6 space-y-6">
                {/* Content Section */}
                <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                    Page Content
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium text-gray-700">
                        Хуудасны нэр
                      </Label>
                      <Input
                        id="name"
                        {...register(`name.${lang}`)}
                        className={cn(
                          'mt-1',
                          (lang === 'en' && errors.nameEn) || (lang === 'mn' && errors.nameMn)
                            ? 'border-red-500'
                            : ''
                        )}
                        placeholder={
                          lang === 'en'
                            ? 'Enter page name in English'
                            : 'Хуудасны нэрийг монгол хэл дээр оруулна уу'
                        }
                      />
                    </div>
                    <div>
                      <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                        Тайлбар
                      </Label>
                      <Textarea
                        id="description"
                        {...register(`description.${lang}`)}
                        className={cn(
                          'mt-1',
                          (lang === 'en' && errors.descEn) || (lang === 'mn' && errors.descMn)
                            ? 'border-red-500'
                            : ''
                        )}
                        placeholder={
                          lang === 'en'
                            ? 'Enter page description in English'
                            : 'Тайлбарыг монгол хэл дээр оруулна уу'
                        }
                        rows={4}
                      />
                    </div>
                    <div>
                      <Label htmlFor="keywords" className="text-sm font-medium text-gray-700">
                        Түлхүүр үгс
                      </Label>
                      <div
                        className={cn(
                          errors.keywords ? 'border border-red-500 rounded-md p-2' : ''
                        )}
                      >
                        <ChipInput
                          value={watchedKeywords || []}
                          onChange={keywords => setValue('keywords', keywords)}
                          placeholder={
                            lang === 'en'
                              ? 'Enter keywords (press Enter or comma to add)'
                              : 'Түлхүүр үгс оруулна уу (Enter эсвэл таслал дарж нэмнэ)'
                          }
                          className="mt-1"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Хайлтад ашиглагдах түлхүүр үгс
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
        </div>
        <DialogFooter className="p-6 border-t border-gray-200">
          <Button variant="outline" onClick={handleCancel} disabled={isSaving} className="flex-1">
            Цуцлах
          </Button>
          <Button onClick={handleSubmit(onSubmit)} disabled={isSaving} className="flex-1">
            {isSaving ? 'Хадгалж байна...' : 'Хадгалах'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
