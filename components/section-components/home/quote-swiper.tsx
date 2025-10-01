'use client';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

interface Quote {
  quote: {
    en: string;
    mn: string;
  };
  author: {
    en: string;
    mn: string;
  };
}

export default function QuoteSwiper({ data, lang }: { data: any; lang: string }) {
  const quotes: Quote[] = data.items;

  return (
    <section className="w-full py-20 bg-transparent">
      <div className="container max-w-6xl mx-auto px-6 relative z-[2]">
        <div className="relative">
          {/* Quote Display */}
          <div className="p-8 md:p-12 min-h-[400px] flex flex-col justify-center">
            {/* Swiper Container */}
            <Swiper
              modules={[Autoplay, Pagination]}
              spaceBetween={16}
              slidesPerView={1}
              autoplay={{
                delay: 5000,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              speed={800}
              loop={true}
              className="quote-swiper"
            >
              {quotes.map((quote, index) => (
                <SwiperSlide key={index}>
                  <div className="text-center">
                    {/* Opening Quote Icon */}
                    <div className="flex mb-4">
                      <svg
                        className="w-16 h-16 text-primary/80"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
                      </svg>
                    </div>
                    {/* Quote Text */}
                    <blockquote>
                      <p className="text-2xl md:text-3xl text-white leading-relaxed font-normal italic max-w-4xl mx-auto">
                        {quote.quote?.[lang as keyof typeof quote.quote]}
                      </p>
                    </blockquote>
                    {/* Closing Quote Icon */}
                    <div className="flex justify-end mt-4">
                      <svg
                        className="w-16 h-16 text-primary/80 rotate-180"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z" />
                      </svg>
                    </div>

                    {/* Author Info */}
                    <div className="text-center mt-8">
                      {/* <p className="text-lg text-gray-300 mb-3">
                                                {quote.role}
                                            </p> */}
                      <div className="flex justify-center">
                        <div className="relative">
                          <h4 className="text-2xl text-primary font-bold italic transform -rotate-1 relative font-serif">
                            <span className="relative z-10">
                              {quote.author?.[lang as keyof typeof quote.author]}
                            </span>
                            <div className="absolute -bottom-1 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent transform rotate-1"></div>
                          </h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </section>
  );
}
