'use client';

import { useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Search, MoreHorizontal, Eye, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { SurveyResponse, SurveyDataWithId } from '@/lib/types/survey.types';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import SurveyAnswerPreview from './survey-answer-preview';
import { dateFormatter, queryStringBuilder } from '@/utils';
import { useRouter } from 'next/navigation';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

interface SurveyResponsesProps {
  surveyData: SurveyDataWithId;
  data?: {
    data: SurveyResponse[];
    total: number;
    totalPages: number;
    currentPage: number;
  };
  filter: {
    version: string;
    search: string;
  };
  versionData: {
    _id: string;
    version: number;
    createdAt: string;
  }[];
}

export function SurveyResponses({ surveyData, data, filter, versionData }: SurveyResponsesProps) {
  const initialResponses = data?.data || [];
  const [searchTerm, setSearchTerm] = useState(filter?.search || '');
  const [selectedResponse, setSelectedResponse] = useState<SurveyResponse | null>(null);
  const router = useRouter();
  const searchRef = useRef<NodeJS.Timeout | null>(null);

  if (!data) return null;

  // const exportResponses = () => {
  //   const csvContent = [
  //     ['Response ID', 'Email', 'IP', 'Date', ...questions.map(q => q.questionText)],
  //     ...filteredResponses.map(response => [
  //       response._id,
  //       response.respondentInfo?.email || '',
  //       response.respondentInfo?.ip || '',
  //       new Date(response.createdAt).toLocaleDateString(),
  //       ...questions.map((question, questionIndex) => {
  //         const answer = response.answers.find(a => a.questionIndex === questionIndex);
  //         return answer ? getAnswerDisplay(answer) : '';
  //       }),
  //     ]),
  //   ]
  //     .map(row => row.map(cell => `"${cell}"`).join(','))
  //     .join('\n');

  //   const blob = new Blob([csvContent], { type: 'text/csv' });
  //   const url = window.URL.createObjectURL(blob);
  //   const a = document.createElement('a');
  //   a.href = url;
  //   a.download = `survey-responses-${surveyId}.csv`;
  //   document.body.appendChild(a);
  //   a.click();
  //   document.body.removeChild(a);
  //   window.URL.revokeObjectURL(url);
  // };

  // const handleDeleteResponse = async (responseId: string) => {
  //   try {
  //     const response = await fetch(`/api/surveys/${surveyData?._id}/responses/${responseId}`, {
  //       method: 'DELETE',
  //     });

  //     if (response.ok) {
  //       setResponses(prev => prev.filter(r => r._id !== responseId));
  //     }
  //   } catch (error) {
  //     console.error('Error deleting response:', error);
  //   }
  // };

  const debouncedSearch = (value: string) => {
    setSearchTerm(value);
    if (searchRef.current) {
      clearTimeout(searchRef.current);
    }
    searchRef.current = setTimeout(() => {
      const queryString = queryStringBuilder({
        search: value,
        version: filter?.version || '',
        page: '1',
      });
      router.push(`/survey/list${queryString ? `?${queryString}` : ''}`);
    }, 500);
  };

  const handleChangeVersion = (version: string) => {
    const query = queryStringBuilder({
      page: '1',
      limit: '10',
      search: searchTerm,
      version: version,
    });
    router.push(`/survey/${surveyData._id}/responses?${query}`);
  };

  const handleChangePage = (page: number) => {
    const query = queryStringBuilder({
      page: page.toString(),
      limit: '10',
      ...filter,
    });
    router.push(`/survey/${surveyData._id}/responses?${query}`);
  };

  // if (loading) {
  //   return (
  //     <div className="space-y-4">
  //       <div className="flex items-center justify-between">
  //         <div>
  //           <h2 className="text-2xl font-bold">Судалгааны хариултууд</h2>
  //           <p className="text-muted-foreground">Хариултуудыг ачаалж байна...</p>
  //         </div>
  //       </div>
  //       <div className="border border-gray-200 rounded-md p-4">
  //         <div className="text-center py-8 text-muted-foreground">
  //           <p>Хариултуудыг ачаалж байна...</p>
  //         </div>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="space-y-4">
      {/* <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Судалгааны хариултууд</h2>
          <p className="text-muted-foreground">{filteredResponses.length} хариулт</p>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={exportResponses} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            CSV татах
          </Button>
        </div>
      </div> */}

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="И-мэйл эсвэл IP-р хайх..."
            value={searchTerm}
            onChange={e => debouncedSearch(e.target.value)}
            className="pl-8"
          />
        </div>
        <Select value={filter?.version || ''} onValueChange={value => handleChangeVersion(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Судалгааны хувилбар" />
          </SelectTrigger>
          <SelectContent>
            {versionData.map(version => (
              <SelectItem key={version._id} value={version.version.toString()}>
                v{version.version}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {data?.data?.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            {filter?.search || filter?.version
              ? 'Хайлтад тохирох мэдээлэл олдсонгүй.'
              : 'Хариулт олдсонгүй.'}
          </div>
        </div>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Хариултын ID</TableHead>
                <TableHead>Судалгааны хувилбар</TableHead>
                <TableHead>И-мэйл</TableHead>
                <TableHead>IP</TableHead>
                <TableHead>Огноо</TableHead>
                <TableHead className="text-right">Үйлдэл</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {initialResponses.map(response => (
                <TableRow key={response._id}>
                  <TableCell className="font-mono text-sm">{response._id}</TableCell>
                  <TableCell className="font-mono text-sm">{`v${response.version}`}</TableCell>
                  <TableCell>{response.respondentInfo?.email || '-'}</TableCell>
                  <TableCell>{response?.ipAddress || '-'}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      {dateFormatter(response.createdAt)}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => setSelectedResponse(response)}>
                          <Eye className="w-4 h-4 mr-2" />
                          Дэлгэрэнгүй харах
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-end items-center gap-2 mt-4">
            <div className="flex items-center gap-2">
              <span className="text-sm">
                Нийт: <b>{data.total}</b>
              </span>
            </div>
            <Button
              variant="outline"
              size="icon"
              disabled={data.currentPage <= 1}
              onClick={() => handleChangePage(data.currentPage - 1)}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                {data.currentPage} / {data.totalPages}
              </span>
            </div>

            <Button
              variant="outline"
              size="icon"
              disabled={data.currentPage >= data.totalPages}
              onClick={() => handleChangePage(data.currentPage + 1)}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </>
      )}

      {/* Response Details Modal */}
      {/* {selectedResponse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Хариултын дэлгэрэнгүй</h3>
              <Button variant="ghost" size="sm" onClick={() => setSelectedResponse(null)}>
                ×
              </Button>
            </div>

            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Хариултын ID</Label>
                <p className="text-sm text-muted-foreground font-mono">{selectedResponse._id}</p>
              </div>

              <div>
                <Label className="text-sm font-medium">И-мэйл</Label>
                <p className="text-sm text-muted-foreground">
                  {selectedResponse.respondentInfo?.email || 'Оруулаагүй'}
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium">IP хаяг</Label>
                <p className="text-sm text-muted-foreground">
                  {selectedResponse.respondentInfo?.ip || 'Оруулаагүй'}
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium">Огноо</Label>
                <p className="text-sm text-muted-foreground">
                  {new Date(selectedResponse.createdAt).toLocaleString()}
                </p>
              </div>

              <Separator />

              <div>
                <Label className="text-sm font-medium">Хариултууд</Label>
                <div className="space-y-4 mt-2">
                  {questions.map((question, questionIndex) => {
                    const answer = selectedResponse.answers.find(
                      a => a.questionIndex === questionIndex
                    );
                    return (
                      <div key={questionIndex} className="space-y-2">
                        <div className="font-medium text-sm">{question.questionText}</div>
                        <div className="text-sm text-muted-foreground">
                          {answer ? getAnswerDisplay(answer) : 'Хариулт оруулаагүй'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )} */}
      <Dialog
        open={!!selectedResponse}
        onOpenChange={e => {
          if (e === false) {
            setSelectedResponse(null);
          }
        }}
      >
        <DialogContent className="!max-w-3xl w-full">
          <DialogHeader>
            <DialogTitle>Дэлгэрэнгүй хариулт</DialogTitle>
          </DialogHeader>
          <div className="max-h-[80vh] pe-6 overflow-y-auto">
            <SurveyAnswerPreview surveyData={surveyData} response={selectedResponse} />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
