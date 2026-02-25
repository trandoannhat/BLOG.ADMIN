// https://nhatdev.top
// src/api/projectApi.ts
import axiosClient from "./axiosClient";
import type { PagedResult } from "../types/common.types";
import type {
  ProjectDto,
  ProjectFilter,
  CreateProjectDto,
  UpdateProjectDto,
} from "../types/project.types";

const projectApi = {
  getAll(filter: ProjectFilter) {
    return axiosClient.get<any, PagedResult<ProjectDto>>("/Projects", {
      params: {
        PageNumber: filter.pageNumber,
        PageSize: filter.pageSize,
        Keyword: filter.keyword,
        // 👇 Gửi thêm 3 tham số lọc
        IsFeatured: filter.isFeatured,
        FromDate: filter.fromDate,
        ToDate: filter.toDate,
      },
    });
  },

  // ... (Giữ nguyên create, update, delete)
  getById(id: string) {
    return axiosClient.get<any, ProjectDto>(`/Projects/${id}`);
  },
  create(data: CreateProjectDto) {
    return axiosClient.post("/Projects", data);
  },
  update(data: UpdateProjectDto) {
    return axiosClient.put(`/Projects/${data.id}`, data);
  },
  delete(id: string) {
    return axiosClient.delete(`/Projects/${id}`);
  },
};

export default projectApi;
