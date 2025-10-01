'use server';

import { httpClient } from '../http-client';
import { File as FileType } from '../types/file.types';
import { getCookie, ACCESS_TOKEN_KEY } from '../cookie';

export const uploadFile = async (file: globalThis.File): Promise<FileType> => {
  const token = await getCookie(ACCESS_TOKEN_KEY);
  const formData = new FormData();
  formData.append('file', file);
  const response = await httpClient.post<FileType>('/files/upload', formData, token);
  return response.data;
};

// export const getFiles = async (params?: {
//     page?: number;
//     limit?: number;
//     isActive?: boolean;
// }): Promise<FileListResponse> => {
//     const queryParams = new URLSearchParams();

//     if (params?.page) queryParams.append('page', params.page.toString());
//     if (params?.limit) queryParams.append('limit', params.limit.toString());
//     if (params?.isActive !== undefined) queryParams.append('isActive', params.isActive.toString());

//     const url = `/files${queryParams.toString() ? `?${queryParams.toString()}` : ''}`;

//     const response = await httpClient.get<FileListResponse>(url);
//     return response.data;
// };

// export const getFileById = async (id: string): Promise<FileType> => {
//     const response = await httpClient.get<FileType>(`/files/${id}`);
//     return response.data;
// };

// export const updateFileStatus = async (id: string, isActive: boolean): Promise<FileType> => {
//     const token = await getCookie(ACCESS_TOKEN_KEY);

//     const response = await httpClient.patch<FileType>(`/files/${id}/status`, { isActive }, {
//         token: token?.value,
//     });

//     return response.data;
// };

// export const deleteFile = async (id: string): Promise<void> => {
//     const token = await getCookie(ACCESS_TOKEN_KEY);

//     await httpClient.delete(`/files/${id}`, {
//         token: token?.value,
//     });
// };
