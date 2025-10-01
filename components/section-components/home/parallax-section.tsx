'use client';
import { getClientImageUrl } from '@/utils';
import React from 'react';

const ParallaxSection = ({
  children,
  imageUrl,
}: {
  children: React.ReactNode;
  imageUrl: string;
}) => {
  return (
    <div
      className="relative w-full h-fit bg-fixed bg-center bg-cover flex items-center justify-center"
      style={{ backgroundImage: `url(${getClientImageUrl(imageUrl)})` }}
    >
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="relative z-[1] w-full bg-opacity-50 rounded-lg text-white text-center">
        {children}
      </div>
    </div>
  );
};

export default ParallaxSection;
