'use client';

import { Button } from '@/components/ui/button';
import { Plus, FolderPlus } from 'lucide-react';
import { QuestionBuilder } from './question-builder';
import { GroupBuilder } from './group-builder';
import { SurveyInput, Question, Group, AnswerType } from '@/lib/types/survey.types';
import { FieldErrors } from 'react-hook-form';

interface SurveyFormBuilderProps {
  surveyData: SurveyInput;
  setSurveyData: (data: SurveyInput) => void;
  questionErrors?: { [key: string]: { questionText?: string; options?: string } };
  groupErrors?: { [key: string]: { title?: string; questions?: string } };
  surveyErrors?: { questions?: string; groups?: string };
  errors?: FieldErrors;
}

export function SurveyFormBuilder({
  surveyData,
  setSurveyData,
  questionErrors = {},
  groupErrors = {},
  errors,
  surveyErrors,
}: SurveyFormBuilderProps) {
  // Combine questions and groups into a single ordered list
  const getAllItems = () => {
    const items: Array<{
      type: 'question' | 'group';
      data: Question | Group;
      originalIndex: number;
    }> = [];

    // Add questions
    surveyData.questions.forEach((question, index) => {
      items.push({
        type: 'question',
        data: question,
        originalIndex: index,
      });
    });

    // Add groups
    surveyData.groups.forEach((group, index) => {
      items.push({
        type: 'group',
        data: group,
        originalIndex: index,
      });
    });

    // Sort by order
    return items.sort((a, b) => a.data.order - b.data.order);
  };

  const addQuestion = () => {
    const allItems = getAllItems();
    const newOrder = allItems.length + 1;

    const newQuestion: Question = {
      questionText: '',
      description: '',
      answerType: AnswerType.SHORT_TEXT,
      options: [],
      order: newOrder,
      isRequired: true,
    };

    setSurveyData({
      ...surveyData,
      questions: [...surveyData.questions, newQuestion],
    });
  };

  const addGroup = () => {
    const allItems = getAllItems();
    const newOrder = allItems.length + 1;

    const newGroup: Group = {
      title: '',
      description: '',
      questions: [],
      order: newOrder,
    };

    setSurveyData({
      ...surveyData,
      groups: [...surveyData.groups, newGroup],
    });
  };

  const updateQuestion = (originalIndex: number, updatedQuestion: Partial<Question>) => {
    const updatedQuestions = [...surveyData.questions];
    updatedQuestions[originalIndex] = {
      ...updatedQuestions[originalIndex],
      ...updatedQuestion,
    };

    setSurveyData({
      ...surveyData,
      questions: updatedQuestions,
    });
  };

  const updateGroup = (originalIndex: number, updatedGroup: Partial<Group>) => {
    const updatedGroups = [...surveyData.groups];
    updatedGroups[originalIndex] = {
      ...updatedGroups[originalIndex],
      ...updatedGroup,
    };

    setSurveyData({
      ...surveyData,
      groups: updatedGroups,
    });
  };

  const deleteItem = (sortedIndex: number) => {
    const allItems = getAllItems();
    const item = allItems[sortedIndex];

    if (!item) return;

    let remainingItems: any[] = allItems;
    if (item.type === 'question') {
      remainingItems = allItems.filter((_, index) => index !== sortedIndex);
    } else if (item.type === 'group') {
      remainingItems = allItems.filter((_, index) => index !== sortedIndex);
    }

    const reorderedItems = remainingItems.map((item, index) => ({
      ...item,
      data: {
        ...item.data,
        order: index + 1,
      },
    }));

    const reorderedQuestions = reorderedItems
      .filter(item => item.type === 'question')
      .map(item => item.data as Question);

    const reorderedGroups = reorderedItems
      .filter(item => item.type === 'group')
      .map(item => item.data as Group);

    setSurveyData({
      ...surveyData,
      questions: reorderedQuestions,
      groups: reorderedGroups,
    });
  };

  const updateGroupQuestion = (
    groupOriginalIndex: number,
    questionIndex: number,
    updatedQuestion: Partial<Question>
  ) => {
    const updatedGroups = [...surveyData.groups];
    const currentGroup = updatedGroups[groupOriginalIndex];

    if (currentGroup && currentGroup.questions) {
      const updatedQuestions = [...currentGroup.questions];
      updatedQuestions[questionIndex] = {
        ...updatedQuestions[questionIndex],
        ...updatedQuestion,
      };

      updatedGroups[groupOriginalIndex] = {
        ...currentGroup,
        questions: updatedQuestions,
      };

      setSurveyData({
        ...surveyData,
        groups: updatedGroups,
      });
    }
  };

  const deleteGroupQuestion = (groupOriginalIndex: number, questionIndex: number) => {
    const updatedGroups = [...surveyData.groups];
    const currentGroup = updatedGroups[groupOriginalIndex];

    if (currentGroup && currentGroup.questions) {
      const updatedQuestions = currentGroup.questions
        .filter((_, i) => i !== questionIndex)
        .map((q, i) => ({
          ...q,
          order: i + 1,
        }));

      updatedGroups[groupOriginalIndex] = {
        ...currentGroup,
        questions: updatedQuestions,
      };

      setSurveyData({
        ...surveyData,
        groups: updatedGroups,
      });
    }
  };

  const items = getAllItems();

  return (
    <div className="space-y-4">
      {surveyErrors && (surveyErrors.questions || surveyErrors.groups) && (
        <div className="p-3 border border-red-200 rounded-md bg-red-50">
          <div className="space-y-1">
            {surveyErrors.questions && (
              <p className="text-xs text-red-700">{surveyErrors.questions}</p>
            )}
            {surveyErrors.groups && <p className="text-xs text-red-700">{surveyErrors.groups}</p>}
          </div>
        </div>
      )}

      <div className="space-y-3">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-muted-foreground text-sm">
            <p>Судалгааны асуулт байхгүй байна. Асуулт эсвэл бүлэг сонгож нэмнэ үү.</p>
            <div className="flex gap-2 mt-4">
              <Button onClick={addQuestion} size="sm" variant="outline">
                <Plus className="w-3 h-3 mr-1" />
                Асуулт
              </Button>
              <Button onClick={addGroup} size="sm" variant="outline">
                <FolderPlus className="w-3 h-3 mr-1" />
                Бүлэг
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {items.map((item, sortedIndex) => (
              <div key={`${item.type}-${item.originalIndex}-${sortedIndex}`} className="relative">
                {item.type === 'question' ? (
                  <QuestionBuilder
                    question={item.data as Question}
                    onUpdate={updatedQuestion =>
                      updateQuestion(item.originalIndex, updatedQuestion)
                    }
                    onDelete={() => deleteItem(sortedIndex)}
                    errors={questionErrors[`question_${item.originalIndex.toString()}`]}
                  />
                ) : (
                  <div className="border rounded-md p-4">
                    <GroupBuilder
                      group={item.data as Group}
                      index={item.originalIndex}
                      onUpdate={updatedGroup => updateGroup(item.originalIndex, updatedGroup)}
                      onDelete={() => deleteItem(sortedIndex)}
                      onQuestionUpdate={(questionIndex, updatedQuestion) =>
                        updateGroupQuestion(item.originalIndex, questionIndex, updatedQuestion)
                      }
                      onQuestionDelete={questionIndex =>
                        deleteGroupQuestion(item.originalIndex, questionIndex)
                      }
                      questionErrors={questionErrors}
                      errors={groupErrors[`group_${item.originalIndex.toString()}`]}
                    />
                  </div>
                )}
              </div>
            ))}

            <div className="flex gap-2 mt-4 items-center justify-center py-8">
              <Button onClick={addQuestion} size="sm" variant="default">
                <Plus className="w-3 h-3 mr-1" />
                Асуулт
              </Button>
              <Button onClick={addGroup} size="sm" variant="default">
                <FolderPlus className="w-3 h-3 mr-1" />
                Бүлэг
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
