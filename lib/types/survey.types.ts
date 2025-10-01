export enum AnswerType {
  SHORT_TEXT = 'short_text',
  LONG_TEXT = 'long_text',
  SINGLE_CHOICE = 'single_choice',
  MULTIPLE_CHOICE = 'multiple_choice',
  NUMBER = 'number',
  DATE = 'date',
}

export enum SurveyStatus {
  SAVED = 'saved',
  STARTED = 'started',
  FINISHED = 'finished',
  STOPPED = 'stopped',
  ARCHIVED = 'archived',
}

export interface Question {
  questionText: string;
  description?: string;
  answerType: AnswerType;
  options?: string[];
  order: number; // Add order field for questions
  isRequired: boolean; // Add isRequired field for questions
}

export interface Group {
  title: string;
  description?: string;
  questions: Question[];
  order: number; // Add order field for groups
}

export interface SurveyInput {
  title: string;
  description?: string;
  questions: Question[];
  groups: Group[];
}

export interface QuestionWithId extends Question {
  _id: string;
}

export interface GroupWithId extends Group {
  _id: string;
}

export interface SurveyDataWithId extends SurveyData {
  _id: string;
  groups: GroupWithId[];
  questions: QuestionWithId[];
}

export interface SurveyData {
  _id: string;
  title: string;
  description?: string;
  groups: Group[];
  questions: Question[];
  status: SurveyStatus;
  isAnswered: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SurveyResponse {
  _id: string;
  surveyId: string;
  version: number;
  respondentInfo?: {
    email?: string;
    userId?: string;
    ip?: string;
  };
  ipAddress?: string;
  answers: Array<{
    _id: string;
    questionId: string;
    value: string | string[];
  }>;
  createdAt: string;
}
