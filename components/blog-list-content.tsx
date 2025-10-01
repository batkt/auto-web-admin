'use client';

import React, { useRef, useState } from 'react';
import { Blog } from '@/lib/types/blog.types';
import { toast } from 'sonner';
import { deleteBlog, publishBlog, unpublishBlog } from '@/lib/actions/blog';
import { Button } from './ui/button';
import Link from 'next/link';
import { Plus, Search, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import AdminBlogCard from './blog-builder/admin-blog-card';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Category } from '@/lib/types/category.types';
import { queryStringBuilder } from '@/utils';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/auth-context';

const BlogListContent = ({
  blogList,
  filters,
  categories,
}: {
  blogList: {
    data: Blog[];
    total: number;
    totalPages: number;
    currentPage: number;
  };
  filters: {
    search?: string;
    category?: string;
    page?: string;
    language?: string;
    status?: string;
  };
  categories: Category[];
}) => {
  const [searchTerm, setSearchTerm] = useState(filters?.search || '');
  const searchRef = useRef<NodeJS.Timeout>(null);
  const [category, setCategory] = useState(filters?.category || 'all');
  const [language, setLanguage] = useState(filters?.language || 'all');
  const [statusFilter, setStatusFilter] = useState(filters?.status || 'all');
  const router = useRouter();
  const { currentUser } = useAuth();

  const handleDelete = async (id: string) => {
    try {
      await deleteBlog(id);
      toast.success('Нийтлэлийг амжилттай устгалаа');
      //   loadBlogs(); // Reload the list
    } catch (error) {
      console.error('Failed to delete blog:', error);
      toast.error('Нийтлэлийг устгахад алдаа гарлаа');
    }
  };

  const handlePublish = async (id: string) => {
    try {
      await publishBlog(id);
      toast.success('Блог амжилттай нийтлэгдлээ');
      //   loadBlogs(); // Reload the list
    } catch (error) {
      console.error('Failed to publish blog:', error);
      toast.error('Блог нийтлэхэд алдаа гарлаа');
    }
  };

  const handleUnpublish = async (id: string) => {
    try {
      await unpublishBlog(id);
      toast.success('Нийтлэлийг амжилттай цуцаллаа.');
    } catch (error) {
      console.error('Failed to unpublish blog:', error);
      toast.error('Нийтлэлийг цуцлахад алдаа гарлаа');
    }
  };

  const debouncedSearch = (value: string) => {
    setSearchTerm(value);
    if (searchRef.current) {
      clearTimeout(searchRef.current);
    }
    searchRef.current = setTimeout(() => {
      const queryString = queryStringBuilder({
        search: value,
        category: category !== 'all' ? category : '',
        language: language !== 'all' ? language : '',
        status: statusFilter !== 'all' ? statusFilter : '',
        page: '1',
      });
      router.push(`/blogs/list${queryString ? `?${queryString}` : ''}`);
    }, 500);
  };

  const handleCategoryChange = (value: string) => {
    setCategory(value);
    const queryString = queryStringBuilder({
      search: searchTerm,
      category: value,
      language: language !== 'all' ? language : '',
      status: statusFilter !== 'all' ? statusFilter : '',
      page: '1',
    });
    router.push(`/blogs/list${queryString ? `?${queryString}` : ''}`);
  };

  const handleLanguageChange = (value: string) => {
    setLanguage(value);
    const queryString = queryStringBuilder({
      search: searchTerm,
      category: category !== 'all' ? category : '',
      language: value !== 'all' ? value : '',
      status: statusFilter !== 'all' ? statusFilter : '',
      page: '1',
    });
    router.push(`/blogs/list${queryString ? `?${queryString}` : ''}`);
  };

  const handleChangePage = (page: number) => {
    const queryString = queryStringBuilder({
      search: searchTerm,
      category: category !== 'all' ? category : '',
      language: language !== 'all' ? language : '',
      status: statusFilter !== 'all' ? statusFilter : '',
      page: page.toString(),
    });
    router.push(`/blogs/list${queryString ? `?${queryString}` : ''}`);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    const queryString = queryStringBuilder({
      search: searchTerm,
      category: category !== 'all' ? category : '',
      language: language !== 'all' ? language : '',
      status: value !== 'all' ? value : '',
      page: '1',
    });
    router.push(`/blogs/list${queryString ? `?${queryString}` : ''}`);
  };

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Блог хайх..."
            value={searchTerm}
            onChange={e => debouncedSearch(e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={category} onValueChange={handleCategoryChange}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Ангилалаар шүүх" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Бүгд</SelectItem>
            {categories.map(category => (
              <SelectItem key={category._id} value={category._id.toString()}>
                {category.name.mn}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={language} onValueChange={handleLanguageChange}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Хэлээр шүүх" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Бүгд</SelectItem>
            <SelectItem value="mn">Монгол</SelectItem>
            <SelectItem value="en">Англи</SelectItem>
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={handleStatusChange} defaultValue="all">
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Төлөвөөр шүүх" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Бүгд</SelectItem>
            <SelectItem value="draft">Ноорог</SelectItem>
            <SelectItem value="published">Нийтлэгдсэн</SelectItem>
            <SelectItem value="cancelled">Цуцалсан</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Blog Grid */}
      {blogList.data.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="size-10" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Блог олдсонгүй</h3>
          <p className="text-muted-foreground max-w-md mx-auto mb-6">
            Хайлт эсвэл шүүлтийг тохируулж үзнэ үү
          </p>
          {['super-admin', 'admin'].includes(currentUser?.role) && (
            <Button asChild>
              <Link href="/blogs/create">
                <Plus className="h-4 w-4 mr-2" />
                Эхний блог үүсгэх
              </Link>
            </Button>
          )}
        </div>
      ) : (
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogList.data.map(blog => (
              <AdminBlogCard
                key={blog._id}
                blog={blog}
                onDelete={handleDelete}
                onPublish={handlePublish}
                onUnpublish={handleUnpublish}
              />
            ))}
          </div>

          <div className="flex justify-end items-center gap-2 mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">
                Нийт: <b>{blogList.total}</b>
              </span>
            </div>
            <Button
              variant="outline"
              size="icon"
              disabled={blogList.currentPage <= 1}
              onClick={() => handleChangePage(blogList.currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {blogList.currentPage} / {blogList.totalPages}
              </span>
            </div>

            <Button
              variant="outline"
              size="icon"
              disabled={blogList.currentPage >= blogList.totalPages}
              onClick={() => handleChangePage(blogList.currentPage + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogListContent;
