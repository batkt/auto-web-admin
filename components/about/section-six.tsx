'use client';
import { cn } from '@/lib/utils';
import React from 'react';

const SectionSix = ({
  data,
  lang,
  device,
}: {
  data: any;
  lang: string;
  device: 'desktop' | 'mobile';
}) => {
  const items = [
    {
      icon: (
        <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      icon: (
        <svg className="w-4 h-4 text-secondary-foreground" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
    {
      icon: (
        <svg className="w-4 h-4 text-accent-foreground" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
        </svg>
      ),
    },
    {
      icon: (
        <svg className="w-4 h-4 text-primary" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
            clipRule="evenodd"
          />
        </svg>
      ),
    },
  ].map((item, index) => {
    return {
      ...item,
      ...data.items?.[index],
    };
  });

  return (
    <div className="mb-16">
      <h3 className="text-3xl font-bold text-foreground mb-6">{data.title?.[lang]}</h3>
      <div className="grid md:grid-cols-2 gap-8">
        {items.map((item, index) => {
          return (
            <div key={index} className="flex items-start space-x-3">
              <div
                className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1',
                  index % 3 === 0 ? 'bg-primary/10' : ''
                )}
              >
                {item.icon}
              </div>
              <div>
                <h4 className="font-semibold text-foreground">{item.title?.[lang]}</h4>
                <p className="text-muted-foreground">{item.description?.[lang]}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SectionSix;
