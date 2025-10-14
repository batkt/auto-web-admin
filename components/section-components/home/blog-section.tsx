'use client';

import React from 'react';
import { motion, easeOut } from 'framer-motion';
import Image from 'next/image';
import BlogCard from '@/components/blog/blog-card';
import { Blog } from '@/lib/types/blog.types';
import { getImageUrl } from '@/utils';
import { cn } from '@/lib/utils';

const BlogSection = ({
  data,
  lang,
  blogList,
  device,
}: {
  device: 'desktop' | 'mobile';
  data: any;
  lang: string;
  blogList: Blog[];
}) => {
  const bgUrl = data?.backgroundImage ? getImageUrl(data.backgroundImage) : '';

  return (
    <section className="relative w-full overflow-hidden ">
      {bgUrl && (
        <>
          <Image
            src={bgUrl}
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover object-center pointer-events-none select-none"
          />
        </>
      )}

      <div
        className={cn(
          'w-full relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10',
          device === 'desktop'
            ? 'md:max-h-[800px] md:h-[calc(100vh-120px)]'
            : 'h-auto pt-12 sm:pt-12 pb-12'
        )}
      >
        <h2
          className={cn(
            'text-center  font-semibold text-white',
            device === 'desktop' ? 'mt-10 text-4xl lg:text-5xl' : 'text-2xl sm:text-3xl'
          )}
        >
          {data?.title?.[lang]}
        </h2>

        <h3
          className={cn(
            'mt-2 text-center font-extrabold text-[#0888A3]',
            device === 'desktop' ? 'text-4xl lg:text-5xl' : 'text-2xl sm:text-3xl'
          )}
        >
          {data?.secondaryTitle?.[lang]}
        </h3>

        <p
          className={cn(
            'mx-auto text-center text-white/90 leading-relaxed',
            device === 'desktop'
              ? 'mt-6 text-lg lg:text-xl max-w-3xl'
              : 'mt-4 text-base sm:text-lg max-w-2xl'
          )}
        >
          {data?.description?.[lang]}
        </p>

        <div
          className={cn(
            'mt-8 grid',
            device === 'desktop' ? 'grid-cols-3 gap-8 lg:gap-10' : 'grid-cols-1 gap-6'
          )}
        >
          {blogList.map(blog => (
            <div key={blog._id}>
              <BlogCard blog={blog} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
