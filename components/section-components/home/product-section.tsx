// components/ProductSection.tsx
'use client';

import React, { useMemo, useRef, useState, useId } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { getImageUrl } from '@/utils';

// Swiper
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperInstance } from 'swiper';
import type { SwiperRef } from 'swiper/react';
import { A11y, Keyboard } from 'swiper/modules';
import 'swiper/css';

type Device = 'desktop' | 'mobile';
type Localized = Record<string, string>;
type Item = {
  productImage: string;
  name: Localized;
  title?: Localized;
  secondaryTitle?: Localized;
};

interface ProductSectionData {
  backgroundImage?: string;
  buttonText?: Localized;
  buttonUrl?: string;
  items?: Item[];
}

interface Props {
  device: Device;
  data: ProductSectionData;
  lang: string;
}

export default function ProductSection({ data, lang, device }: Props) {
  // --- helpers ---
  const toUrlOrNull = (v?: string | null): string | null => {
    if (!v) return null;
    const u = getImageUrl(String(v));
    return typeof u === 'string' && u.trim() ? u : null;
  };

  const t = (obj?: Localized): string =>
    !obj ? '' : (obj[lang] ?? obj.en ?? Object.values(obj)[0] ?? '').toString();

  // bg
  const bgUrl = toUrlOrNull(data?.backgroundImage);
  const isDesktop = device === 'desktop';
  const isMobile = !isDesktop;

  // items тогтворжуулах
  const items: Item[] = useMemo(() => (Array.isArray(data?.items) ? data!.items! : []), [data]);
  const total = items.length;

  // хангалттай олон үед л loop асаана; эсрэг үед rewind
  const slidesPerViewVal = isDesktop ? Math.min(3, Math.max(1, total)) : total > 1 ? 1.4 : 1;
  const enableLoop =
    (isMobile && total >= 2) ||
    (!isMobile &&
      total >= (typeof slidesPerViewVal === 'number' ? Math.ceil(slidesPerViewVal) + 1 : 4));
  const canShowArrows = total > 1;
  const spaceBetween = isDesktop ? 40 : 16;

  const swiperRef = useRef<SwiperRef | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const activeItem = total ? items[activeIndex % total] : undefined;
  const inst = (): SwiperInstance | undefined => swiperRef.current?.swiper;
  const slidePrev = () => inst()?.slidePrev();
  const slideNext = () => inst()?.slideNext();

  // a11y
  const carouselId = useId();

  const Arrow = ({ dir, onClick }: { dir: 'left' | 'right'; onClick: () => void }) => (
    <button
      type="button"
      onClick={onClick}
      aria-controls={carouselId}
      aria-label={dir === 'left' ? 'Previous' : 'Next'}
      className={cn(
        'absolute top-1/2 -translate-y-1/2 z-10 text-7xl text-gray-400 hover:text-white transition-colors duration-300',
        dir === 'left' ? 'left-3 md:left-6' : 'right-3 md:right-6'
      )}
    >
      {dir === 'left' ? '‹' : '›'}
    </button>
  );

  return (
    <section className="relative w-full overflow-hidden bg-[#111]">
      {/* bg image only if valid url */}
      {bgUrl && (
        <Image
          src={bgUrl}
          alt=""
          fill
          sizes="100vw"
          priority
          className="object-cover object-center pointer-events-none select-none opacity-90"
        />
      )}

      <div
        className={cn(
          'w-full relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 flex flex-col items-center',
          isDesktop
            ? 'md:max-h=[800px] md:h-[calc(100vh-120px)] pt-12'
            : 'h-auto pt-12 sm:pt-12 pb-12'
        )}
      >
        <h2
          className={cn(
            'text-center font-semibold text-white',
            isDesktop ? 'mt-10 text-4xl lg:text-5xl' : 'text-2xl sm:text-3xl'
          )}
        >
          {t(activeItem?.title)}
        </h2>
        <h3
          className={cn(
            'mt-2 text-center font-extrabold text-[#0888A3]',
            isDesktop ? 'text-4xl lg:text-5xl' : 'text-2xl sm:text-3xl'
          )}
        >
          {t(activeItem?.secondaryTitle)}
        </h3>

        {/* Slider */}
        {total > 0 && (
          <div
            className="relative mt-8 w-full product-swiper"
            role="region"
            aria-roledescription="carousel"
            aria-label="Product carousel"
          >
            {canShowArrows && (
              <>
                <Arrow dir="left" onClick={slidePrev} />
                <Arrow dir="right" onClick={slideNext} />
              </>
            )}

            <Swiper
              id={carouselId}
              ref={swiperRef}
              key={`${enableLoop}-${total}-${device}`}
              modules={[A11y, Keyboard]}
              loop={enableLoop}
              rewind={!enableLoop}
              loopAdditionalSlides={Math.max(2, total)}
              observer
              observeParents
              watchOverflow
              centeredSlides
              slidesPerView={slidesPerViewVal}
              spaceBetween={spaceBetween}
              speed={500}
              onSlideChange={sw => setActiveIndex(sw.realIndex)}
              keyboard={{ enabled: true }}
              a11y={{
                prevSlideMessage: 'Previous slide',
                nextSlideMessage: 'Next slide',
              }}
              className="!overflow-visible"
            >
              {items.map((item, idx) => {
                const img = toUrlOrNull(item?.productImage);
                const title = t(item.name) || 'Product image';

                return (
                  <SwiperSlide key={`${idx}-${img ?? 'noimg'}`}>
                    <div
                      className={cn(
                        'mx-auto flex items-center justify-center',
                        isDesktop ? 'h-[200px] w-[420px] max-w-full' : 'h-[240px] w-[240px]'
                      )}
                    >
                      <div className="relative h-full w-full">
                        {img ? (
                          <Image
                            src={img}
                            alt={title}
                            fill
                            sizes="(max-width:768px) 60vw, 420px"
                            className="object-contain select-none pointer-events-none"
                            // only mark as priority when we DO have a valid url
                            priority={idx < 3}
                          />
                        ) : (
                          // simple placeholder to avoid empty src warnings
                          <div
                            className="h-full w-full grid place-items-center rounded-xl bg-white/5 ring-1 ring-white/10"
                            aria-label="Image unavailable"
                          >
                            <span className="text-white/60 text-sm">No image</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>

            {/* Caption + CTA */}
            {activeItem && (
              <div className="mt-6 flex flex-col items-center" aria-live="polite">
                <p
                  className={cn(
                    'text-white font-semibold text-center',
                    isDesktop ? 'text-3xl' : 'text-xl'
                  )}
                >
                  {t(activeItem.name)}
                </p>
                <button
                  type="button"
                  className="mt-4 rounded-full bg-[#E84747] px-6 py-3 text-white font-semibold hover:brightness-110 active:brightness-95 focus:outline-none focus:ring-2 focus:ring-white/60"
                  aria-label={t(data?.buttonText) || 'View product detail'}
                  onClick={() => {
                    const url = data?.buttonUrl;
                    if (url) {
                      if (url.startsWith('http') || url.startsWith('//')) {
                        window.open(url, '_blank', 'noopener,noreferrer');
                      } else {
                        window.location.href = url;
                      }
                    }
                  }}
                >
                  {data?.buttonText?.[lang]}
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Active slide emphasis */}
      <style jsx global>{`
        .product-swiper .swiper-slide {
          transition: transform 300ms ease, opacity 300ms ease;
          transform: scale(0.78);
          opacity: 0.6;
        }
        .product-swiper .swiper-slide-active {
          transform: scale(1);
          opacity: 1;
        }
      `}</style>
    </section>
  );
}
