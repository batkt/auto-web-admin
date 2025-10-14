'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { getClientImageUrl } from '@/utils';

const AboutSection = ({
  device,
  data,
  lang,
}: {
  device: 'desktop' | 'mobile';
  data: any;
  lang: string;
}) => {
  return (
    <div
      style={{
        backgroundImage: `url(${getClientImageUrl(data.backgroundImage)})`,
        backgroundRepeat: 'no-repeat',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div
        className={cn(
          'mx-auto max-w-7xl px-4 sm:px-6 lg:px-10',
          device === 'desktop' ? 'py-20' : 'py-14'
        )}
      >
        <div
          className={cn(
            'grid items-center gap-10 md:gap-16 lg:gap-20',
            device === 'desktop' ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1 text-center'
          )}
        >
          {/* Text section */}
          <div className={cn(device === 'mobile' && 'flex flex-col items-center')}>
            <p
              className={cn(
                'mb-3 text-base sm:text-lg text-gray-400',
                device === 'desktop' ? 'text-left' : 'text-center'
              )}
            >
              {data.stats?.[lang]}
            </p>

            <p
              className={cn(
                'font-bold text-3xl sm:text-lg text-white mb-4',
                device === 'desktop' ? 'text-left' : ' text-center'
              )}
            >
              {data.title?.[lang]}
            </p>

            <p
              className={cn(
                'text-sm sm:text-base text-gray-400 max-w-lg',
                device === 'desktop' ? 'text-left' : 'text-center mx-auto'
              )}
            >
              {data.description?.[lang]}
            </p>
          </div>

          {/* Stats section */}
          <div
            className={cn(
              'grid gap-6 md:gap-8',
              device === 'desktop'
                ? 'grid-cols-1 sm:grid-cols-3'
                : 'grid-cols-1 sm:grid-cols-2 mt-8'
            )}
          >
            {data.items?.map((item: any, index: number) => (
              <div
                key={index}
                className={cn(
                  'flex flex-col',
                  device === 'desktop' ? 'items-start' : 'items-center text-center'
                )}
              >
                <p
                  className={cn(
                    index === 1 ? 'text-red-600' : 'text-[#0888A3]',
                    'text-3xl sm:text-4xl lg:text-5xl font-bold'
                  )}
                >
                  {item.stat1 || item.stat2 || item.stat3}
                </p>
                <p className="text-white text-sm sm:text-base">{item.desc?.[lang]}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
