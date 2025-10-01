import React from 'react';

const Community = ({
  data,
  lang,
  device,
}: {
  data: any;
  lang: string;
  device: 'desktop' | 'mobile';
}) => {
  return (
    <div className="mb-16">
      <h3 className="text-3xl font-bold text-foreground mb-6">{data.title?.[lang]}</h3>
      <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
        {data.description?.[lang]}
      </div>
    </div>
  );
};

export default Community;
