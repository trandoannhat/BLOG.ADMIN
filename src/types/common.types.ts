// https://nhatdev.top
// src/types/common.types.ts

// Kiểu trả về khi phân trang (Dùng chung cho cả Project, Blog, User...)
export interface PagedResult<T> {
  data: T[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}
export interface ApiResponse<T> {
  succeeded: boolean;
  message: string;
  data: T;
}
