import { httpClient } from '../http-client';

export const getUserProfile = async () => {
  return httpClient.get('/user/me');
};
