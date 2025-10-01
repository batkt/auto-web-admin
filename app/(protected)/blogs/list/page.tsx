import React from 'react';
import BlogListContent from '@/components/blog-list-content';
import { getBlogList } from '@/lib/services/blog.service';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Plus, FileText } from 'lucide-react';
import { getCategoryList } from '@/lib/services/category.service';
import { getCookie, USER_KEY } from '@/lib/cookie';

const BlogListPage = async (props: {
  searchParams: Promise<{
    status: string;
    category: string;
    language: string;
    page: string;
    search: string;
  }>;
}) => {
  const { status, search, category, language, page } = await props.searchParams;

  let filters = {};

  if (search) {
    filters = {
      ...filters,
      search: search,
    };
  }
  if (status) {
    filters = {
      ...filters,
      status: status,
    };
  }
  if (category) {
    filters = {
      ...filters,
      category: category,
    };
  }
  if (language) {
    filters = {
      ...filters,
      language: language,
    };
  }
  if (page) {
    filters = {
      ...filters,
      page: parseInt(page),
    };
  }

  const categoriesResponse = await getCategoryList();
  const categories = categoriesResponse.data;

  const listResponse = await getBlogList({
    ...filters,
    limit: 9,
  });

  const list = listResponse.data;

  const user = await getCookie(USER_KEY);

  return (
    <div className="p-6">
      <div className="space-y-8">
        {/* Blogs List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-md flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl font-semibold">Блогын жагсаалт</CardTitle>
                  <CardDescription>Блогын бүх нийтлэлүүдийг харах, засах</CardDescription>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" asChild>
                  <Link href="/blogs/categories">Категориуд</Link>
                </Button>
                {['super-admin', 'admin'].includes(user?.role) && (
                  <Button asChild>
                    <Link href="/blogs/create">
                      <Plus className="h-4 w-4 mr-2" />
                      Шинэ блог үүсгэх
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-8">
            <BlogListContent blogList={list} filters={filters} categories={categories} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default BlogListPage;
