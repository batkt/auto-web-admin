'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SurveyFormBuilder } from '@/components/survey/survey-form-builder';
import { SurveyPreview } from '@/components/survey/survey-preview';
import { AnswerType, Group, Question, SurveyData, SurveyInput } from '@/lib/types/survey.types';
import { getSurvey } from '@/lib/services/survey.service';
import { updateSurvey } from '@/lib/actions/survey';
import { toast } from 'sonner';
// import { updateSurvey } from "@/lib/actions/survey"; // Server action; invoke from a server component or form action

const surveySchema = z.object({
  title: z.string().min(1, 'Гарчиг заавал оруулна уу'),
  description: z.string().optional(),
  groups: z.array(z.any()),
  questions: z.array(z.any()),
});

type SurveyFormData = z.infer<typeof surveySchema>;

export default function EditSurveyPage({ surveyData }: { surveyData: SurveyInput }) {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'builder' | 'preview'>('builder');
  const [loading, setLoading] = useState<boolean>(false);
  const [validationErrors, setValidationErrors] = useState<{
    questionErrors: { [key: string]: { questionText?: string; options?: string } };
    groupErrors: { [key: string]: { title?: string; questions?: string } };
    surveyErrors: { questions?: string; groups?: string };
  }>({
    questionErrors: {},
    groupErrors: {},
    surveyErrors: {},
  });

  const { register, handleSubmit, formState, setValue, watch, reset } = useForm<SurveyFormData>({
    resolver: zodResolver(surveySchema),
    defaultValues: {
      title: '',
      description: '',
      groups: [],
      questions: [],
    },
  });

  const { errors, isSubmitting, isSubmitted, isDirty } = formState;

  // Keep the UI in sync with form state so builder add/delete reflects immediately
  const watchedValues = watch();
  const liveSurveyData: SurveyInput = {
    title: (watchedValues?.title as string) || '',
    description: (watchedValues?.description as string) || '',
    groups: (watchedValues?.groups as Group[]) || [],
    questions: (watchedValues?.questions as Question[]) || [],
  };

  const setSurveyData = (data: SurveyInput) => {
    setValue('title', data.title, { shouldDirty: true });
    setValue('description', data.description, { shouldDirty: true });
    setValue('groups', data.groups, { shouldDirty: true });
    setValue('questions', data.questions, { shouldDirty: true });
  };

  useEffect(() => {
    setLoading(true);

    // Map incoming data to SurveyInput (strip _id fields if present)
    const mappedGroups: Group[] = (surveyData.groups || []).map((g: any) => ({
      title: g.title || '',
      description: g.description || '',
      order: g.order ?? 0,
      questions: (g.questions || []).map((q: any) => ({
        questionText: q.questionText || '',
        description: q.description || '',
        answerType: q.answerType || AnswerType.SHORT_TEXT,
        options: q.options || [],
        order: q.order ?? 0,
        isRequired: q.isRequired ?? true,
      })),
    }));

    const mappedQuestions: Question[] = (surveyData.questions || []).map((q: any) => ({
      questionText: q.questionText || '',
      description: q.description || '',
      answerType: q.answerType || AnswerType.SHORT_TEXT,
      options: q.options || [],
      order: q.order ?? 0,
      isRequired: q.isRequired ?? true,
    }));

    reset({
      title: surveyData.title || '',
      description: surveyData.description || '',
      groups: mappedGroups,
      questions: mappedQuestions,
    });
    setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [surveyData]);

  const getQuestionErrors = (data?: SurveyInput, forceValidate?: boolean) => {
    if (!isSubmitted && !forceValidate) {
      return {};
    }

    const surveyDataToValidate = data || liveSurveyData;

    const questionErrors: { [key: string]: { questionText?: string; options?: string } } = {};

    surveyDataToValidate.questions.forEach((question: any, index: number) => {
      const qErrors: { questionText?: string; options?: string } = {};

      if (!question.questionText || question.questionText.trim() === '') {
        qErrors.questionText = 'Асуултын текст оруулах шаардлагатай';
      }

      if (
        question.answerType === AnswerType.SINGLE_CHOICE ||
        question.answerType === AnswerType.MULTIPLE_CHOICE
      ) {
        if (!question.options || question.options.length === 0) {
          qErrors.options = 'Хамгийн багадаа 1 сонгох утга нэмэх шаардлагатай';
        } else if (question.options.some((option: string) => option.trim() === '')) {
          qErrors.options = 'Бүх сонгох утгуудыг бөглөх шаардлагатай';
        }
      }

      if (Object.keys(qErrors).length > 0) {
        questionErrors[`question_${index.toString()}`] = qErrors;
      }
    });

    surveyDataToValidate.groups.forEach((group: any, groupIndex: number) => {
      if (group.questions) {
        group.questions.forEach((question: any, questionIndex: number) => {
          const qErrors: { questionText?: string; options?: string } = {};

          if (!question.questionText || question.questionText.trim() === '') {
            qErrors.questionText = 'Асуултын текст оруулах шаардлагатай';
          }

          if (
            question.answerType === AnswerType.SINGLE_CHOICE ||
            question.answerType === AnswerType.MULTIPLE_CHOICE
          ) {
            if (!question.options || question.options.length === 0) {
              qErrors.options = 'Хамгийн багадаа 1 сонгох утга нэмэх шаардлагатай';
            } else if (question.options.some((option: string) => option.trim() === '')) {
              qErrors.options = 'Бүх сонгох утгуудыг бөглөх шаардлагатай';
            }
          }

          if (Object.keys(qErrors).length > 0) {
            questionErrors[`group_${groupIndex.toString()}_question_${questionIndex.toString()}`] =
              qErrors;
          }
        });
      }
    });

    return questionErrors;
  };

  const getGroupErrors = (data?: SurveyInput, forceValidate?: boolean) => {
    if (!isSubmitted && !forceValidate) {
      return {};
    }

    const surveyDataToValidate = data || liveSurveyData;
    const groupErrors: { [key: string]: { title?: string; questions?: string } } = {};

    surveyDataToValidate.groups.forEach((group: any, groupIndex: number) => {
      const gErrors: { title?: string; questions?: string } = {};

      if (!group.title || group.title.trim() === '') {
        gErrors.title = 'Бүлгийн гарчиг оруулах шаардлагатай';
      }

      if (!group.questions || group.questions.length === 0) {
        gErrors.questions = 'Бүлэгт хамгийн багадаа 1 асуулт нэмэх шаардлагатай';
      }

      if (Object.keys(gErrors).length > 0) {
        groupErrors[`group_${groupIndex.toString()}`] = gErrors;
      }
    });

    return groupErrors;
  };

  const getSurveyErrors = (data?: SurveyInput, forceValidate?: boolean) => {
    if (!isSubmitted && !forceValidate) {
      return {};
    }

    const surveyDataToValidate = data || liveSurveyData;
    const sErrors: { questions?: string; groups?: string } = {};

    if (surveyDataToValidate.questions.length === 0 && surveyDataToValidate.groups.length === 0) {
      sErrors.questions = 'Хамгийн багадаа 1 асуулт эсвэл 1 групп нэмэх шаардлагатай';
    }

    return sErrors;
  };

  const onSubmit = async (data: SurveyFormData) => {
    const surveyDataToValidate: SurveyInput = {
      title: data.title,
      description: data.description,
      groups: data.groups as Group[],
      questions: data.questions as Question[],
    };

    const questionErrors = getQuestionErrors(surveyDataToValidate, true);
    const groupErrors = getGroupErrors(surveyDataToValidate, true);
    const surveyErrors = getSurveyErrors(surveyDataToValidate, true);

    const hasQuestionErrors = Object.keys(questionErrors).length > 0;
    const hasGroupErrors = Object.keys(groupErrors).length > 0;
    const hasSurveyErrors = Object.keys(surveyErrors).length > 0;

    if (hasQuestionErrors || hasGroupErrors || hasSurveyErrors) {
      setValidationErrors({ questionErrors, groupErrors, surveyErrors });
      return;
    }

    setValidationErrors({ questionErrors: {}, groupErrors: {}, surveyErrors: {} });

    try {
      const response = await updateSurvey(params.id as string, surveyDataToValidate);
      if (response.code === 200) {
        toast.success('Судалгаа амжилттай хадгалагдлаа');
        router.push(`/survey/list`);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Алдаа гарлаа';
      toast.error(message);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Судалгаа засах</h1>
          <p className="text-muted-foreground text-sm">Судалгааны асуултыг засварлах</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'builder' ? 'default' : 'outline'}
            onClick={() => setActiveTab('builder')}
            size="sm"
          >
            Засах
          </Button>
          <Button
            variant={activeTab === 'preview' ? 'default' : 'outline'}
            onClick={() => setActiveTab('preview')}
            size="sm"
          >
            Харах
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="border rounded-md p-6 text-sm text-muted-foreground">Ачааллаж байна...</div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="border rounded-md p-4 space-y-8">
            <div className="space-y-4">
              {activeTab === 'builder' ? (
                <div>
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium">Судалгааны мэдээлэл</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-sm">Гарчиг</Label>
                        <Input
                          placeholder="Судалгааны гарчиг оруулна уу."
                          {...register('title')}
                          className="h-9"
                        />
                        {isSubmitted && errors.title && (
                          <p className="text-sm text-red-500">{errors.title.message as string}</p>
                        )}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm">Тайлбар (Заавал биш)</Label>
                      <Textarea
                        placeholder="Судалгааны тайлбар оруулна уу."
                        {...register('description')}
                        rows={2}
                        className="text-sm"
                      />
                      {isSubmitted && errors.description && (
                        <p className="text-sm text-red-500">
                          {errors.description.message as string}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mb-4 mt-8">
                    <h3 className="text-lg font-medium">Асуултууд</h3>
                  </div>

                  <SurveyFormBuilder
                    surveyData={liveSurveyData}
                    setSurveyData={setSurveyData}
                    questionErrors={validationErrors.questionErrors}
                    errors={errors}
                    groupErrors={validationErrors.groupErrors}
                    surveyErrors={validationErrors.surveyErrors}
                  />
                </div>
              ) : (
                <SurveyPreview surveyData={liveSurveyData} />
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" size="lg" className="px-6" disabled={isSubmitting || !isDirty}>
              {isSubmitting ? 'Хадгалж байна...' : 'Хадгалах'}
            </Button>
          </div>
        </form>
      )}
    </div>
  );
}
