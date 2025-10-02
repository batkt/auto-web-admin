import { Block } from './block.types';
import { Category } from './category.types';

export interface Product {
  _id: string;
  proModel: string;
  name: string;
  desc: string;
  size?: [string];
  qty: number;
  productImg: string;

  brand?: Category[];
  blocks: Block[];
  slug: string;
  status: 'draft' | 'published' | 'cancelled';
  publishedAt?: string;

  createdAt: string;
  updatedAt: string;
  language: string;
}

export interface ProductData {
  proModel: string; // загварын код
  name: string; // нэр
  desc: string; // тайлбар
  size?: string[]; // олон хэмжээ
  qty: number; // тоо ширхэг
  productImg: string; // thumbnail буюу үндсэн зураг
  brand?: string[]; // brand ID-үүд (Category._id гэх мэт)
  blocks: Block[]; // dynamic content blocks
  slug: string; // url slug
  status?: 'draft' | 'published' | 'cancelled';
  publishedAt?: string; // нийтэлсэн огноо (сонголттой)
  language?: string; // хэл
}
