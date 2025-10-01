'use server';

import { ACCESS_TOKEN_KEY, getCookie } from '../cookie';
import { httpClient } from '../http-client';

export const updateSectionData = async (id: string, data: any) => {
  const token = await getCookie(ACCESS_TOKEN_KEY);
  const res = await httpClient.put<{
    data: any;
  }>(`/sections/${id}`, data, token);
  return res;
};
