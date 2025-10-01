export interface Branch {
  _id: string;
  name: string;
  fullAddress: string;
  phone: string;
  email: string;
  services: string[];
  image: string;
  coordinates: [number, number];
  pastor?: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export type LanguageKey = 'mn' | 'en';

export type MultiLanguageString = {
  [key in LanguageKey]?: string;
};

export type BranchHeroData = {
  title: MultiLanguageString;
  description: MultiLanguageString;
  image: string;
  items: {
    name: MultiLanguageString;
    stats: string;
  }[];
};

export type BranchCampusData = {
  title: MultiLanguageString;
  description: MultiLanguageString;
};
