import { httpClient } from '../http-client';
import { Page } from '../types/page.types';
import { SectionData } from '../types/section.types';

export const getPages = async () => {
  return httpClient.get<Page[]>('/pages');
};

export const getPageBySlug = async (slug: string) => {
  return httpClient.get<Page>(`/pages/detail/${slug}`);
};

export const getPageSections = async (pageKey: string) => {
  return httpClient.get<SectionData[]>(`/pages/sections/${pageKey}`);
};

export const getSectionByKey = async (key: string) => {
  return httpClient.get<SectionData>(`/sections/${key}`);
};
