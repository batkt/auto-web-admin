'use client';
import { SectionData } from '@/lib/types/section.types';
import React, { useState, useCallback } from 'react';
import SectionViewer from './viewer';
import SectionEditor from './editor';
import { Blog } from '@/lib/types/blog.types';
import { Product } from '@/lib/types/product.types';

const SectionContent = ({
  section,
  blogList,
  productList,
  footerData,
}: {
  section: SectionData;
  blogList: Blog[];
  productList: Product[];
  footerData: any;
}) => {
  const [sectionData, setSectionData] = useState<SectionData>(section);

  const handleDataChange = useCallback((updatedData: any) => {
    setSectionData(prev => ({
      ...prev,
      data: updatedData,
    }));
  }, []);

  return (
    <div className="w-full h-full">
      <SectionEditor
        section={sectionData}
        onDataChange={handleDataChange}
        preview={
          <SectionViewer
            section={sectionData}
            productList={productList}
            blogList={blogList}
            footerData={footerData}
          />
        }
      />
    </div>
  );
};

export default SectionContent;
