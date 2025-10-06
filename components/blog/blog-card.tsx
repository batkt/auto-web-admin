import React from 'react';
import Image from 'next/image';
import { FaArrowRight } from 'react-icons/fa6';
import { Card, CardContent } from '@/components/ui/card';
import { getImageUrl, getClientImageUrl } from '@/utils';
import { Blog } from '@/lib/types/blog.types';

interface BlogCardProps {
  blog: Blog;
}

const BlogCard: React.FC<BlogCardProps> = ({ blog }) => {
  const firstTextBlock = blog?.blocks?.find(block => block.type === 'text');

  return (
    <Card className="relative group overflow-hidden transition-shadow duration-300 bg-transparent shadow-none border-0 focus-visible:ring-0">
      {/* Image */}
      <div className="w-full overflow-hidden">
        <Image
          src={getClientImageUrl(blog.thumbImage)}
          alt={blog.title}
          width={400}
          height={400}
          className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <CardContent className="px-0 pt-4">
        <h3 className="text-xl font-bold mb-3 text-white transition-colors group-hover:text-[#0888A3] cursor-pointer">
          {blog.title}
        </h3>

        <div
          className="mb-4 text-white"
          dangerouslySetInnerHTML={{
            __html: firstTextBlock?.content || '',
          }}
        />

        <div className="text-white font-semibold transition-colors flex items-center gap-2 cursor-pointer group-hover:text-red-600">
          Learn More
          <FaArrowRight className="size-3" />
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogCard;
