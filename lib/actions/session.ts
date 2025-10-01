'use server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { User } from '../types/user.types';
import { BACKEND_URL } from '../config';

const SESSION_KEY = 'accessToken';

export async function setSession(token: string) {
  const cookieStore = await cookies();

  let maxAge = 60 * 60 * 24; // fallback: 1 өдөр
  try {
    const decoded = jwt.decode(token) as { exp?: number };
    if (decoded?.exp) {
      const nowInSeconds = Math.floor(Date.now() / 1000);
      maxAge = decoded.exp - nowInSeconds;
    }
  } catch (err) {
    if (err instanceof Error) {
      console.warn(`Token decode failed, ${err?.message}`);
    }
    console.warn('Token decode failed, using default maxAge');
  }

  cookieStore.set(SESSION_KEY, token, {
    httpOnly: true,
    path: '/',
    maxAge,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });
}

export async function clearSession() {
  const cookieStore = await cookies();
  cookieStore.delete(SESSION_KEY);
}

export async function getSession(): Promise<{
  token: string | null;
  user: User | null;
}> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_KEY)?.value || null;

  if (!token) return { token: null, user: null };

  try {
    const res = await fetch(`${BACKEND_URL}/user/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: 'no-store', // always fresh
    });

    if (!res.ok) {
      return { token, user: null };
    }

    const user = await res.json();
    return { token, user };
  } catch (err) {
    console.error('Failed to fetch user from token', err);
    return { token, user: null };
  }
}
