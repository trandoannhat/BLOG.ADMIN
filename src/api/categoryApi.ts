// https://nhatdev.top
// src/api/categoryApi.ts

import axiosClient from "./axiosClient";
import type { PagedResult } from "../types/common.types";

// 👇 Import từ file types mới tạo
import type {
  CategoryDto,
  CreateCategoryDto,
  UpdateCategoryDto,
  CategoryFilter,
} from "../types/category.types";

const categoryApi = {
  getPaged(filter: CategoryFilter) {
    return axiosClient.get<any, PagedResult<CategoryDto>>("/Categories", {
      params: {
        PageNumber: filter.pageNumber,
        PageSize: filter.pageSize,
        Keyword: filter.keyword,
      },
    });
  },

  getAll() {
    return axiosClient.get<any, { data: CategoryDto[] }>("/Categories/all");
  },

  // --- THÊM MỚI: Gọi API lấy dữ liệu dạng Cây (Tree) ---
  getTree() {
    return axiosClient.get<any, { data: CategoryDto[] }>("/Categories/tree");
  },
  // -----------------------------------------------------

  getById(id: string) {
    return axiosClient.get<any, { data: CategoryDto }>(`/Categories/${id}`);
  },

  create(data: CreateCategoryDto) {
    return axiosClient.post("/Categories", data);
  },

  update(data: UpdateCategoryDto) {
    return axiosClient.put(`/Categories/${data.id}`, data);
  },

  delete(id: string) {
    return axiosClient.delete(`/Categories/${id}`);
  },
};

export default categoryApi;
