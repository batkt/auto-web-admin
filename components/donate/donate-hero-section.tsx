'use client';

import { getClientImageUrl } from '@/utils';
import React from 'react';

const DonateHeroSection = ({ data, lang }: { data: any; lang: string }) => {
  return (
    <section
      style={{
        backgroundImage: `url(${getClientImageUrl(data.image)})`,
      }}
      className="relative z-[1] h-[60vh] bg-cover bg-center"
    >
      <div className="absolute z-[2] inset-0 bg-black/50"></div>
      <div className="relative z-[3] h-full flex items-center justify-center">
        <div className="container max-w-6xl mx-auto px-6 text-center text-white">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">{data.title[lang]}</h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
            {data.description[lang]}
          </p>
        </div>
      </div>
    </section>
  );
};

export default DonateHeroSection;
