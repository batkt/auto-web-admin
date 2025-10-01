import { PageDetailClient } from '@/components/page-components/page-detail-client';
import { getPageBySlug, getPageSections } from '@/lib/services/page.service';
import { Page } from '@/lib/types/page.types';
import { SectionData } from '@/lib/types/section.types';
import { notFound } from 'next/navigation';

interface IProps {
  params: Promise<{
    slug: string;
  }>;
}

export default async function PageDetail(props: IProps) {
  const { slug } = await props.params;

  let page: Page;
  let sections: SectionData[] = [];

  try {
    const responsePage = await getPageBySlug(slug);
    page = responsePage.data;
    const responseSections = await getPageSections(slug);
    sections = responseSections.data;
  } catch (error) {
    notFound();
  }

  return <PageDetailClient initialPage={page} initialSections={sections} slug={slug} />;
}
