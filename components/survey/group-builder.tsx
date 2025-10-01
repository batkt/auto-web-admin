'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Plus, Trash2, ChevronDown, ChevronRight } from 'lucide-react';
import { QuestionBuilder } from './question-builder';
import { Question, Group, AnswerType } from '@/lib/types/survey.types';

interface GroupBuilderProps {
  group: Group;
  index: number; // This is the original array index
  onUpdate: (updatedGroup: Partial<Group>) => void;
  onDelete: () => void;
  onQuestionUpdate: (questionIndex: number, updatedQuestion: Partial<Question>) => void;
  onQuestionDelete: (questionIndex: number) => void;
  questionErrors?: { [key: string]: { questionText?: string; options?: string } };
  errors?: { title?: string; questions?: string };
}

export function GroupBuilder({
  group,
  index, // This is the original array index
  onUpdate,
  onDelete,
  onQuestionUpdate,
  onQuestionDelete,
  questionErrors = {},
  errors,
}: GroupBuilderProps) {
  const [isOpen, setIsOpen] = useState(true);

  const addQuestionToGroup = () => {
    const newQuestion: Question = {
      questionText: '',
      description: '',
      answerType: AnswerType.SHORT_TEXT,
      options: [],
      order: group.questions.length + 1,
      isRequired: true,
    };

    onUpdate({
      questions: [...group.questions, newQuestion],
    });
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Collapsible open={isOpen} onOpenChange={setIsOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="icon">
                {isOpen ? (
                  <ChevronDown className="w-3 h-3" />
                ) : (
                  <ChevronRight className="w-3 h-3" />
                )}
              </Button>
            </CollapsibleTrigger>
          </Collapsible>
          <Badge variant="outline" className="text-xs border-primary bg-primary/10">
            Бүлэг №{group.order}
          </Badge>
          <Badge variant="secondary" className="text-xs">
            {group.questions.length} асуулт
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="outline" size="icon" onClick={onDelete} className="text-destructive">
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleContent className="space-y-3">
          <div>
            <Label className="text-xs mb-2">Бүлгийн гарчиг</Label>
            <Input
              placeholder="Бүлгийн гарчиг оруулна уу."
              value={group.title}
              onChange={e => onUpdate({ title: e.target.value })}
              className={`h-9 text-sm ${errors?.title ? 'border-red-500' : ''}`}
            />
            {errors?.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
          </div>

          <div>
            <Label className="text-xs mb-2">Тайлбар (Заавал биш)</Label>
            <Textarea
              placeholder="Бүлгийн тайлбар оруулна уу."
              value={group.description || ''}
              onChange={e => onUpdate({ description: e.target.value })}
              rows={3}
              className="text-sm"
            />
          </div>

          <div className="space-y-2 mt-6">
            <div className="flex justify-between items-center">
              <Label className="text-lg font-medium">Асуултууд</Label>
              <Button onClick={addQuestionToGroup} size="sm" variant="outline" className="px-2">
                <Plus className="w-3 h-3 mr-1" />
                Асуулт нэмэх
              </Button>
            </div>

            {group.questions.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground text-sm border-2 border-dashed rounded-lg">
                <p>Асуулт байхгүй байна.</p>
              </div>
            ) : (
              <div className="space-y-6 border rounded-md p-4">
                {group.questions.map((question, questionIndex) => (
                  <div key={`group-${index}-question-${questionIndex}`}>
                    <QuestionBuilder
                      question={question}
                      groupOrder={group.order}
                      onUpdate={updatedQuestion => onQuestionUpdate(questionIndex, updatedQuestion)}
                      onDelete={() => onQuestionDelete(questionIndex)}
                      errors={
                        questionErrors[
                          `group_${index.toString()}_question_${questionIndex.toString()}`
                        ]
                      }
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Group questions error display */}
            {errors?.questions && (
              <div className="p-2 border border-red-200 rounded-md bg-red-50">
                <p className="text-xs text-red-700">{errors.questions}</p>
              </div>
            )}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </div>
  );
}
