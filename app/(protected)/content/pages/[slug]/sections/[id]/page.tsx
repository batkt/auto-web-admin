import SectionContent from '@/components/section-components/content';
import { getBlogList } from '@/lib/services/blog.service';
import { getSectionByKey } from '@/lib/services/page.service';
import { Blog } from '@/lib/types/blog.types';
import { Product } from '@/lib/types/product.types';
import React from 'react';
import { getProductList } from '@/lib/services/blog.service';

interface SectionDetailProps {
  params: Promise<{
    id: string;
  }>;
}

const SectionDetail = async (props: SectionDetailProps) => {
  const { id } = await props.params;
  const sectionResponse = await getSectionByKey(id);
  const section = sectionResponse.data;

  let list: Blog[] = [];
  if (section.key === 'home-blog') {
    const listResponse = await getBlogList({
      limit: 3,
    });

    list = listResponse.data.data;
  }

  let footerData: any = {};
  if (section.key === 'footer') {
    const headerResponse = await getSectionByKey('header');
    const contractFormResponse = await getSectionByKey('contact-info');
    const header = headerResponse.data;
    const contractForm = contractFormResponse.data;
    footerData = {
      header,
      contractForm,
    };
  }

  return (
    <div>
      <SectionContent section={section} blogList={list} />
    </div>
  );
};

export default SectionDetail;
