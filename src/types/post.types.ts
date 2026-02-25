// https://nhatdev.top
// src/types/post.types.ts
export interface PostDto {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  thumbnailUrl?: string;
  viewCount: number;
  isPublished: boolean;
  createdAt: string;
  categoryId: string;
  categoryName: string; // Tên danh mục để hiển thị trên bảng
  authorName: string;
}

export interface CreatePostDto {
  title: string;
  summary: string;
  content: string;
  thumbnailUrl?: string;
  isPublished: boolean;
  categoryId: string;
}

export interface UpdatePostDto extends CreatePostDto {
  id: string;
}

export interface PostFilter {
  pageNumber: number;
  pageSize: number;
  keyword?: string;
  categoryId?: string | null;
  isPublished?: boolean | null;
}
