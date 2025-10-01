import { CategoryCreateForm } from '@/components/category';
import { getCookie, USER_KEY } from '@/lib/cookie';
import { redirect } from 'next/navigation';
import React from 'react';

const CreateCategoryPage = async () => {
  const user = await getCookie(USER_KEY);

  if (!['super-admin', 'admin'].includes(user?.role)) {
    redirect('/blogs/categories');
  }

  return (
    <div className="p-6">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold">Шинэ категори үүсгэх</h1>
          <p className="text-muted-foreground">Блогын шинэ категори үүсгэх</p>
        </div>
        <CategoryCreateForm />
      </div>
    </div>
  );
};

export default CreateCategoryPage;
