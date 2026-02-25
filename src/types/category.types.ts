// https://nhatdev.top
// src/types/category.types.ts
// src/types/category.types.ts

export interface CategoryDto {
  id: string;
  name: string;
  slug: string;
  description?: string;
  postCount: number;
  createdAt: string;
}

export interface CreateCategoryDto {
  name: string;
  description?: string;
}

export interface UpdateCategoryDto extends CreateCategoryDto {
  id: string;
}

export interface CategoryFilter {
  pageNumber: number;
  pageSize: number;
  keyword?: string;
}
