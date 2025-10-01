'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { createCategory } from '@/lib/actions/category';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { TranslatedText } from '@/lib/types/category.types';

const CategoryCreateForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: { en: '', mn: '' },
    description: { en: '', mn: '' },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ en?: boolean; mn?: boolean }>({});
  const router = useRouter();

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
      await createCategory(formData);
      toast.success('Категори амжилттай үүслээ');
      router.push('/blogs/categories');
    } catch (error) {
      toast.error('Категори үүсгэхэд алдаа гарлаа');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: 'name' | 'description', lang: 'en' | 'mn', value: string) => {
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
    <div className="space-y-6">
      <Button variant="ghost" asChild className="mb-4">
        <Link href="/blogs/categories">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Буцах
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Категорийн мэдээлэл</CardTitle>
        </CardHeader>
        <CardContent>
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
                value={formData.description.mn}
                onChange={e => handleInputChange('description', 'mn', e.target.value)}
                placeholder="Тайлбар Монгол хэлээр (сонголттой)"
                rows={3}
                disabled={isLoading}
              />
              <Label>Тайлбар (Англи)</Label>
              <Textarea
                value={formData.description.en}
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
                onClick={() => router.push('/blogs/categories')}
                disabled={isLoading}
              >
                Цуцлах
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? 'Үүсгэж байна...' : 'Үүсгэх'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default CategoryCreateForm;
