import SurveyList from '@/components/survey/survey-list';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getSurveys } from '@/lib/services/survey.service';
import { queryStringBuilder } from '@/utils';
import { FileText, Plus } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const SurveyListPage = async ({
  searchParams,
}: {
  searchParams: Promise<{
    page: string;
    status: string;
    search: string;
  }>;
}) => {
  const { page, status, search } = await searchParams;

  const query = queryStringBuilder({
    page: page,
    status: status,
    search: search,
  });
  const data = await getSurveys(query);

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
                  <CardTitle className="text-xl font-semibold">Судалгаануудын жагсаалт</CardTitle>
                  <CardDescription>Бүх судалгаануудыг харах</CardDescription>
                </div>
              </div>
              <Link href="/survey/create">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Судалгаа үүсгэх
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent className="px-6 pb-8">
            <SurveyList data={data} filter={{ page, status, search }} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SurveyListPage;
