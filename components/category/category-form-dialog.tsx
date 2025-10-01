'use client';

import React, { useState, useEffect } from 'react';
import { Category, CategoryData, TranslatedText } from '@/lib/types/category.types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createCategory, updateCategory } from '@/lib/actions/category';
import { toast } from 'sonner';

interface CategoryFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category?: Category | null;
  onSuccess: () => void;
}

const CategoryFormDialog: React.FC<CategoryFormDialogProps> = ({
  open,
  onOpenChange,
  category,
  onSuccess,
}) => {
  const [formData, setFormData] = useState<CategoryData>({
    name: { en: '', mn: '' },
    description: { en: '', mn: '' },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ en?: boolean; mn?: boolean }>({});

  const isEditing = !!category;

  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name || { en: '', mn: '' },
        description: category.description || { en: '', mn: '' },
      });
    } else {
      setFormData({
        name: { en: '', mn: '' },
        description: { en: '', mn: '' },
      });
    }
    setErrors({});
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { en?: boolean; mn?: boolean } = {};
    if (!formData.name.mn.trim()) newErrors.mn = true;
    if (!formData.name.en.trim()) newErrors.en = true;
    setErrors(newErrors);
    if (newErrors.en || newErrors.mn) {
      toast.error('Англи болон Монгол нэрийг заавал оруулна уу');
      return;
    }
    setIsLoading(true);
    try {
      if (isEditing && category) {
        await updateCategory(category._id, formData);
        toast.success('Категори амжилттай шинэчлэгдлээ');
      } else {
        await createCategory(formData);
        toast.success('Категори амжилттай үүслээ');
      }
      onSuccess();
    } catch (error) {
      toast.error(
        isEditing ? 'Категори шинэчлэхэд алдаа гарлаа' : 'Категори үүсгэхэд алдаа гарлаа'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof CategoryData, lang: 'en' | 'mn', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...prev[field],
        [lang]: value,
      },
    }));
    if (field === 'name') {
      setErrors(prev => ({ ...prev, [lang]: false }));
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Категори засах' : 'Шинэ категори үүсгэх'}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Категорийн нэр (Монгол)</Label>
            <Input
              value={formData.name.mn}
              onChange={e => handleInputChange('name', 'mn', e.target.value)}
              placeholder="Категорийн нэр Монгол хэлээр"
              disabled={isLoading}
              className={errors.mn ? 'border-red-500' : ''}
            />
            <Label>Категорийн нэр (Англи)</Label>
            <Input
              value={formData.name.en}
              onChange={e => handleInputChange('name', 'en', e.target.value)}
              placeholder="Category name in English"
              disabled={isLoading}
              className={errors.en ? 'border-red-500' : ''}
            />
          </div>
          <div className="space-y-2">
            <Label>Тайлбар (Монгол)</Label>
            <Textarea
              value={formData.description?.mn || ''}
              onChange={e => handleInputChange('description', 'mn', e.target.value)}
              placeholder="Тайлбар Монгол хэлээр (сонголттой)"
              rows={3}
              disabled={isLoading}
            />
            <Label>Тайлбар (Англи)</Label>
            <Textarea
              value={formData.description?.en || ''}
              onChange={e => handleInputChange('description', 'en', e.target.value)}
              placeholder="Description in English (optional)"
              rows={3}
              disabled={isLoading}
            />
          </div>
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
            >
              Цуцлах
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Хадгалж байна...' : isEditing ? 'Хадгалах' : 'Үүсгэх'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryFormDialog;
