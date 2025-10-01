import {
  AnswerType,
  Group,
  Question,
  QuestionWithId,
  SurveyData,
  SurveyDataWithId,
  SurveyResponse,
} from '@/lib/types/survey.types';
import React from 'react';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { cn } from '@/lib/utils';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Checkbox } from '../ui/checkbox';
import { format } from 'date-fns';

interface SurveyAnswerPreviewProps {
  surveyData: SurveyDataWithId;
  response: SurveyResponse | null;
}

const SurveyAnswerPreview = ({ surveyData, response }: SurveyAnswerPreviewProps) => {
  const getAllItems = () => {
    const items: Array<{ type: 'question' | 'group'; data: Question | Group; index: number }> = [];

    // Add questions
    surveyData.questions.forEach((question, index) => {
      items.push({ type: 'question', data: question, index });
    });

    // Add groups
    surveyData.groups.forEach((group, index) => {
      items.push({ type: 'group', data: group, index: surveyData.questions.length + index });
    });

    // Sort by order
    return items.sort((a, b) => a.data.order - b.data.order);
  };

  const renderQuestion = (
    question: QuestionWithId,
    questionIndex: number,
    groupNumber?: number
  ) => {
    const questionKey = question._id;
    const value = response?.answers?.find(answer => answer.questionId === questionKey)?.value || '';

    console.log(questionKey, value);
    // item all readonly
    return (
      <div key={questionKey} className="space-y-2">
        <div className="space-y-2">
          <Label className="text-base font-medium">
            {groupNumber ? `${groupNumber}.` : ''}
            {questionIndex + 1}. {question.questionText}
            {question.isRequired && <span className="text-red-500 ml-1">*</span>}
          </Label>
          {question.description && (
            <p className="text-sm text-muted-foreground">{question.description}</p>
          )}
        </div>

        <div className="space-y-2 ml-8">
          {question.answerType === AnswerType.SHORT_TEXT && (
            <Input placeholder="Хариултаа бичнэ үү" value={value} disabled />
          )}

          {question.answerType === AnswerType.LONG_TEXT && (
            <Textarea placeholder="Хариултаа бичнэ үү" value={value} disabled rows={4} />
          )}

          {question.answerType === AnswerType.NUMBER && (
            <Input type="number" placeholder="Тоо оруулна уу" value={value} disabled />
          )}

          {question.answerType === AnswerType.DATE && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !value && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {value
                    ? format(new Date(value as string), 'yyyy-MM-dd')
                    : 'Утга оруулаагүй байна'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={value ? new Date(value as string) : undefined}
                  disabled={true}
                />
              </PopoverContent>
            </Popover>
          )}

          {question.answerType === AnswerType.SINGLE_CHOICE && question.options && (
            <RadioGroup value={value as string} disabled>
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center space-x-2">
                  <RadioGroupItem value={option} id={`${questionKey}-${optionIndex}`} />
                  <Label htmlFor={`${questionKey}-${optionIndex}`}>{option}</Label>
                </div>
              ))}
            </RadioGroup>
          )}

          {question.answerType === AnswerType.MULTIPLE_CHOICE && question.options && (
            <div className="space-y-2">
              {question.options.map((option, optionIndex) => (
                <div key={optionIndex} className="flex items-center space-x-2">
                  <Checkbox
                    id={`${questionKey}-${optionIndex}`}
                    checked={Array.isArray(value) && value.includes(option)}
                    disabled
                  />
                  <Label htmlFor={`${questionKey}-${optionIndex}`}>{option}</Label>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Survey Header */}
      <div>
        <h1 className="text-2xl font-bold">{surveyData.title || 'Гарчиггүй судалгаа'}</h1>
        {surveyData.description && (
          <p className="text-muted-foreground">{surveyData.description}</p>
        )}
      </div>

      {/* Unified Questions and Groups List */}
      {getAllItems().length > 0 ? (
        <div className="space-y-4">
          {getAllItems().map((item, index) => (
            <div key={`${item.type}-${item.index}`} className="relative">
              {item.type === 'question' ? (
                <div>{renderQuestion(item.data as QuestionWithId, index)}</div>
              ) : (
                <div className="mt-6">
                  <div className="mb-4">
                    <h4 className="font-medium">
                      {index + 1}. {(item.data as Group).title || `Бүлэг ${index + 1}`}
                    </h4>
                    {(item.data as Group).description && (
                      <p className="text-muted-foreground text-xs">
                        {(item.data as Group).description}
                      </p>
                    )}
                  </div>
                  <div className="space-y-3">
                    {(item.data as Group).questions
                      .sort((a, b) => a.order - b.order)
                      .map((question, questionIndex) => (
                        <div key={`group-${index}-question-${questionIndex}`} className="ml-4">
                          {renderQuestion(question as QuestionWithId, questionIndex, index + 1)}
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-muted-foreground text-sm">
          <p>Судалгаанд асуулт эсвэл бүлэг нэмээгүй байна.</p>
          <p>Асуулт болон бүлгүүдийг нэмэхийн тулд Үүсгэх таб руу шилжинэ үү.</p>
        </div>
      )}
    </div>
  );
};

export default SurveyAnswerPreview;
