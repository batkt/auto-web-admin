import React from 'react';
import { Blog } from '@/lib/types/blog.types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Calendar, User, Globe } from 'lucide-react';
import Link from 'next/link';
import { formatDate } from '@/lib/utils';
import Image from 'next/image';
import { getImageUrl } from '@/utils';
import { useAuth } from '@/contexts/auth-context';

interface AdminBlogCardProps {
  blog: Blog;
  onDelete?: (id: string) => void;
  onPublish?: (id: string) => void;
  onUnpublish?: (id: string) => void;
}

const AdminBlogCard = ({ blog, onDelete, onPublish, onUnpublish }: AdminBlogCardProps) => {
  const { currentUser } = useAuth();

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg font-semibold">{blog.title}</CardTitle>
            <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(blog.createdAt)}</span>
              </div>
              {blog.author && (
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{blog.author.username}</span>
                </div>
              )}
              <div className="flex items-center gap-1">
                <Globe className="h-4 w-4" />
                <span className="uppercase">{blog.language}</span>
              </div>
            </div>
            {blog?.categories.length > 0 ? (
              <div className="flex items-center gap-1 mt-2">
                {blog.categories.map((category, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {category.name.mn}
                  </Badge>
                ))}
              </div>
            ) : null}
          </div>
          <Badge variant={blog.status === 'published' ? 'default' : 'secondary'}>
            {blog.status === 'published'
              ? 'Нийтлэгдсэн'
              : blog.status === 'cancelled'
              ? 'Цуцалсан'
              : 'Ноорог'}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Thumbnail */}
        {blog.thumbImage && (
          <div className="mb-4">
            <Image
              src={getImageUrl(blog.thumbImage)}
              alt={blog.title}
              width={500}
              height={500}
              className="w-full aspect-video object-cover rounded-md"
            />
          </div>
        )}

        {/* Actions */}
        {['super-admin', 'admin'].includes(currentUser?.role) && (
          <div className="flex items-center gap-2 justify-between">
            <Button size="sm" variant="outline" asChild>
              <Link href={`/blogs/${blog._id}/edit`}>
                <Edit className="h-4 w-4 mr-1" />
                Засах
              </Link>
            </Button>

            {blog.status !== 'published' && (
              <div className="flex items-center gap-2">
                {onDelete && (
                  <Button size="sm" variant="destructive" onClick={() => onDelete(blog._id)}>
                    <Trash2 className="h-4 w-4 mr-1" />
                    Устгах
                  </Button>
                )}
                {onPublish && (
                  <Button size="sm" onClick={() => onPublish(blog._id)}>
                    Нийтлэх
                  </Button>
                )}
              </div>
            )}

            {blog.status === 'published' && onUnpublish && (
              <Button size="sm" variant="secondary" onClick={() => onUnpublish(blog._id)}>
                Цуцлах
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default AdminBlogCard;
