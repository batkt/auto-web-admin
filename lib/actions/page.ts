'use server';

import { httpClient } from '../http-client';
import { ACCESS_TOKEN_KEY, getCookie } from '../cookie';

export interface UpdatePageData {
  name: {
    en: string;
    mn: string;
  };
  description: {
    en: string;
    mn: string;
  };
  keywords?: string[];
}

export const updatePage = async (id: string, data: UpdatePageData) => {
  const token = await getCookie(ACCESS_TOKEN_KEY);
  const res = await httpClient.put<{
    data: any;
  }>(`/pages/${id}`, data, token);
  return res;
};
