import { Block } from './block.types';
import { Category } from './category.types';

export interface Blog {
  _id: string;
  title: string;
  thumbImage: string;
  categories: Category[];
  blocks: Block[];
  slug: string;
  status: 'draft' | 'published' | 'cancelled';
  publishedAt?: string;
  author?: {
    username: string;
    firstname: string;
    lastname: string;
  };
  createdAt: string;
  updatedAt: string;
  language: string;
}

export interface BlogData {
  title: string;
  thumbImage: string;
  categories?: string[];
  blocks: Block[];
  status?: 'draft' | 'published' | 'cancelled';
  language?: string;
}
