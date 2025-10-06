'use client';

import React from 'react';
import BlurText from '@/components/ui/blur-text';
import { cn } from '@/lib/utils';
import { getClientImageUrl, getImageUrl } from '@/utils';
import Image from 'next/image';

const HeroSection = ({
  device,
  data,
  lang,
}: {
  device: 'desktop' | 'mobile';
  data: any;
  lang: string;
}) => {
  const bgUrl = data?.backgroundImage ? getImageUrl(data.backgroundImage) : '';
  const productUrl = data?.productImage ? getImageUrl(data.productImage) : undefined;
  return (
    <section id="#" className="relative isolate w-full overflow-hidden">
      {bgUrl && (
        <Image
          src={bgUrl}
          alt=""
          fill
          sizes="100vw"
          priority
          aria-hidden
          className="pointer-events-none select-none object-cover object-center -z-10"
        />
      )}
      <div className={cn('mx-auto max-w-7xl px-4 sm:px-6 lg:px-10')}>
        <div
          className={cn(
            'grid items-center gap-10',
            device === 'desktop'
              ? 'min-h-[calc(100vh-5rem)] grid-cols-1 md:grid-cols-2 md:gap-16 lg:gap-24 py-12'
              : 'grid-cols-1 text-center py-16'
          )}
        >
          <div
            className={cn(
              'order-2 md:order-1',
              device === 'mobile' && 'flex flex-col items-center'
            )}
          >
            <h1
              className={cn(
                'font-extrabold leading-tight text-white',
                device === 'desktop' ? 'text-left' : 'text-center'
              )}
            >
              <span
                className={cn('block', device === 'desktop' ? 'text-5xl ' : 'text-3xl sm:text-4xl')}
              >
                {data.mainTitle?.[lang]}
              </span>
              <span
                className={cn(
                  'mt-1 block text-[#0888A3] whitespace-nowrap',
                  device === 'desktop' ? 'text-5xl' : 'text-3xl sm:text-4xl'
                )}
              >
                {data.secondaryTitle?.[lang]}
              </span>
            </h1>

            <p
              className={cn(
                'mt-6 font-semibold text-white/90',
                device === 'desktop'
                  ? 'max-w-xl text-base sm:text-lg'
                  : 'max-w-md text-sm sm:text-base mx-auto'
              )}
            >
              {data.description?.[lang]}
            </p>

            <button
              className={cn(
                'mt-8 inline-flex items-center justify-center rounded-full bg-[#e63946] text-white font-semibold shadow-lg transition-colors duration-500 ease-in-out hover:bg-[#0888A3] transform hover:scale-105',
                device === 'desktop'
                  ? 'px-8 py-3 sm:px-10 sm:py-4 text-base sm:text-lg'
                  : 'px-6 py-3 text-sm sm:text-base'
              )}
            >
              {data.ctaText?.[lang]}
            </button>
          </div>

          <div
            className={cn(
              'flex items-center justify-center',
              device === 'desktop' ? 'order-1 md:order-2' : 'order-1'
            )}
          >
            <Image
              src={getImageUrl(data.productImage)}
              alt="Featured product"
              width={680}
              height={600}
              priority
              sizes="(max-width: 768px) 85vw, (max-width: 1280px) 50vw, 680px"
              className={cn(
                'h-auto object-contain drop-shadow-2xl',
                device === 'desktop' ? 'w-[min(90vw,680px)]' : 'w-[min(85vw,420px)] mt-6'
              )}
            />
          </div>
        </div>
      </div>

      {/* <div className="absolute inset-0 bg-gradient-to-b from-black/5 via-black/20 to-black/100"></div>

      <div
        className={cn(
          'absolute z-[1] inset-0 flex flex-col items-center justify-start gap-y-8',
          device === 'desktop' ? 'pt-40' : 'pt-32'
        )}
      >
        <BlurText
          text={data.mainTitle[lang]}
          delay={150}
          animateBy="words"
          direction="top"
          className="max-w-md font-extrabold text-white text-5xl sm:text-6xl sm:max-w-4xl px-6 text-center leading-14 sm:leading-16 flex justify-center drop-shadow-2xl"
        />
        <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-8 py-3 rounded-lg transition-all duration-300 transform hover:scale-105">
          {data.ctaText[lang]}
        </button>
      </div> */}
    </section>
  );
};

export default HeroSection;
