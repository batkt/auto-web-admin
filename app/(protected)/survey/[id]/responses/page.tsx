import React from 'react';
import {
  getSurveyResponses,
  getActiveSurvey,
  getSurveyVersions,
} from '@/lib/services/survey.service';
import { SurveyResponses } from '@/components/survey/survey-responses';
import { SurveyDataWithId } from '@/lib/types/survey.types';
import { queryStringBuilder } from '@/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText } from 'lucide-react';

interface SurveyResponsesPageProps {
  searchParams: Promise<{
    page: string;
    version: string;
    search: string;
  }>;
  params: Promise<{
    id: string;
  }>;
}

const SurveyResponsesPage = async ({ params, searchParams }: SurveyResponsesPageProps) => {
  try {
    const { page, version, search } = await searchParams;
    const { id } = await params;
    const query = queryStringBuilder({
      page: page,
      limit: '10',
      version: version,
      search: search,
    });
    const responses = await getSurveyResponses(id, query);
    const survey = (await getActiveSurvey(id)) as SurveyDataWithId;
    const versionsData = await getSurveyVersions(id);

    return (
      <div className="p-6">
        <div className="space-y-8">
          {/* Pages List */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-md flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-semibold">Судалгааны хариултууд</CardTitle>
                    <CardDescription>Судалгааны бүх хариултыг харах</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-8">
              <SurveyResponses
                surveyData={survey}
                data={responses}
                filter={{ version, search }}
                versionData={versionsData}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Error fetching survey data:', error);

    return (
      <div className="p-6">
        <div className="space-y-8">
          {/* Pages List */}
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="size-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-md flex items-center justify-center">
                    <FileText className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-xl font-semibold">Судалгааны хариултууд</CardTitle>
                    <CardDescription>Судалгааны бүх хариултыг харах</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="px-6 pb-8">
              <div>
                <div className="text-center py-8 text-muted-foreground">
                  <p>Хариултуудыг ачаалж чадсангүй.</p>
                  <p>Дахин оролдоно уу.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }
};

export default SurveyResponsesPage;
