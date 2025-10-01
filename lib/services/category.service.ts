import { httpClient } from '../http-client';
import { Category, CategoryData } from '../types/category.types';

export const getCategoryById = async (id: string) => {
  return httpClient.get<Category>(`/categories/${id}`);
};

export const getCategoryList = async () => {
  return httpClient.get<Category[]>('/categories');
};

export const createCategory = async (data: CategoryData) => {
  return httpClient.post<Category>('/categories', data);
};

export const updateCategory = async (id: string, data: Partial<CategoryData>) => {
  return httpClient.put<Category>(`/categories/${id}`, data);
};

export const deleteCategory = async (id: string) => {
  return httpClient.delete(`/categories/${id}`);
};
