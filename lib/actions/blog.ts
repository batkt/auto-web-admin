'use server';

import { httpClient } from '../http-client';
import { getCookie, ACCESS_TOKEN_KEY } from '../cookie';
import { Blog, BlogData } from '../types/blog.types';
import { revalidatePath } from 'next/cache';

// Blog actions
export const createBlog = async (blogData: BlogData) => {
  const token = await getCookie(ACCESS_TOKEN_KEY);
  return httpClient.post<Blog>('/blogs', blogData, token);
};

export const updateBlog = async (id: string, blogData: Partial<BlogData>) => {
  const token = await getCookie(ACCESS_TOKEN_KEY);
  const res = await httpClient.put<Blog>(`/blogs/${id}`, blogData, token);

  if (res.code === 200) {
    revalidatePath('/blogs/list');
  }
  return res;
};

export const deleteBlog = async (id: string) => {
  const token = await getCookie(ACCESS_TOKEN_KEY);
  const res = await httpClient.delete<{ message: string }>(`/blogs/${id}`, token);
  if (res.code === 200) {
    revalidatePath('/blogs/list');
  }
  return res;
};

export const publishBlog = async (id: string) => {
  const token = await getCookie(ACCESS_TOKEN_KEY);
  const res = await httpClient.patch<Blog>(`/blogs/${id}/publish`, {}, token);

  if (res.code === 200) {
    revalidatePath('/blogs/list');
  }
  return res;
};

export const unpublishBlog = async (id: string) => {
  const token = await getCookie(ACCESS_TOKEN_KEY);
  const res = await httpClient.patch<Blog>(`/blogs/${id}/unpublish`, {}, token);

  if (res.code === 200) {
    revalidatePath('/blogs/list');
  }
  return res;
};
