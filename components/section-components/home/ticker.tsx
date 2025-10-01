'use client';

import { getImageUrl } from '@/utils';
import Image from 'next/image';
import Marquee from 'react-fast-marquee';

const rowsDefaultData = [
  {
    images: [],
    direction: 1,
    speed: 40,
  },
  {
    images: [],
    direction: -1,
    speed: 40,
  },
  {
    images: [],
    direction: 1,
    speed: 40,
  },
];

export default function Ticker({ data, lang }: { data: any, lang: string }) {

  const perRowImagesCount = Math.ceil(data.images.length / 3);
  const rows = rowsDefaultData.map((row, index) => {
    return {
      ...row,
      images: data.images.slice(index * perRowImagesCount, (index + 1) * perRowImagesCount)
    }
  })

  return (
    <div className='py-20'>
      <div className='mb-16 text-center px-6'>
        <h2 className='text-3xl sm:text-4xl text-center font-medium mb-6'>{data.title[lang]}</h2>
        <p className='text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed'>{data.description[lang]}</p>
      </div>
      {rows.map((row, rowIndex) => (
        <Marquee
          key={rowIndex}
          className="py-4"
          direction={rowIndex % 2 === 0 ? 'left' : 'right'}
        >
          {row.images.map((src: string, i: number) => (
            // <motion.div
            //   key={`${rowIndex}-${i}`}
            //   layoutId={`row-${rowIndex}-${src}`}
            // >
            <Image
              key={`${rowIndex}-${i}`}
              src={getImageUrl(src)}
              alt=""
              width={500}
              height={250}
              className="h-[250px] w-auto object-cover rounded-lg mx-4"
            />
            // </motion.div>
          ))}
        </Marquee>
      ))}
    </div>
  );
}
