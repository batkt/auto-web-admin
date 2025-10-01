'use client';
import React, { useRef } from 'react';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
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
import {
  Plus,
  Search,
  MoreHorizontal,
  Eye,
  Edit,
  Trash2,
  Copy,
  BarChart3,
  Link as LinkIcon,
  StopCircle,
  PlayCircle,
  ChartLineIcon,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import { SurveyData, SurveyStatus } from '@/lib/types/survey.types';
import { dateFormatter, queryStringBuilder } from '@/utils';
import { useRouter } from 'next/navigation';
import { duplicateSurveyAction, startSurveyAction, stopSurveyAction } from '@/lib/actions/survey';
import { toast } from 'sonner';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface SurveyListProps {
  data: {
    data: SurveyData[];
    total: number;
    totalPages: number;
    currentPage: number;
  };
  filter: {
    search?: string;
    status?: string;
    page?: string;
  };
}
const SurveyList = ({ data, filter }: SurveyListProps) => {
  const surveys = data?.data || [];
  const [searchTerm, setSearchTerm] = useState(filter?.search || '');
  const searchRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      saved: { label: 'Ноорог', variant: 'secondary' as const },
      started: { label: 'Идэвхтэй', variant: 'default' as const },
      finished: { label: 'Дууссан', variant: 'outline' as const },
      stopped: { label: 'Зогссон', variant: 'destructive' as const },
      archived: { label: 'Архивласан', variant: 'secondary' as const },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.saved;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const debouncedSearch = (value: string) => {
    setSearchTerm(value);
    if (searchRef.current) {
      clearTimeout(searchRef.current);
    }
    searchRef.current = setTimeout(() => {
      const queryString = queryStringBuilder({
        ...filter,
        search: value,
        page: '1',
      });
      router.push(`/survey/list${queryString ? `?${queryString}` : ''}`);
    }, 500);
  };

  const startSurvey = async (surveyId: string) => {
    try {
      const response = await startSurveyAction(surveyId);
      if (response.code === 200) {
        toast.success('Судалгаа идэвхжлээ');
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      let errorMessage = 'Алдаа гарлаа';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    }
  };

  const stopSurvey = async (surveyId: string) => {
    try {
      const response = await stopSurveyAction(surveyId);
    } catch (error) {
      let errorMessage = 'Алдаа гарлаа';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    }
  };

  const handleChangeStatus = (status: string) => {
    const queryString = queryStringBuilder({
      ...filter,
      status: status,
    });
    router.push(`/survey/list${queryString ? `?${queryString}` : ''}`);
  };

  const handleChangePage = (page: number) => {
    const queryString = queryStringBuilder({
      ...filter,
      page: page.toString(),
    });
    router.push(`/survey/list${queryString ? `?${queryString}` : ''}`);
  };

  const handleCopyLinkSurvey = (surveyId: string) => {
    const link = `${process.env.NEXT_PUBLIC_BASE_URL}/survey/${surveyId}`;
    navigator.clipboard.writeText(link);
    toast.success('Холбоосыг хууллаа');
  };

  const handleDeleteSurvey = async (surveyId: string) => {
    //   if (confirm('Та устгахыг оролдох үү?')) {
    //     try {
    //       const response = await fetch(`/api/surveys/${surveyId}`, {
    //         method: 'DELETE',
    //       });
    //       if (response.ok) {
    //         setSurveys(surveys.filter(survey => survey._id !== surveyId));
    //       }
    //     } catch (error) {
    //       console.error('Error deleting survey:', error);
    //     }
    //   }
  };

  const handleDuplicateSurvey = async (surveyId: string) => {
    try {
      const response = await duplicateSurveyAction(surveyId);
      if (response.code === 200) {
        toast.success('Судалгааг хуулбарлалаа');
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      let errorMessage = 'Алдаа гарлаа';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Судалгаа хайх..."
            value={searchTerm}
            onChange={e => debouncedSearch(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filter?.status || ''} onValueChange={value => handleChangeStatus(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Төлөв" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="saved">Ноорог</SelectItem>
            <SelectItem value="started">Идэвхтэй</SelectItem>
            <SelectItem value="finished">Дууссан</SelectItem>
            <SelectItem value="stopped">Зогссон</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {surveys.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            {filter?.search || filter?.status
              ? 'Хайлтад тохирох судалгаа олдсонгүй.'
              : 'Судалгаа үүсгээгүй байна.'}

            {!filter?.search && !filter?.status && (
              <Link href="/survey/create">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Судалгаа үүсгэх
                </Button>
              </Link>
            )}
          </div>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Гарчиг</TableHead>
              <TableHead>Төлөв</TableHead>
              <TableHead>Үүсгэсэн</TableHead>
              <TableHead>Шинэчилсэн</TableHead>
              <TableHead className="w-[100px] text-right">Үйлдэл</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {surveys.map(survey => (
              <TableRow key={survey._id}>
                <TableCell>
                  <div>
                    <div className="font-medium">{survey.title}</div>
                    {survey.description && (
                      <div className="text-sm text-muted-foreground truncate max-w-xs">
                        {survey.description}
                      </div>
                    )}
                  </div>
                </TableCell>
                <TableCell>{getStatusBadge(survey.status)}</TableCell>
                <TableCell>
                  <div className="text-sm text-muted-foreground">
                    {dateFormatter(survey.createdAt)}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="text-sm text-muted-foreground">
                    {dateFormatter(survey.updatedAt)}
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
                      <DropdownMenuItem asChild>
                        <Link href={`/survey/${survey._id}/preview`}>
                          <Eye className="w-4 h-4 mr-2" />
                          Харах
                        </Link>
                      </DropdownMenuItem>
                      {survey.isAnswered && (
                        <DropdownMenuItem asChild>
                          <Link href={`/survey/${survey._id}/responses`}>
                            <ChartLineIcon className="w-4 h-4 mr-2" />
                            Бөглөсөн судалгаа
                          </Link>
                        </DropdownMenuItem>
                      )}
                      {(survey.status === SurveyStatus.SAVED ||
                        survey.status === SurveyStatus.STOPPED) && (
                        <>
                          <DropdownMenuItem onClick={() => startSurvey(survey._id)}>
                            <PlayCircle className="w-4 h-4 mr-2" />
                            Идэвхжүүлэх
                          </DropdownMenuItem>

                          <DropdownMenuItem asChild>
                            <Link href={`/survey/${survey._id}/edit`}>
                              <Edit className="w-4 h-4 mr-2" />
                              Засах
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}

                      {survey.status === SurveyStatus.STARTED && (
                        <>
                          <DropdownMenuItem onClick={() => stopSurvey(survey._id)}>
                            <StopCircle className="w-4 h-4 mr-2" />
                            Зогсоох
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleCopyLinkSurvey(survey._id)}>
                            <LinkIcon className="w-4 h-4 mr-2" />
                            Холбоос хуулах
                          </DropdownMenuItem>
                        </>
                      )}

                      <DropdownMenuItem onClick={() => handleDuplicateSurvey(survey._id)}>
                        <Copy className="w-4 h-4 mr-2" />
                        Хуулж үүсгэх
                      </DropdownMenuItem>
                      {/* <DropdownMenuItem
                        onClick={() => handleDeleteSurvey(survey._id)}
                        className="text-destructive"
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Устгах
                      </DropdownMenuItem> */}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

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
    </div>
  );
};

export default SurveyList;
