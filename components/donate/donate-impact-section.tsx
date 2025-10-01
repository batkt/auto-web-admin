'use client';
import { cn } from '@/lib/utils';
import React from 'react';
import { FaHeart, FaHandsPraying, FaHouseMedical, FaUsers } from 'react-icons/fa6';

const DonateImpactSection = ({ data, lang }: { data: any; lang: string }) => {
  const icons = [
    {
      icon: FaHandsPraying,
      className: 'text-primary',
      bgColor: 'bg-primary/10',
    },
    {
      icon: FaUsers,
      className: 'text-accent-foreground',
      bgColor: 'bg-accent/50',
    },
    {
      icon: FaHouseMedical,
      className: 'text-secondary-foreground',
      bgColor: 'bg-secondary/50',
    },
    {
      icon: FaHeart,
      className: 'text-muted-foreground',
      bgColor: 'bg-muted/50',
    },
  ];

  const itemsData = icons.map((item, index) => ({
    title: data.items[index].title,
    description: data.items[index].description,
    ...item,
  }));

  return (
    <section className="py-20 bg-muted/30">
      <div className="container max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{data.title[lang] || ''}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {data.description[lang] || ''}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {itemsData.map((item, index) => (
            <div key={`impact-${index}`} className="text-center space-y-4">
              <div
                className={cn(
                  'p-4 rounded-full w-16 h-16 flex items-center justify-center mx-auto',
                  item.bgColor
                )}
              >
                <item.icon className={cn('size-8', item.className)} />
              </div>
              <h3 className="text-xl font-semibold">{item.title[lang] || ''}</h3>
              <p className="text-muted-foreground">{item.description[lang] || ''}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default DonateImpactSection;
