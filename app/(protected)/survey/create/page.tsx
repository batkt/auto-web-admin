'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { SurveyFormBuilder } from '@/components/survey/survey-form-builder';
import { SurveyPreview } from '@/components/survey/survey-preview';
import { SurveyInput, AnswerType } from '@/lib/types/survey.types';
import { createSurvey } from '@/lib/actions/survey';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const surveySchema = z.object({
  title: z.string().min(1, 'Гарчиг заавал оруулна уу'),
  description: z.string().optional(),
  groups: z.array(z.any()),
  questions: z.array(z.any()),
});

type SurveyFormData = z.infer<typeof surveySchema>;

export default function CreateSurveyPage() {
  const [activeTab, setActiveTab] = useState<'builder' | 'preview'>('builder');
  const [validationErrors, setValidationErrors] = useState<{
    questionErrors: { [key: string]: { questionText?: string; options?: string } };
    groupErrors: { [key: string]: { title?: string; questions?: string } };
    surveyErrors: { questions?: string; groups?: string };
  }>({
    questionErrors: {},
    groupErrors: {},
    surveyErrors: {},
  });

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitted },
    setValue,
    watch,
    reset,
  } = useForm<SurveyFormData>({
    resolver: zodResolver(surveySchema),
    defaultValues: {
      title: '',
      description: '',
      groups: [],
      questions: [],
    },
  });

  const watchedValues = watch();

  const surveyData: SurveyInput = {
    title: watchedValues.title || '',
    description: watchedValues.description || '',
    groups: watchedValues.groups || [],
    questions: watchedValues.questions || [],
  };

  const setSurveyData = (data: SurveyInput) => {
    setValue('title', data.title);
    setValue('description', data.description);
    setValue('groups', data.groups);
    setValue('questions', data.questions);
  };

  const getQuestionErrors = (data?: SurveyInput, forceValidate?: boolean) => {
    if (!isSubmitted && !forceValidate) {
      return {};
    }

    const surveyDataToValidate = data || surveyData;
    const questionErrors: { [key: string]: { questionText?: string; options?: string } } = {};

    surveyDataToValidate.questions.forEach((question: any, index: number) => {
      const errors: { questionText?: string; options?: string } = {};

      if (!question.questionText || question.questionText.trim() === '') {
        errors.questionText = 'Асуултын текст оруулах шаардлагатай';
      }

      if (
        question.answerType === AnswerType.SINGLE_CHOICE ||
        question.answerType === AnswerType.MULTIPLE_CHOICE
      ) {
        if (!question.options || question.options.length === 0) {
          errors.options = 'Хамгийн багадаа 1 сонгох утга нэмэх шаардлагатай';
        } else if (question.options.some((option: string) => option.trim() === '')) {
          errors.options = 'Бүх сонгох утгуудыг бөглөх шаардлагатай';
        }
      }

      if (Object.keys(errors).length > 0) {
        questionErrors[`question_${index.toString()}`] = errors;
      }
    });

    surveyDataToValidate.groups.forEach((group: any, groupIndex: number) => {
      if (group.questions) {
        group.questions.forEach((question: any, questionIndex: number) => {
          const errors: { questionText?: string; options?: string } = {};

          if (!question.questionText || question.questionText.trim() === '') {
            errors.questionText = 'Асуултын текст оруулах шаардлагатай';
          }

          if (
            question.answerType === AnswerType.SINGLE_CHOICE ||
            question.answerType === AnswerType.MULTIPLE_CHOICE
          ) {
            if (!question.options || question.options.length === 0) {
              errors.options = 'Хамгийн багадаа 1 сонгох утга нэмэх шаардлагатай';
            } else if (question.options.some((option: string) => option.trim() === '')) {
              errors.options = 'Бүх сонгох утгуудыг бөглөх шаардлагатай';
            }
          }

          if (Object.keys(errors).length > 0) {
            questionErrors[`group_${groupIndex.toString()}_question_${questionIndex.toString()}`] =
              errors;
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

    const surveyDataToValidate = data || surveyData;
    const groupErrors: { [key: string]: { title?: string; questions?: string } } = {};

    surveyDataToValidate.groups.forEach((group: any, groupIndex: number) => {
      const errors: { title?: string; questions?: string } = {};

      if (!group.title || group.title.trim() === '') {
        errors.title = 'Бүлгийн гарчиг оруулах шаардлагатай';
      }

      if (!group.questions || group.questions.length === 0) {
        errors.questions = 'Бүлэгт хамгийн багадаа 1 асуулт нэмэх шаардлагатай';
      }

      if (Object.keys(errors).length > 0) {
        groupErrors[`group_${groupIndex.toString()}`] = errors;
      }
    });

    return groupErrors;
  };

  const getSurveyErrors = (data?: SurveyInput, forceValidate?: boolean) => {
    if (!isSubmitted && !forceValidate) {
      return {};
    }

    const surveyDataToValidate = data || surveyData;
    const surveyErrors: { questions?: string; groups?: string } = {};

    if (surveyDataToValidate.questions.length === 0 && surveyDataToValidate.groups.length === 0) {
      surveyErrors.questions = 'Хамгийн багадаа 1 асуулт эсвэл 1 групп нэмэх шаардлагатай';
    }

    return surveyErrors;
  };

  const onSubmit = async (data: SurveyFormData) => {
    const surveyDataToValidate: SurveyInput = {
      title: data.title,
      description: data.description,
      groups: data.groups,
      questions: data.questions,
    };

    const questionErrors = getQuestionErrors(surveyDataToValidate, true);
    const groupErrors = getGroupErrors(surveyDataToValidate, true);
    const surveyErrors = getSurveyErrors(surveyDataToValidate, true);

    const hasQuestionErrors = Object.keys(questionErrors).length > 0;
    const hasGroupErrors = Object.keys(groupErrors).length > 0;
    const hasSurveyErrors = Object.keys(surveyErrors).length > 0;

    if (hasQuestionErrors || hasGroupErrors || hasSurveyErrors) {
      setValidationErrors({
        questionErrors,
        groupErrors,
        surveyErrors,
      });
      return;
    }

    setValidationErrors({
      questionErrors: {},
      groupErrors: {},
      surveyErrors: {},
    });

    console.log('Submitting survey data:', data);

    // try {
    //   const response = await createSurvey(surveyData);

    //   if (response.code === 201) {
    //     reset();
    //     toast.success('Судалгаа амжилттай хадгалагдлаа');
    //     router.push(`/survey/list`);
    //   } else {
    //     throw new Error(response.message);
    //   }
    // } catch (error) {
    //   let message = 'Алдаа гарлаа';
    //   if (error instanceof Error) {
    //     message = error.message;
    //   }
    //   toast.error(message);
    // }
  };

  return (
    <div className="container mx-auto p-4 space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold mb-2">Судалгаа үүсгэх</h1>
          <p className="text-muted-foreground text-sm">
            Судалгааны асуултыг динамик байдлаар үүсгэх
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'builder' ? 'default' : 'outline'}
            onClick={() => setActiveTab('builder')}
            size="sm"
          >
            Үүсгэх
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="border rounded-md p-4 space-y-8">
          <div className="space-y-4">
            {activeTab === 'builder' ? (
              <div>
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Судалааны мэдээлэл</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm">Гарчиг</Label>
                      <Input
                        placeholder="Судалгааны гарчиг оруулна уу."
                        {...register('title')}
                        className="h-9"
                      />
                      {isSubmitted && errors.title && (
                        <p className="text-sm text-red-500">{errors.title.message}</p>
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
                      <p className="text-sm text-red-500">{errors.description.message}</p>
                    )}
                  </div>
                </div>

                <div className="mb-4 mt-8">
                  <h3 className="text-lg font-medium">Асуултууд</h3>
                </div>

                <SurveyFormBuilder
                  surveyData={surveyData}
                  setSurveyData={setSurveyData}
                  questionErrors={validationErrors.questionErrors}
                  errors={errors}
                  groupErrors={validationErrors.groupErrors}
                  surveyErrors={validationErrors.surveyErrors}
                />
              </div>
            ) : (
              <SurveyPreview surveyData={surveyData} />
            )}
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <Button type="submit" size="lg" className="px-6" disabled={isSubmitting}>
            {isSubmitting ? 'Хадгалж байна...' : 'Хадгалах'}
          </Button>
        </div>
      </form>
    </div>
  );
}
