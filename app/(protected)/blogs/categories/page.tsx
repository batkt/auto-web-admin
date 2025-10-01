import React from 'react';
import CategoryListContent from '@/components/category/category-list-content';
import { getCategoryList } from '@/lib/services/category.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tag, Plus } from 'lucide-react';
import Link from 'next/link';
import { getCookie, USER_KEY } from '@/lib/cookie';

const CategoryListPage = async () => {
  const categoriesResponse = await getCategoryList();
  const categories = categoriesResponse.data;
  const user = await getCookie(USER_KEY);

  return (
    <div className="p-6">
      <div className="space-y-8">
        {/* Categories List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-gradient-to-br from-green-500 to-green-600 rounded-md flex items-center justify-center">
                  <Tag className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold">Категориудын жагсаалт</CardTitle>
                  <CardDescription>Блогын бүх категориудыг харах, засах</CardDescription>
                </div>
              </div>
              {['super-admin', 'admin'].includes(user?.role) && (
                <Button asChild>
                  <Link href="/blogs/categories/create">
                    <Plus className="h-4 w-4 mr-2" />
                    Шинэ категори үүсгэх
                  </Link>
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-8">
            <CategoryListContent categories={categories} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CategoryListPage;
