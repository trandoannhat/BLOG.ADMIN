// src/api/partnerAdApi.ts
import axiosClient from "./axiosClient";

export const partnerAdApi = {
  // Lấy tất cả quảng cáo (Dành cho Admin)
  getAll: () => {
    return axiosClient.get("/PartnerAds");
  },

  // Thêm mới
  create: (data: any) => {
    return axiosClient.post("/PartnerAds", data);
  },

  // Cập nhật
  update: (id: string, data: any) => {
    return axiosClient.put(`/PartnerAds/${id}`, data);
  },

  // Bật / Tắt nhanh
  toggleActive: (id: string) => {
    return axiosClient.patch(`/PartnerAds/${id}/toggle`);
  },

  // Xóa
  delete: (id: string) => {
    return axiosClient.delete(`/PartnerAds/${id}`);
  },
};
