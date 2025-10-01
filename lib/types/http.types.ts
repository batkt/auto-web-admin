export interface ResponseType<T> {
  code: number;
  data: T;
  message?: string;
}

export type RequestType<T> = (
  url: string,
  token: string,
  options?: RequestInit
) => Promise<ResponseType<T>>;
