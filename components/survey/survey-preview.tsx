'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Question, Group, SurveyInput, AnswerType } from '@/lib/types/survey.types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';

interface SurveyPreviewProps {
  surveyData: SurveyInput;
}

export function SurveyPreview({ surveyData }: SurveyPreviewProps) {
  const [responses, setResponses] = useState<Record<string, any>>({});
  const [selectedDate, setSelectedDate] = useState<Date>();

  const handleResponseChange = (questionKey: string, value: any) => {
    setResponses(prev => ({
      ...prev,
      [questionKey]: value,
    }));
  };

  const renderQuestion = (question: Question, questionIndex: number, groupNumber?: number) => {
    const questionKey = groupNumber
      ? `group_${groupNumber}_question_${questionIndex}`
      : `question_${questionIndex}`;
    const currentValue = responses[questionKey];

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
            <Input
              placeholder="Хариултаа бичнэ үү"
              value={currentValue || ''}
              onChange={e => handleResponseChange(questionKey, e.target.value)}
            />
          )}

          {question.answerType === AnswerType.LONG_TEXT && (
            <Textarea
              placeholder="Хариултаа бичнэ үү"
              value={currentValue || ''}
              onChange={e => handleResponseChange(questionKey, e.target.value)}
              rows={4}
            />
          )}

          {question.answerType === AnswerType.NUMBER && (
            <Input
              type="number"
              placeholder="Тоо оруулна уу"
              value={currentValue || ''}
              onChange={e => handleResponseChange(questionKey, e.target.value)}
            />
          )}

          {question.answerType === AnswerType.DATE && (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    'w-full justify-start text-left font-normal',
                    !selectedDate && 'text-muted-foreground'
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {selectedDate ? format(selectedDate, 'PPP') : 'Огноо сонгоно уу'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={date => {
                    setSelectedDate(date);
                    handleResponseChange(questionKey, date);
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          )}

          {question.answerType === AnswerType.SINGLE_CHOICE && question.options && (
            <RadioGroup
              value={currentValue || ''}
              onValueChange={value => handleResponseChange(questionKey, value)}
            >
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
                    checked={Array.isArray(currentValue) && currentValue.includes(option)}
                    onCheckedChange={checked => {
                      const currentArray = Array.isArray(currentValue) ? currentValue : [];
                      const newArray = checked
                        ? [...currentArray, option]
                        : currentArray.filter(item => item !== option);
                      handleResponseChange(questionKey, newArray);
                    }}
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

  const allQuestions = [
    ...surveyData.questions,
    ...surveyData.groups.flatMap(group => group.questions),
  ].sort((a, b) => a.order - b.order);

  // Combine questions and groups into a single ordered list for preview
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

  return (
    <div className="p-6">
      <div className="space-y-8">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="size-10 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-md flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <CardTitle className="text-xl font-semibold">Судалгааны харагдац</CardTitle>
                <CardDescription className="text-sm text-muted-foreground">
                  Судалгааны асуултууд судалгаа өгөх үеийн харагдах байдал
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 p-4 border rounded-md max-w-5xl mx-auto">
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
                        <div>{renderQuestion(item.data as Question, index)}</div>
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
                                <div
                                  key={`group-${index}-question-${questionIndex}`}
                                  className="ml-4"
                                >
                                  {renderQuestion(question, questionIndex, index + 1)}
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

              {/* Submit Button */}
              {getAllItems().length > 0 && (
                <div className="flex justify-end pt-4">
                  <Button size="lg" className="px-6">
                    Судалгаа илгээх
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
