export type Block =
  | { id: string; type: 'text'; content?: string }
  | { id: string; type: 'image'; data?: UploadedImage }
  | { id: string; type: 'video'; url?: string }
  | { id: string; type: 'gallery'; images: string[] };

export interface UploadedImage {
  id: string;
  url: string;
  alt: string;
}
