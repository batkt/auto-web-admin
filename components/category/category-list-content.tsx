'use client';

import React, { useState } from 'react';
import { Category } from '@/lib/types/category.types';
import { Button } from '@/components/ui/button';
import { Plus, Tag } from 'lucide-react';
import CategoryFormDialog from '@/components/category/category-form-dialog';
import CategoryListTable from '@/components/category/category-list-table';
import { deleteCategory } from '@/lib/actions/category';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/auth-context';

interface CategoryListContentProps {
  categories: Category[];
}

const CategoryListContent: React.FC<CategoryListContentProps> = ({ categories }) => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const router = useRouter();
  const { currentUser } = useAuth();

  const handleDelete = async (id: string) => {
    try {
      await deleteCategory(id);
      toast.success('Категори амжилттай устгагдлаа');
      router.refresh();
    } catch (error) {
      toast.error('Категори устгахад алдаа гарлаа');
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
  };

  const handleCloseDialog = () => {
    setIsCreateDialogOpen(false);
    setEditingCategory(null);
  };

  const handleSuccess = () => {
    handleCloseDialog();
    router.refresh();
  };

  return (
    <div className="space-y-4">
      {categories.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <Tag className="size-10" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Категори байхгүй байна</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Одоогоор үүсгэгдсэн категори байхгүй байна.
          </p>
          {['super-admin', 'admin'].includes(currentUser?.role) && (
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Категори үүсгэх
            </Button>
          )}
        </div>
      ) : (
        <CategoryListTable categories={categories} onEdit={handleEdit} onDelete={handleDelete} />
      )}

      <CategoryFormDialog
        open={isCreateDialogOpen || !!editingCategory}
        onOpenChange={handleCloseDialog}
        category={editingCategory}
        onSuccess={handleSuccess}
      />
    </div>
  );
};

export default CategoryListContent;
