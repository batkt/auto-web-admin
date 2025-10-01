'use client';

import { BranchHeroData, LanguageKey } from '@/lib/types/branch.types';
import { getClientImageUrl } from '@/utils';
import React from 'react';

const BranchHeroSection = ({ lang, data }: { lang: LanguageKey; data: BranchHeroData }) => {
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
        <div className="flex flex-col sm:flex-row gap-8 justify-center">
          {data.items.map((item, index) => (
            <div className="p-4 text-center" key={`${index}-branch-stats`}>
              <div className="text-3xl font-bold">{item.stats}</div>
              <div className="text-base text-white/80">{item.name?.[lang]}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BranchHeroSection;
