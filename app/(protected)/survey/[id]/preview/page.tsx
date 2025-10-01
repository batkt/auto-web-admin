import { SurveyPreview } from '@/components/survey';
import { getSurvey } from '@/lib/services/survey.service';
import { SurveyInput } from '@/lib/types/survey.types';
import React from 'react';

const SurveyPreviewPage = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;
  const survey = await getSurvey(id);
  return (
    <div className="container mx-auto p-4 space-y-4">
      <div>
        <SurveyPreview surveyData={survey as SurveyInput} />
      </div>
    </div>
  );
};

export default SurveyPreviewPage;
