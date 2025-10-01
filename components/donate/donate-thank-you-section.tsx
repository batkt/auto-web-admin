import React from 'react';

const DonateThankYouSection = ({ data, lang }: { data: any; lang: string }) => {
  return (
    <section className="py-20 bg-primary text-primary-foreground">
      <div className="container max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-4">{data.title[lang] || ''}</h2>
        <p className="text-lg opacity-90 mb-8">{data.description[lang] || ''}</p>
      </div>
    </section>
  );
};

export default DonateThankYouSection;
