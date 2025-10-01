'use client';

import React from 'react';
import CountUp from '@/components/ui/count-up';
import { cn } from '@/lib/utils';

const StatsSection = ({
  device,
  data,
  lang,
}: {
  device: 'desktop' | 'mobile';
  data: any;
  lang: string;
}) => {
  const count = data.stats.servedOver.value;

  return (
    <div
      className={cn(
        'absolute z-[2] w-full',
        device === 'desktop' ? 'bottom-0 translate-y-1/2' : ''
      )}
    >
      <div className="w-full container max-w-6xl px-6 mx-auto">
        <div
          className={cn(
            'w-full grid shadow-md',
            device === 'desktop' ? 'grid-cols-10' : 'grid-cols-1 -translate-y-1/2'
          )}
        >
          <div className={cn('bg-amber-500 p-6', device === 'desktop' ? 'col-span-4' : '')}>
            <p className={cn('text-xl', device === 'desktop' ? 'mb-4' : 'mb-2')}>
              {data.stats.servedOver.title[lang]}
            </p>
            <CountUp
              from={count * 0.9}
              to={count}
              separator=","
              direction="up"
              duration={0.05}
              className="text-6xl"
            />
            {data.stats.servedOver.desc ? (
              <p className={cn('text-xl', device === 'desktop' ? 'mt-4' : 'mt-2')}>
                {data.stats.servedOver.desc[lang]}
              </p>
            ) : null}
          </div>
          <div className={cn('bg-amber-400 p-6', device === 'desktop' ? 'col-span-3' : '')}>
            <p className="text-xl mb-2 lg:mb-4">{data.stats.donate.title[lang]}</p>
            <p className="text-gray-700">{data.stats.donate.desc[lang]}</p>
          </div>
          <div className={cn('bg-amber-300 p-6', device === 'desktop' ? 'col-span-3' : '')}>
            <p className={cn('text-xl', device === 'desktop' ? 'mb-4' : 'mb-2')}>
              {data.stats.volunteer.title[lang]}
            </p>
            <p className="text-gray-700">{data.stats.volunteer.desc[lang]}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
