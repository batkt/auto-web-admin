import { BACKEND_URL } from './config';
import { ResponseType } from './types/http.types';

async function safeParseJSON(response: Response) {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

const createHeaders = (token?: string, customHeaders?: HeadersInit): HeadersInit => {
  return {
    ...(customHeaders || {}),
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

const handleResponse = async (response: Response): Promise<any> => {
  if (!response.ok) {
    const error = await safeParseJSON(response);
    const errorMessage = error?.message || `HTTP ${response.status}: ${response.statusText}`;
    throw new Error(errorMessage);
  }

  return await safeParseJSON(response);
};

const getRequest = async <T>(
  url: string,
  token?: string,
  options?: RequestInit
): Promise<ResponseType<T>> => {
  const { headers, ...otherOptions } = options || {};
  const response = await fetch(`${BACKEND_URL}/api${url}`, {
    ...otherOptions,
    headers: createHeaders(token, headers),
    method: 'GET',
  });

  return handleResponse(response);
};

const postRequest = async <T>(
  url: string,
  body: any,
  token?: string,
  options?: RequestInit
): Promise<ResponseType<T>> => {
  const { headers, ...otherOptions } = options || {};

  // Check if body is FormData
  const isFormData = body instanceof FormData;

  const requestHeaders = createHeaders(token, headers);

  // Only set Content-Type for JSON requests
  if (!isFormData) {
    (requestHeaders as Record<string, string>)['Content-Type'] = 'application/json';
  }

  console.log('########################## ', BACKEND_URL);
  const response = await fetch(`${BACKEND_URL}/api${url}`, {
    ...otherOptions,
    headers: requestHeaders,
    method: 'POST',
    body: isFormData ? body : JSON.stringify(body),
  });

  return handleResponse(response);
};

const putRequest = async <T>(
  url: string,
  body: any,
  token?: string,
  options?: RequestInit
): Promise<ResponseType<T>> => {
  const { headers, ...otherOptions } = options || {};

  // Check if body is FormData
  const isFormData = body instanceof FormData;

  const requestHeaders = createHeaders(token, headers);

  // Only set Content-Type for JSON requests
  if (!isFormData) {
    (requestHeaders as Record<string, string>)['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${BACKEND_URL}/api${url}`, {
    ...otherOptions,
    headers: requestHeaders,
    method: 'PUT',
    body: isFormData ? body : JSON.stringify(body),
  });

  return handleResponse(response);
};

const patchRequest = async <T>(
  url: string,
  body: any,
  token?: string,
  options?: RequestInit
): Promise<ResponseType<T>> => {
  const { headers, ...otherOptions } = options || {};

  const response = await fetch(`${BACKEND_URL}/api${url}`, {
    ...otherOptions,
    headers: createHeaders(token, headers),
    method: 'PATCH',
    body: JSON.stringify(body),
  });

  return handleResponse(response);
};

const deleteRequest = async <T>(
  url: string,
  token?: string,
  options?: RequestInit
): Promise<ResponseType<T>> => {
  const { headers, ...otherOptions } = options || {};

  const response = await fetch(`${BACKEND_URL}/api${url}`, {
    ...otherOptions,
    headers: createHeaders(token, headers),
    method: 'DELETE',
  });

  return handleResponse(response);
};

export const httpClient = {
  get: getRequest,
  post: postRequest,
  put: putRequest,
  patch: patchRequest,
  delete: deleteRequest,
};
