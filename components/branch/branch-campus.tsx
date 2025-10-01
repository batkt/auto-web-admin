'use client';
import React from 'react';

const BranchCampus = ({ lang, data }: { lang: string; data: any }) => {
  return (
    <div className="text-center mb-12 lg:mb-16">
      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
        {data.title[lang]}
      </h2>
      <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
        {data.description[lang]}
      </p>
    </div>
  );
};

export default BranchCampus;
