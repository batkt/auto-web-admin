'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { getEmbedUrl } from '@/utils';

const HomeVideoSection = ({
  device,
  data,
  lang,
}: {
  device: 'desktop' | 'mobile';
  data: {
    title?: { en?: string; mn?: string };
    description?: { en?: string; mn?: string };
    videoUrl?: string;
  };
  lang: string;
}) => {
  const embed = data?.videoUrl ? getEmbedUrl(String(data.videoUrl)) : null;

  return (
    <section
      id="video"
      className="relative w-full overflow-hidden bg-[#111] py-16 md:py-24"
    >
      <div
        className={cn(
          'relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-10',
          device === 'mobile' && 'text-center'
        )}
      >
        {data?.title?.[lang] ? (
          <h2
            className={cn(
              'font-extrabold text-white font-title',
              device === 'desktop' ? 'text-4xl md:text-5xl text-left' : 'text-3xl'
            )}
          >
            {data.title[lang]}
          </h2>
        ) : null}

        {data?.description?.[lang] ? (
          <p
            className={cn(
              'mt-4 text-white/85 font-description max-w-3xl',
              device === 'desktop' ? 'text-lg text-left' : 'text-base mx-auto'
            )}
          >
            {data.description[lang]}
          </p>
        ) : null}

        {embed ? (
          <div
            className={cn(
              'mt-10 w-full max-w-4xl',
              device === 'mobile' && 'mx-auto'
            )}
          >
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black/40 ring-1 ring-white/10">
              <iframe
                src={embed}
                title="Video"
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
          </div>
        ) : (
          <p className="mt-8 text-sm text-white/50">Видео холбоос оруулна уу</p>
        )}
      </div>
    </section>
  );
};

export default HomeVideoSection;
