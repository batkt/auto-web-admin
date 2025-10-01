import { SectionData } from './section.types';

export interface Page {
  _id: string;
  slug: string;
  name: { mn: string; en: string };
  description: { mn: string; en: string };
  keywords: string[];
  sections: SectionData[];
}
