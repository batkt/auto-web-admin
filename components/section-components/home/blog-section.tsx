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
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.2, delayChildren: 0.1 } },
  };

  const item = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: easeOut } },
  };

  const card = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: easeOut } },
  };

  const bgUrl = data?.backgroundImage ? getImageUrl(data.backgroundImage) : '';

  return (
    <motion.section
      className="relative w-full overflow-hidden bg-[#111]"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      {bgUrl && (
        <>
          <Image
            src={bgUrl}
            alt=""
            fill
            sizes="100vw"
            priority
            className="object-cover object-center pointer-events-none select-none opacity-90"
          />
          <div className="absolute inset-0 bg-black/40" />
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
        <motion.h2
          className={cn(
            'text-center  font-semibold text-white',
            device === 'desktop' ? 'mt-10 text-4xl lg:text-5xl' : 'text-2xl sm:text-3xl'
          )}
          variants={item}
        >
          {data?.title?.[lang]}
        </motion.h2>

        <motion.h3
          className={cn(
            'mt-2 text-center font-extrabold text-[#0888A3]',
            device === 'desktop' ? 'text-4xl lg:text-5xl' : 'text-2xl sm:text-3xl'
          )}
          variants={item}
        >
          {data?.secondaryTitle?.[lang]}
        </motion.h3>

        <motion.p
          className={cn(
            'mx-auto text-center text-white/90 leading-relaxed',
            device === 'desktop'
              ? 'mt-6 text-lg lg:text-xl max-w-3xl'
              : 'mt-4 text-base sm:text-lg max-w-2xl'
          )}
          variants={item}
        >
          {data?.description?.[lang]}
        </motion.p>

        <motion.div
          className={cn(
            'mt-8 grid',
            device === 'desktop' ? 'grid-cols-3 gap-8 lg:gap-10' : 'grid-cols-1 gap-6'
          )}
          variants={containerVariants}
        >
          {blogList.map(blog => (
            <motion.div
              key={blog._id}
              variants={card}
              whileHover={{
                y: -8,
                transition: { duration: 0.28, ease: 'easeOut' },
              }}
            >
              <BlogCard blog={blog} />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </motion.section>
  );
};

export default BlogSection;
