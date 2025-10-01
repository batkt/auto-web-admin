import React from 'react';

const DonateTransparency = ({ data, lang }: { data: any; lang: string }) => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container max-w-6xl mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">{data.title[lang] || ''}</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {data.description[lang] || ''}
          </p>
        </div>
      </div>
    </section>
  );
};

export default DonateTransparency;
