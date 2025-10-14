'use server';
import { httpClient } from '../http-client';
import { getCookie, ACCESS_TOKEN_KEY } from '../cookie';
import { Message } from '../types/message.types';
import { revalidatePath } from 'next/cache';

export interface ContactFormData {
  firstName: string;
  phone: string;
  email: string;
  message: string;
}

export const saveMessage = async (formData: ContactFormData) => {
  try {
    const response = await httpClient.post('/contact/messages', formData);
    return response;
  } catch (error) {
    console.error('Error saving message:', error);
    throw error;
  }
};

export const seenMessage = async (id: string) => {
  const token = await getCookie(ACCESS_TOKEN_KEY);
  const response = await httpClient.post<Message>('/contact/messages/seen', { id }, token);
  revalidatePath('/messages');
  return response.data;
};
