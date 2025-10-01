'use server';

import { ACCESS_TOKEN_KEY, getCookie } from '../cookie';
import { httpClient } from '../http-client';
import { User, UserInput } from '../types/user.types';
import { revalidatePath } from 'next/cache';

export const createUser = async (data: UserInput) => {
  const token = await getCookie(ACCESS_TOKEN_KEY);
  const res = await httpClient.post<boolean>('/users/', data, token);
  if (res.code === 200) {
    revalidatePath('/dashboard/users');
  }
  return res;
};

export const getUsers = async () => {
  const token = await getCookie(ACCESS_TOKEN_KEY);
  return httpClient.get<User[]>('/users/', token);
};

export const updateUser = async (userId: string, data: UserInput) => {
  const token = await getCookie(ACCESS_TOKEN_KEY);
  const res = await httpClient.post<boolean>(`/users/${userId}/update`, data, token);
  if (res.code === 200) {
    revalidatePath('/dashboard/users');
  }
  return res;
};

export const deleteUser = async (userId: string) => {
  const token = await getCookie(ACCESS_TOKEN_KEY);
  const res = await httpClient.post<boolean>(`/users/${userId}/delete`, {}, token);
  if (res.code === 200) {
    revalidatePath('/dashboard/users');
  }
  return res;
};

export const resetUserPassword = async (userId: string) => {
  const token = await getCookie(ACCESS_TOKEN_KEY);
  const res = await httpClient.post<boolean>(`/users/${userId}/reset-password`, {}, token);
  if (res.code === 200) {
    revalidatePath('/dashboard/users');
  }
  return res;
};
