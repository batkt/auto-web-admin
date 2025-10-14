// components/BlogCard.tsx
import React from 'react';
import Image from 'next/image';
import { FaArrowRight } from 'react-icons/fa6';
import { Card, CardContent } from '@/components/ui/card';
import { Blog } from '@/lib/types/blog.types';
import { getImageUrl } from '@/utils';
import Link from 'next/link';

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
          src={getImageUrl(blog.thumbImage)}
          alt={blog.title}
          width={400}
          height={400}
          className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <CardContent className="px-0 pt-4">
        <div className="group/card">
          <Link href={`/blog/${blog._id}`} className="group/title">
            <h3 className="text-xl font-bold mb-3 text-center md:text-left text-white transition-colors group-hover:text-[#0888A3] group-hover/card:text-[#0888A3]cursor-pointer font-title">
              {blog.title}
            </h3>
          </Link>

          <div
            className="mb-2 text-white text-center md:text-left overflow-hidden [display:-webkit-box] [-webkit-line-clamp:3] [-webkit-box-orient:vertical] font-description"
            dangerouslySetInnerHTML={{ __html: firstTextBlock?.content || '' }}
          />
          <Link href={`/blog/${blog._id}`} className="group/learn-more">
            <div className="text-white text-center md:text-left font-semibold transition-colors flex items-center justify-center md:justify-start gap-2 cursor-pointer group-hover/learn-more:text-red-600 group-hover/card:text-red-600">
              Learn More
              <FaArrowRight className="size-3" />
            </div>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default BlogCard;
