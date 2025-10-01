'use client';

import React from 'react';
import { Category } from '@/lib/types/category.types';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { dateFormatter } from '@/utils';
import { useAuth } from '@/contexts/auth-context';
import { cn } from '@/lib/utils';

interface CategoryListTableProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (id: string) => void;
}

const CategoryListTable: React.FC<CategoryListTableProps> = ({ categories, onEdit, onDelete }) => {
  const { currentUser } = useAuth();

  const isAdmin = ['super-admin', 'admin'].includes(currentUser?.role);
  return (
    <div className="mt-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="font-semibold">Категорийн нэр</TableHead>
            <TableHead className="font-semibold">Тайлбар</TableHead>
            <TableHead className={cn('font-semibold', isAdmin ? 'text-left' : 'text-right')}>
              Үүсгэсэн огноо
            </TableHead>
            {isAdmin && <TableHead className="font-semibold text-right">Үйлдэл</TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map(category => (
            <TableRow key={category._id} className="hover:bg-muted/50">
              <TableCell className="font-medium">
                <div>
                  <p>{category.name?.mn}</p>
                  <p className="text-muted-foreground">{category.name?.en}</p>
                </div>
              </TableCell>
              <TableCell>
                {!category?.description ? (
                  <span className="text-muted-foreground">Тайлбар байхгүй</span>
                ) : (
                  <div>
                    <p>{category.description?.mn}</p>
                    <p className="text-muted-foreground">{category.description?.en}</p>
                  </div>
                )}
              </TableCell>
              <TableCell className={cn(isAdmin ? 'text-left' : 'text-right')}>
                {dateFormatter(category.createdAt)}
              </TableCell>
              {isAdmin && (
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" onClick={() => onEdit(category)}>
                      <Edit className="h-4 w-4 mr-1" />
                      Засах
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDelete(category._id)}
                      className="text-destructive hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CategoryListTable;
