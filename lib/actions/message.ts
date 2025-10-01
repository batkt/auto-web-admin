'use server';
import { httpClient } from '../http-client';
import { getCookie, ACCESS_TOKEN_KEY } from '../cookie';
import { Message } from '../types/message.types';
import { revalidatePath } from 'next/cache';

export const seenMessage = async (id: string) => {
  const token = await getCookie(ACCESS_TOKEN_KEY);
  const response = await httpClient.post<Message>('/contact/messages/seen', { id }, token);
  revalidatePath('/messages');
  return response.data;
};
