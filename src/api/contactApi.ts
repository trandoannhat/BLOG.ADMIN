// src/api/contactApi.ts
import axiosClient from "./axiosClient";

export interface ContactFilter {
  pageNumber: number;
  pageSize: number;
  keyword?: string;
  status?: number; // Ví dụ: 0: Chờ xử lý, 1: Đang tư vấn, 2: Đã hoàn thành
}

export const contactApi = {
  // Lấy danh sách có phân trang và tìm kiếm
  getAll: (filter: ContactFilter) => {
    // Chuyển object filter thành query string (?pageNumber=1&pageSize=10...)
    const params = new URLSearchParams();
    params.append("pageNumber", filter.pageNumber.toString());
    params.append("pageSize", filter.pageSize.toString());
    if (filter.keyword) params.append("keyword", filter.keyword);
    if (filter.status !== undefined && filter.status !== null) {
      params.append("status", filter.status.toString());
    }

    return axiosClient.get(`/Contacts?${params.toString()}`);
  },

  // Cập nhật trạng thái và ghi chú nội bộ
  updateStatus: (
    id: string,
    payload: { id: string; status: number; adminNote: string },
  ) => {
    return axiosClient.put(`/Contacts/${id}`, payload);
  },

  // Xóa liên hệ
  delete: (id: string) => {
    return axiosClient.delete(`/Contacts/${id}`);
  },
};
