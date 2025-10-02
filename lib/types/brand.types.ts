export interface TranslatedText {
  en: string;
  mn: string;
}

export interface Brand {
  _id: string;
  name: TranslatedText;
  description?: TranslatedText;
  createdAt: string;
  updatedAt: string;
}

export interface BrandData {
  name: TranslatedText;
  description?: TranslatedText;
}
