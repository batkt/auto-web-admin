import { httpClient } from '../http-client';
import { Blog } from '../types/blog.types';
import { Product } from '../types/product.types';

export const getBlogById = async (id: string) => {
  return httpClient.get<Blog>(`/blogs/${id}`);
};

export const getBlogBySlug = async (slug: string) => {
  return httpClient.get<Blog>(`/blogs/slug/${slug}`);
};

export const getProductList = async (query?: {
  status?: string;
  brand?: string; // brand/category filter
  page?: number;
  limit?: number;
  search?: string;
  language?: string;
}) => {
  const params = new URLSearchParams();

  if (query?.status) params.append('status', query.status);
  if (query?.brand) params.append('brand', query.brand);
  if (query?.page) params.append('page', query.page.toString());
  if (query?.limit) params.append('limit', query.limit.toString());
  if (query?.search) params.append('search', query.search);
  if (query?.language) params.append('language', query.language);

  const url = `/products${params.toString() ? `?${params.toString()}` : ''}`;

  return httpClient.get<{
    data: Product[];
    total: number;
    totalPages: number;
    currentPage: number;
  }>(url);
};

export const getBlogList = async (query?: {
  status?: string;
  category?: string;
  page?: number;
  limit?: number;
  search?: string;
  language?: string;
}) => {
  const params = new URLSearchParams();
  if (query?.status) params.append('status', query.status);
  if (query?.category) params.append('category', query.category);
  if (query?.page) params.append('page', query.page.toString());
  if (query?.limit) params.append('limit', query.limit.toString());
  if (query?.search) params.append('search', query.search);
  if (query?.language) params.append('language', query.language);

  const url = `/blogs${params.toString() ? `?${params.toString()}` : ''}`;
  return httpClient.get<{ data: Blog[]; total: number; totalPages: number; currentPage: number }>(
    url
  );
};
