import { Block } from './block.types';

export interface BlogFormValues {
  title: string;
  thumbImage: string;
  categories: string[];
  blocks: Block[];
  language: string;
}
