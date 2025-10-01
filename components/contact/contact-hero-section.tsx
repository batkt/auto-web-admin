'use client';

import React from 'react';
import BlurText from '../ui/blur-text';
import { getClientImageUrl } from '@/utils';

type ContactHeroData = {
  title: { en: string; mn: string };
  description: { en: string; mn: string };
  image: string;
};

const ContactHeroSection = ({ lang, data }: { lang: string; data: ContactHeroData }) => {
  const langkey = lang as 'en' | 'mn';
  return (
    <div className="w-full relative max-h-[600px] h-[60vh] min-h-[400px]">
      {/* Background Image */}
      {data.image && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${getClientImageUrl(data.image)})` }}
        />
      )}

      {/* Parallax overlay with gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70"></div>

      {/* Main content */}
      <div className="absolute z-[1] inset-0 flex flex-col items-center justify-center gap-y-6 px-6 text-center">
        <BlurText
          text={data.title?.[langkey]}
          delay={150}
          animateBy="words"
          direction="top"
          className="max-w-2xl font-bold text-white text-4xl sm:text-5xl lg:text-6xl leading-tight drop-shadow-2xl"
        />

        <BlurText
          text={data.description?.[langkey]}
          delay={300}
          animateBy="words"
          direction="bottom"
          className="max-w-3xl text-white/90 text-lg sm:text-xl leading-relaxed drop-shadow-lg"
        />
      </div>
    </div>
  );
};

export default ContactHeroSection;
