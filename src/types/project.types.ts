// https://nhatdev.top
// src/types/project.types.ts

// 1. Filter Params (Khớp với Backend ProjectFilterParams)
export interface ProjectFilter {
  pageNumber: number;
  pageSize: number;
  keyword?: string;
  // 👇 3 trường mới
  isFeatured?: boolean | null; // null: Tất cả, true: Nổi bật, false: Thường
  fromDate?: string; // Gửi chuỗi ISO hoặc YYYY-MM-DD
  toDate?: string;
}

// 1. DTO hiển thị (Response)
export interface ProjectDto {
  id: string;
  name: string;
  slug: string; // ✅ Mới
  clientName?: string;
  description: string;
  content?: string; // ✅ Mới (Bài viết Case Study)
  techStacks: string[];
  liveDemoUrl?: string;
  sourceCodeUrl?: string;
  thumbnailUrl?: string;
  imageUrls: string[];

  startDate: string; // ✅ Mới (ISO Date String)
  completedDate?: string; // ✅ Mới
  isFeatured: boolean; // ✅ Mới
  createdDate: string;
}

// 2. DTO Tạo mới / Cập nhật (Request)
export interface CreateProjectDto {
  name: string;
  slug?: string; // Có thể để backend tự sinh hoặc FE gửi lên
  clientName?: string;
  description: string;
  content?: string;
  techStacks: string[];
  liveDemoUrl?: string;
  sourceCodeUrl?: string;
  thumbnailUrl?: string;
  imageUrls?: string[]; // Backend bạn đang dùng List<ProjectImage>, FE gửi list URL

  startDate?: string;
  completedDate?: string;
  isFeatured?: boolean;
}

export interface UpdateProjectDto extends CreateProjectDto {
  id: string;
}
