'use server';

import { httpClient } from '../http-client';
import { getCookie, ACCESS_TOKEN_KEY } from '../cookie';
import { Branch } from '../types/branch.types';

export const createBranch = async (branchData: Partial<Branch>) => {
  const token = await getCookie(ACCESS_TOKEN_KEY);
  return httpClient.post<Branch>('/branches/', branchData, token);
};

export const updateBranch = async (id: string, branchData: Partial<Branch>) => {
  return httpClient.put<Branch>(`/branches/${id}`, branchData);
};

export const deleteBranch = async (id: string) => {
  return httpClient.delete<{ message: string }>(`/branches/${id}`);
};
