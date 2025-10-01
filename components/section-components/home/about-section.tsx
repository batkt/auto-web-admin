'use cleint';

import React from 'react';

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
    <div className="relative w-full py-20 pt-[360px]">
      <div className='absolute inset-0 bg-[url("/admin/assets/images/noise.png")] bg-repeat opacity-10'></div>
      <div className="w-full container max-w-6xl px-6 mx-auto pb-[200px]">
        <h1 className="text-3xl sm:text-4xl text-center uppercase max-w-3xl mx-auto mb-6">
          {data.title[lang]}
        </h1>
        <p className="text-xl text-muted-foreground leading-relaxed">{data.description[lang]}</p>
      </div>
    </div>
  );
};

export default AboutSection;
