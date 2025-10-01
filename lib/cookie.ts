/* eslint-disable @typescript-eslint/no-explicit-any */
'server only';

import { cookies } from 'next/headers';
import { decryptJSON, encryptJSON } from './cipher';
import { CIPHER_SECRET, NODE_ENV } from './config';
import { ResponseCookie } from 'next/dist/compiled/@edge-runtime/cookies';

export const ACCESS_TOKEN_KEY = 'CHURCH_1';
export const USER_KEY = 'CHURCH_2';

export const setCookie = async (key: string, data: any, options: Partial<ResponseCookie>) => {
  const cookieStore = await cookies();
  const encryptedToken = encryptJSON(data, CIPHER_SECRET);
  const cookieTokenValue = Buffer.from(JSON.stringify(encryptedToken)).toString('base64');
  cookieStore.set(key, cookieTokenValue, {
    httpOnly: true,
    // secure: NODE_ENV === 'production', // Prod дээр HTTPS байх ёстой
    secure: false,
    sameSite: 'lax',
    path: '/',
    ...options,
  });
};

export const getCookie = async (key: string) => {
  const cookieStore = await cookies();
  const value = cookieStore.get(key)?.value;
  if (!value) {
    return value;
  }
  const payload = JSON.parse(Buffer.from(value, 'base64').toString('utf8'));
  const parsedValue = decryptJSON(payload, CIPHER_SECRET);
  return parsedValue;
};
