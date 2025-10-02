export interface MultilingualText {
  en: string;
  mn: string;
}

export interface FieldDefinition {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'image' | 'array' | 'object';
  required?: boolean;
  sortOrder?: number;
}

export interface SectionData {
  _id?: string;
  pageId: string;
  sortOrder?: number;
  data: Record<string, any>;
  key: string;
  fieldDefinitions?: FieldDefinition[];
}

export interface PageData {
  slug: string;
  name: MultilingualText;
  description: MultilingualText;
  sections: SectionData[];
}

// Specific section data types based on initData.ts
export interface HeroSectionData {
  welcomeText: MultilingualText;
  mainTitle: MultilingualText;
  ctaText: MultilingualText;
  ctaUrl: string;
  backgroundImage: string;
  stats: {
    servedOver: {
      value: number;
      label: MultilingualText;
    };
    donate: {
      title: MultilingualText;
      desc: MultilingualText;
    };
    volunteer: {
      title: MultilingualText;
      desc: MultilingualText;
    };
  };
}

export interface MissionSectionData {
  title: MultilingualText;
  description: MultilingualText;
}

export interface HelpSectionData {
  title: MultilingualText;
  subtitle: MultilingualText;
  items: Array<{
    icon: string;
    title: MultilingualText;
    description: MultilingualText;
  }>;
}

export type SectionDataType = HeroSectionData | MissionSectionData | HelpSectionData;
