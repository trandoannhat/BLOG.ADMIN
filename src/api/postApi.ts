// https://nhatdev.top
// src/api/postApi.ts
import axiosClient from "./axiosClient";
import type {
  PostDto,
  CreatePostDto,
  UpdatePostDto,
  PostFilter,
} from "../types/post.types";
import type { PagedResult } from "../types/common.types";

const postApi = {
  getPaged(filter: PostFilter) {
    return axiosClient.get<any, PagedResult<PostDto>>("/Posts", {
      params: {
        PageNumber: filter.pageNumber,
        PageSize: filter.pageSize,
        Keyword: filter.keyword,
        CategoryId: filter.categoryId,
        IsPublished: filter.isPublished,
      },
    });
  },

  getById(id: string) {
    return axiosClient.get<any, { data: PostDto }>(`/Posts/${id}`);
  },

  create(data: CreatePostDto) {
    return axiosClient.post("/Posts", data);
  },

  update(data: UpdatePostDto) {
    return axiosClient.put(`/Posts/${data.id}`, data);
  },

  delete(id: string) {
    return axiosClient.delete(`/Posts/${id}`);
  },
};

export default postApi;
