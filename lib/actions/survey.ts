'use server';

import { revalidatePath } from 'next/cache';
import { ACCESS_TOKEN_KEY, getCookie } from '../cookie';
import { httpClient } from '../http-client';
import { SurveyData, SurveyInput } from '../types/survey.types';

export const createSurvey = async (survey: SurveyInput) => {
  const token = await getCookie(ACCESS_TOKEN_KEY);
  const res = await httpClient.post<{
    data: SurveyData;
  }>('/surveys', survey, token);
  return res;
};

export const updateSurvey = async (id: string, survey: Partial<SurveyInput>) => {
  const token = await getCookie(ACCESS_TOKEN_KEY);
  const res = await httpClient.put<{
    data: any;
  }>(`/surveys/${id}`, survey, token);
  revalidatePath(`/survey/list`);
  return res;
};

export const startSurveyAction = async (id: string) => {
  const token = await getCookie(ACCESS_TOKEN_KEY);
  const res = await httpClient.post<{
    data: any;
  }>(`/surveys/${id}/start`, {}, token);

  revalidatePath(`/survey/list`);
  return res;
};

export const stopSurveyAction = async (id: string) => {
  const token = await getCookie(ACCESS_TOKEN_KEY);
  const res = await httpClient.post<{
    data: any;
  }>(`/surveys/${id}/stop`, {}, token);
  return res;
};

export const duplicateSurveyAction = async (id: string) => {
  const token = await getCookie(ACCESS_TOKEN_KEY);
  const res = await httpClient.post<{
    data: any;
  }>(`/surveys/${id}/duplicate`, {}, token);
  revalidatePath(`/survey/list`);
  return res;
};
