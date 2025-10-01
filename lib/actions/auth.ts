'use server';

import jwt, { JwtPayload } from 'jsonwebtoken';
import { httpClient } from '../http-client';
import { LoginInput } from '../types/auth.types';
import { User } from '../types/user.types';
import { ACCESS_TOKEN_KEY, setCookie, USER_KEY } from '../cookie';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export const login = async (data: LoginInput) => {
  const res = await httpClient.post<{
    accessToken: string;
    user: User;
  }>('/auth/login', data);

  if (res.code === 200) {
    const decoded = jwt.decode(res.data.accessToken) as JwtPayload;
    if (!decoded || !decoded?.exp) {
      return {
        code: 401,
        message: 'Алдаа гарлаа',
      };
    }
    await setCookie(ACCESS_TOKEN_KEY, res.data.accessToken, {
      expires: decoded.exp * 1000,
    });
    await setCookie(USER_KEY, res.data.user, {
      expires: decoded.exp * 1000,
    });

    redirect('/dashboard');
  }
  return res;
};

export const logout = async () => {
  const cookieStore = await cookies();
  if (cookieStore.has(ACCESS_TOKEN_KEY)) {
    cookieStore.delete(ACCESS_TOKEN_KEY);
  }
  if (cookieStore.has(USER_KEY)) {
    cookieStore.delete(USER_KEY);
  }
  redirect('/');
};
