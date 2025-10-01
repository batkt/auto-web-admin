'use client';

import React from 'react';
// import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

const LanguageTabs = ({
  lang,
  handleChangeLang,
}: {
  lang: string;
  handleChangeLang: (v: string) => void;
}) => {
  return (
    <div>
      {/* <Label className="text-sm font-medium text-gray-700 mb-3 block">Хэл</Label> */}
      <Tabs value={lang} onValueChange={v => handleChangeLang(v)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="en">English</TabsTrigger>
          <TabsTrigger value="mn">Монгол</TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default LanguageTabs;
