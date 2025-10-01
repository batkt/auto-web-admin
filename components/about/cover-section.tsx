'use client';

import { getClientImageUrl } from '@/utils';
import React from 'react';

const HeroSection = ({
  data,
  lang,
  device,
}: {
  data: any;
  lang: string;
  device: 'desktop' | 'mobile';
}) => {
  return (
    <section
      style={{ backgroundImage: `url(${getClientImageUrl(data.image)})` }}
      className="relative h-[60vh] flex items-center justify-center bg-gradient-to-r from-primary to-accent bg-cover bg-center"
    >
      <div className="absolute inset-0 bg-black/40"></div>
      <div className="relative z-10 text-center text-white">
        <h1 className="text-5xl md:text-7xl font-bold mb-4">{data.title?.[lang]}</h1>
        <p className="text-xl md:text-2xl max-w-2xl mx-auto px-6">{data.description?.[lang]}</p>
      </div>
    </section>
  );
};

export default HeroSection;
