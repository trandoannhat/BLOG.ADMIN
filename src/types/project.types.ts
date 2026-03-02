// src/types/project.types.ts

export interface ProjectFilter {
  pageNumber: number;
  pageSize: number;
  keyword?: string;
  isFeatured?: boolean | null;
  fromDate?: string;
  toDate?: string;
}

export interface ProjectDto {
  id: string;
  name: string;
  slug: string;
  clientName?: string;
  description: string;
  content?: string; // HTML Case Study
  techStacks: string[];
  liveDemoUrl?: string;
  sourceCodeUrl?: string; // ✅ Đã có
  thumbnailUrl?: string;
  imageUrls: string[];

  startDate: string;
  completedDate?: string;
  isFeatured: boolean;
  createdDate: string;
}

export interface CreateProjectDto {
  name: string;
  slug?: string;
  clientName?: string;
  description: string;
  content?: string; // HTML
  techStacks: string[];
  liveDemoUrl?: string;
  sourceCodeUrl?: string; // ✅ Bổ sung vào Request
  thumbnailUrl?: string;
  imageUrls?: string[];

  startDate?: string;
  completedDate?: string;
  isFeatured?: boolean;
}

export interface UpdateProjectDto extends CreateProjectDto {
  id: string;
}
