'use client';

import React from 'react';
import { motion, easeOut } from 'framer-motion';
import BlogCard from '@/components/blog/blog-card';
import { Blog } from '@/lib/types/blog.types';

const BlogSection = ({ data, lang, blogList }: { data: any; lang: string; blogList: Blog[] }) => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: easeOut,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: easeOut,
      },
    },
  };

  return (
    <motion.div
      className="w-full py-20 bg-muted"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={containerVariants}
    >
      <div className="container px-6 max-w-6xl mx-auto space-y-6">
        <motion.h2 className="text-3xl sm:text-4xl text-center font-medium" variants={itemVariants}>
          {data.title?.[lang]}
        </motion.h2>
        <motion.p
          className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
          variants={itemVariants}
        >
          {data.description?.[lang]}
        </motion.p>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-10"
          variants={containerVariants}
        >
          {blogList.map(blog => {
            return (
              <motion.div
                key={blog._id}
                variants={cardVariants}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.3, ease: 'easeOut' },
                }}
              >
                <BlogCard blog={blog} />
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BlogSection;
