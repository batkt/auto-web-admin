import { getSurvey } from '@/lib/services/survey.service';
import EditSurveyPage from '@/components/survey/survey-edit-form';
import React from 'react';
import { notFound } from 'next/navigation';

const SurveyEditPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const survey = await getSurvey(id);

  if (!survey) {
    return notFound();
  }

  return <EditSurveyPage surveyData={survey} />;
};

export default SurveyEditPage;
