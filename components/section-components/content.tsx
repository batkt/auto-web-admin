'use client';
import { SectionData } from '@/lib/types/section.types';
import React, { useState, useCallback } from 'react';
import SectionViewer from './viewer';
import SectionEditor from './editor';
import { Blog } from '@/lib/types/blog.types';

const SectionContent = ({
  section,
  blogList,
  footerData,
}: {
  section: SectionData;
  blogList: Blog[];
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
          <SectionViewer section={sectionData} blogList={blogList} footerData={footerData} />
        }
      />
    </div>
  );
};

export default SectionContent;
