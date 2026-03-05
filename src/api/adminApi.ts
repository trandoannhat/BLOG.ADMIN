// src/api/adminApi.ts
import axiosClient from "./axiosClient";

// --- 1. ĐỊNH NGHĨA KIỂU DỮ LIỆU (TYPESCRIPT INTERFACES) ---

// 👇 ĐÃ THÊM: Interface bọc dữ liệu chuẩn khớp 100% với ApiResponse của .NET
export interface ApiResponse<T = any> {
  succeeded?: boolean; // .NET thường serialize cờ thành công thành biến này
  success?: boolean; // Dự phòng nếu dùng thư viện khác
  message?: string;
  data?: T;
  errors?: string[];
}

export interface UpdateProfilePayload {
  fullName: string;
  phoneNumber?: string;
  avatarUrl?: string;
}

export interface SystemSettingPayload {
  key: string;
  value: string;
}

// --- 2. CÁC HÀM GỌI API ĐẾN BACKEND ---
export const accountApi = {
  // Cập nhật thông tin cá nhân (Profile)
  updateProfile: (data: UpdateProfilePayload): Promise<ApiResponse> => {
    return axiosClient.put("/Account/profile", data);
  },
};

export const settingApi = {
  // Lấy danh sách tất cả cấu hình hệ thống
  // Trả về một ApiResponse chứa mảng SystemSettingPayload
  getAll: (): Promise<ApiResponse<SystemSettingPayload[]>> => {
    return axiosClient.get("/SystemSettings");
  },

  // Cập nhật cấu hình hàng loạt (Gửi danh sách Key-Value)
  updateBatch: (settings: SystemSettingPayload[]): Promise<ApiResponse> => {
    return axiosClient.post("/SystemSettings/batch", settings);
  },
};
