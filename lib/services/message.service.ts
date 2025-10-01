import { httpClient } from '../http-client';
import { Message } from '../types/message.types';

export const getMessagesList = async (page: number = 1, limit: number = 10, search?: string) => {
  const params = new URLSearchParams();
  if (page) params.append('page', page.toString());
  if (limit) params.append('limit', limit.toString());
  if (search) params.append('search', search);

  const url = `/contact/messages${params.toString() ? `?${params.toString()}` : ''}`;
  return httpClient.get<{
    data: Message[];
    total: number;
    totalPages: number;
    currentPage: number;
  }>(url);
};
