'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Trash2, X } from 'lucide-react';
import { Question, AnswerType } from '@/lib/types/survey.types';

interface QuestionBuilderProps {
  question: Question;
  onUpdate: (updatedQuestion: Partial<Question>) => void;
  onDelete: () => void;
  errors?: { questionText?: string; options?: string };
  groupOrder?: number;
}

export function QuestionBuilder({
  question,
  groupOrder,
  onUpdate,
  onDelete,
  errors,
}: QuestionBuilderProps) {
  const addOption = () => {
    const newOptions = [...(question.options || []), ''];
    onUpdate({ options: newOptions });
  };

  const updateOption = (optionIndex: number, value: string) => {
    const newOptions = [...(question.options || [])];
    newOptions[optionIndex] = value;
    onUpdate({ options: newOptions });
  };

  const removeOption = (optionIndex: number) => {
    const newOptions = (question.options || []).filter((_, index) => index !== optionIndex);
    onUpdate({ options: newOptions });
  };

  const needsOptions =
    question.answerType === AnswerType.SINGLE_CHOICE ||
    question.answerType === AnswerType.MULTIPLE_CHOICE;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-xs border-primary bg-primary/10">
            Асуулт №{groupOrder ? `${groupOrder}.` : ''}
            {question.order}
          </Badge>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={onDelete}
            className="px-2 text-destructive"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <div>
        <Label className="text-xs mb-2">Асуулт</Label>
        <Input
          placeholder="Асуулт оруулна уу."
          value={question.questionText}
          onChange={e => onUpdate({ questionText: e.target.value })}
          className={`h-9 text-sm ${errors?.questionText ? 'border-red-500' : ''}`}
        />
        {errors?.questionText && <p className="text-xs text-red-500 mt-1">{errors.questionText}</p>}
      </div>

      <div>
        <Label className="text-xs mb-2">Тайлбар (Заавал биш)</Label>
        <Textarea
          placeholder="Тайлбар оруулна уу."
          value={question.description || ''}
          onChange={e => onUpdate({ description: e.target.value })}
          rows={3}
          className="text-sm"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-x-8 gap-y-4">
        <div className="md:col-span-1">
          <Label className="text-xs mb-2">Хариултын төрөл</Label>
          <Select
            value={question.answerType}
            onValueChange={value => onUpdate({ answerType: value as AnswerType })}
          >
            <SelectTrigger className="h-9 text-sm w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={AnswerType.SHORT_TEXT}>Богино текст</SelectItem>
              <SelectItem value={AnswerType.LONG_TEXT}>Урт текст</SelectItem>
              <SelectItem value={AnswerType.SINGLE_CHOICE}>Сонголт</SelectItem>
              <SelectItem value={AnswerType.MULTIPLE_CHOICE}>Олон сонголт</SelectItem>
              <SelectItem value={AnswerType.NUMBER}>Тоо</SelectItem>
              <SelectItem value={AnswerType.DATE}>Огноо</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-2 h-9 md:mt-6">
          <Checkbox
            id={`required-${question.order}`}
            checked={question.isRequired}
            onCheckedChange={checked => onUpdate({ isRequired: checked as boolean })}
          />
          <Label htmlFor={`required-${question.order}`} className="text-xs">
            Хариултыг заавал бөглөх эсэх
          </Label>
        </div>
      </div>

      {needsOptions && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Сонгох утга</Label>
            <Button onClick={addOption} size="sm" variant="outline" className="px-2">
              <Plus className="w-3 h-3" />
              Сонгох утга нэмэх
            </Button>
          </div>

          <div className="space-y-2">
            {(question.options || []).map((option, optionIndex) => (
              <div key={optionIndex} className="flex items-center gap-2">
                <Input
                  placeholder={`Сонгох утга ${optionIndex + 1}`}
                  value={option}
                  onChange={e => updateOption(optionIndex, e.target.value)}
                  className="h-9 text-sm"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeOption(optionIndex)}
                  className="h-7 w-7 p-0 text-destructive"
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {errors?.options && (
        <div className="p-2 border border-red-200 rounded-md bg-red-50">
          <p className="text-xs text-red-700">{errors.options}</p>
        </div>
      )}
    </div>
  );
}
