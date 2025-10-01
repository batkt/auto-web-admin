import { httpClient } from '../http-client';
import { SurveyData, SurveyResponse } from '../types/survey.types';

export const getSurveyResponses = async (surveyId: string, query: string) => {
  const response = await httpClient.get<{
    data: SurveyResponse[];
    total: number;
    totalPages: number;
    currentPage: number;
  }>(`/surveys/${surveyId}/responses?${query}`);
  return response.data;
};

export const getSurvey = async (surveyId: string) => {
  const response = await httpClient.get<SurveyData>(`/surveys/${surveyId}`);
  return response.data;
};

export const getActiveSurvey = async (surveyId: string) => {
  const response = await httpClient.get<SurveyData>(`/surveys/${surveyId}/active`);
  return response.data;
};

export const getSurveys = async (query?: string) => {
  const response = await httpClient.get<{
    data: SurveyData[];
    total: number;
    totalPages: number;
    currentPage: number;
  }>(`/surveys${query ? `?${query}` : ''}`);
  return response.data;
};

export const getSurveyVersions = async (surveyId: string) => {
  const response = await httpClient.get<
    {
      _id: string;
      version: number;
      createdAt: string;
    }[]
  >(`/surveys/${surveyId}/versions`);
  return response.data;
};
