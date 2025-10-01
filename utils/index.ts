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

export const queryStringBuilder = (params: Record<string, string>) => {
  const queryString = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value) {
      queryString.append(key, value);
    }
  });
  return queryString.toString();
};
