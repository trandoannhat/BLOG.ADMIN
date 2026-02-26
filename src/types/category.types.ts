// https://nhatdev.top
// src/types/category.types.ts

export interface CategoryDto {
  id: string;
  name: string;
  slug: string;
  description?: string;
  postCount: number;
  createdAt: string;
  parentId?: string | null; // --- THÊM MỚI ---
  children?: CategoryDto[]; // --- THÊM MỚI: Dùng cho Tree Table ---
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
  parentId?: string | null; // --- THÊM MỚI ---
}

export interface UpdateCategoryDto extends CreateCategoryDto {
  id: string;
}

export interface CategoryFilter {
  pageNumber: number;
  pageSize: number;
  keyword?: string;
}
