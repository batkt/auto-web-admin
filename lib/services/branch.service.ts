import { ACCESS_TOKEN_KEY, getCookie } from '../cookie';
import { httpClient } from '../http-client';
import { Branch } from '../types/branch.types';

export const getBranches = async () => {
  return httpClient.get<Branch[]>('/branches/');
};

export const getBranchById = async (id: string) => {
  return httpClient.get<Branch>(`/branches/${id}`);
};
