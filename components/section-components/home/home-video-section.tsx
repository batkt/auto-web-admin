'use client';

import React from 'react';
import { getEmbedUrl } from '@/utils';

const HomeVideoSection = ({
  device: _device,
  data,
  lang,
}: {
  device: 'desktop' | 'mobile';
  data: {
    title?: { en?: string; mn?: string };
    description?: { en?: string; mn?: string };
    videoUrl?: string;
    youtubeUrl?: string;
  };
  lang: string;
}) => {
  const raw =
    (data?.videoUrl && String(data.videoUrl)) ||
    (data?.youtubeUrl && String(data.youtubeUrl)) ||
    '';
  const embed = raw ? getEmbedUrl(raw) : null;

  return (
    <section
      id="video"
      className="relative w-full min-w-0 self-stretch overflow-hidden bg-[#111] py-16 md:py-24"
    >
      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col items-center px-4 text-center sm:px-6 lg:px-10">
        {data?.title?.[lang] ? (
          <h2 className="text-3xl font-extrabold text-white font-title md:text-5xl">
            {data.title[lang]}
          </h2>
        ) : null}

        {data?.description?.[lang] ? (
          <p className="mt-4 max-w-3xl text-base text-white/85 font-description md:text-lg">
            {data.description[lang]}
          </p>
        ) : null}

        {embed ? (
          <div className="mt-10 w-full max-w-4xl">
            <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-black/40 ring-1 ring-white/10">
              <iframe
                src={embed}
                title="Video"
                width={1280}
                height={720}
                className="absolute inset-0 h-full w-full border-0"
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
