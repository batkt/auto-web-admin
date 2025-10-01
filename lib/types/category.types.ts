export interface TranslatedText {
  en: string;
  mn: string;
}

export interface Category {
  _id: string;
  name: TranslatedText;
  description?: TranslatedText;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryData {
  name: TranslatedText;
  description?: TranslatedText;
}
