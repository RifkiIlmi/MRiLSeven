// Interface untuk response API
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  meta?: PaginationMeta;
  message?: string;
  error?: string;
}

// Interface untuk post tanpa Mongoose Document
export interface PostData {
  _id: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  thumbnail?: string;
  author: string;
  published: boolean;
  tags: string[];
  views: number;
  readingTime: number;
  createdAt: string;
  updatedAt: string;
}

// Interface pagination
export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}