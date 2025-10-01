import React from 'react';
import BlogBuilder from '@/components/blog-builder/builder';
import { getCategoryList } from '@/lib/services/category.service';
import { getBlogById } from '@/lib/services/blog.service';
import { notFound } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface EditBlogPageProps {
  params: Promise<{
    id: string;
  }>;
}

const EditBlogPage = async ({ params }: EditBlogPageProps) => {
  const { id } = await params;

  try {
    const [categoriesResponse, blogResponse] = await Promise.all([
      getCategoryList(),
      getBlogById(id),
    ]);

    const categories = categoriesResponse.data;
    const blog = blogResponse.data;

    return (
      <div className="p-6">
        <div className="space-y-8">
          {/* Edit Blog */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-md flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-semibold">Блог засах</CardTitle>
                    <CardDescription>Блогын мэдээллийг засах, шинэчлэх</CardDescription>
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
                <BlogBuilder categories={categories} blog={blog} mode="edit" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
};

export default EditBlogPage;
