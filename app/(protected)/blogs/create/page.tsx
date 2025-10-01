import React from 'react';
import BlogBuilder from '@/components/blog-builder/builder';
import { getCategoryList } from '@/lib/services/category.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { getCookie, USER_KEY } from '@/lib/cookie';
import { redirect } from 'next/navigation';

const CreateBlog = async () => {
  const user = await getCookie(USER_KEY);

  if (!['super-admin', 'admin'].includes(user?.role)) {
    redirect('/blogs/list');
  }

  const categoriesResponse = await getCategoryList();
  const categories = categoriesResponse.data;

  return (
    <div className="p-6">
      <div className="space-y-8">
        {/* Create Blog */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-md flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold">Шинэ блог үүсгэх</CardTitle>
                  <CardDescription>Шинэ блог нийтлэл үүсгэх</CardDescription>
                </div>
              </div>
              <Button variant="outline" asChild>
                <Link href="/blogs/list">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Буцах
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-8">
            <div className="space-y-4">
              <BlogBuilder categories={categories} mode="create" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreateBlog;
