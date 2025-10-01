'use client';

import { getClientImageUrl } from '@/utils';
import React from 'react';

const BlogHeroSection = ({ lang, data }: { lang: string; data: any }) => {
  return (
    <section
      style={{
        backgroundImage: `url(${getClientImageUrl(data.image)})`,
      }}
      className="relative h-[60vh] flex items-center justify-center bg-gradient-to-r from-primary/90 to-accent/90 bg-cover bg-center"
    >
      <div className="absolute inset-0 bg-black/50"></div>
      <div className="relative z-10 text-center text-white max-w-4xl mx-auto px-6">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">{data.title?.[lang]}</h1>
        <p className="text-lg md:text-xl lg:text-2xl mb-8 text-white/90">
          {data.description?.[lang]}
        </p>
      </div>
    </section>
  );
};

export default BlogHeroSection;
