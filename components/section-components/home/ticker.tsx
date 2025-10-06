'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { getImageUrl, getClientImageUrl } from '@/utils';

import 'swiper/css';
import 'swiper/css/pagination';

interface Quote {
  proImage: string;
  proName: string;
  proComment: string;
}

export default function Ticker({
  lang,
  data,
  device,
}: {
  lang: string;
  data: any;
  device: 'desktop' | 'mobile';
}) {
  const quotes: Quote[] = data.item;
  const bgUrl = data?.backgroundImage ? getImageUrl(data.backgroundImage) : '';

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
          'relative  w-full pt-10 mx-auto px-4 sm:px-6 lg:px-10',
          device === 'desktop'
            ? 'max-w-7xl  md:max-h-[800px] md:h-[calc(100vh-120px)]'
            : 'max-w-full h-auto pt-12 sm:pt-12 pb-12'
        )}
      >
        <h2
          className={cn(
            ' text-center font-semibold text-white',
            device === 'desktop' ? 'mt-10 text-4xl lg:text-5xl' : 'text-2xl sm:text-3xl'
          )}
        >
          {data?.title?.[lang]}
        </h2>
        <h3
          className={cn(
            'mt-2 text-center font-extrabold text-[#0888A3]',
            device === 'desktop' ? 'text-4xl lg:text-5xl' : 'text-2xl sm:text-3xl'
          )}
        >
          {data?.secondaryTitle?.[lang]}
        </h3>

        {/* === Swiper block (шинээр нэмэгдсэн хэсэг) === */}
        <div className="pt-14">
          <Swiper
            modules={[Autoplay, Pagination]}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            pagination={{ clickable: true }}
            spaceBetween={device === 'desktop' ? 24 : 16}
            slidesPerView={device === 'desktop' ? 3 : 1}
            slidesPerGroup={1}
            breakpoints={{
              0: { slidesPerView: 1, slidesPerGroup: 1, spaceBetween: 16 },
              640: { slidesPerView: 1, slidesPerGroup: 1, spaceBetween: 20 },
              768: { slidesPerView: 2, slidesPerGroup: 1, spaceBetween: 24 },
              1024: { slidesPerView: 3, slidesPerGroup: 1, spaceBetween: 24 },
            }}
            className="!pb-12"
          >
            {quotes?.map((q, idx) => (
              <SwiperSlide key={`${q.proName}-${idx}`}>
                <figure className="group h-full flex flex-col items-center text-center">
                  {/* Quote mark */}
                  <div className="text-4xl sm:text-5xl text-white/40 mb-4">”</div>

                  {/* Comment */}
                  <blockquote className="text-white text-base sm:text-lg leading-relaxed max-w-[36ch] sm:max-w-[40ch] mx-auto">
                    {q.proComment}
                  </blockquote>

                  {/* Avatar */}
                  <div className="mt-6">
                    <div className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full ring-2 ring-white/40 overflow-hidden">
                      {q.proImage}
                      <Image
                        src={getImageUrl(q.proImage)}
                        alt={q.proName}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* Name (зүүн/баруун цэнхэр, дунд улаан) */}
                  <figcaption
                    className={cn(
                      'mt-3 font-semibold',
                      idx % 2 === 1 ? 'text-red-500' : 'text-[#0aa3b8]'
                    )}
                  >
                    {q.proName}
                  </figcaption>
                </figure>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <style jsx global>{`
        .swiper-pagination-bullet {
          background: rgba(255, 255, 255, 0.5);
          opacity: 1;
        }
        .swiper-pagination-bullet-active {
          background: #0aa3b8;
        }
      `}</style>
    </div>
  );
}
