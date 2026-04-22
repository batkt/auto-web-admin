import { format } from 'date-fns';
export const generateId = () => {
  // Use a timestamp-based ID that's more predictable
  return `id_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
};

export const createImageUrl = (file: File): string => {
  return URL.createObjectURL(file);
};

export const generatePassword = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let password = '';
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

export const dateFormatter = (date: string) => {
  return format(date, 'yyyy-MM-dd HH:mm:ss');
};

export const getImageUrl = (image: string) => {
  if (!image) return '';
  if (image.startsWith('/uploads')) {
    return `${process.env.NEXT_PUBLIC_BACKEND_URL}${image}`;
  }
  return image;
};

export const getClientImageUrl = (image: string) => {
  if (!image) return '';
  if (image.startsWith('/uploads')) {
    return `${process.env.NEXT_PUBLIC_BASE_URL}${image}`;
  }
  return image;
};

export const getEmbedUrl = (raw: string): string | null => {
  const url = raw?.trim();
  if (!url) return null;

  try {
    const u = new URL(url);
    const host = u.hostname.replace(/^www\./, '');

    if (host === 'youtu.be') {
      const id = u.pathname.split('/').filter(Boolean)[0]?.split('?')[0];
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }

    if (host === 'youtube.com' || host === 'm.youtube.com' || host === 'music.youtube.com') {
      const v = u.searchParams.get('v');
      if (v) {
        const id = v.split('/')[0];
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }

      const parts = u.pathname.split('/').filter(Boolean);
      const special = parts.findIndex((p) => ['embed', 'shorts', 'live'].includes(p));
      if (special !== -1 && parts[special + 1]) {
        const id = parts[special + 1].split('?')[0];
        return id ? `https://www.youtube.com/embed/${id}` : null;
      }
    }
  } catch {
    if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
      return `https://www.youtube.com/embed/${url}`;
    }
  }

  return null;
};

export const queryStringBuilder = (params: Record<string, string>) => {
  const queryString = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      queryString.append(key, value);
    }
  });
  return queryString.toString();
};
