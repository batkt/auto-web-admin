'use server';

import { ACCESS_TOKEN_KEY, getCookie } from '../cookie';
import { httpClient } from '../http-client';
import { Category, CategoryData } from '../types/category.types';

// Category actions
export const createCategory = async (categoryData: CategoryData) => {
  const token = await getCookie(ACCESS_TOKEN_KEY);
  return httpClient.post<Category>('/categories', categoryData, token);
};

export const updateCategory = async (id: string, categoryData: Partial<CategoryData>) => {
  const token = await getCookie(ACCESS_TOKEN_KEY);
  return httpClient.put<Category>(`/categories/${id}`, categoryData, token);
};

export const deleteCategory = async (id: string) => {
  const token = await getCookie(ACCESS_TOKEN_KEY);
  return httpClient.delete<{ message: string }>(`/categories/${id}`, token);
};
