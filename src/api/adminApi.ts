// https://nhatdev.top
// src/api/adminApi.ts
import axiosClient from "./axiosClient";

// --- 1. ĐỊNH NGHĨA KIỂU DỮ LIỆU (TYPESCRIPT INTERFACES) ---
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
  updateProfile: (data: UpdateProfilePayload) => {
    return axiosClient.put("/Account/profile", data);
    // ⚠️ Đảm bảo bên C# của bạn AccountController có API [HttpPut("profile")] nhé
  },
};

export const settingApi = {
  // Lấy danh sách tất cả cấu hình hệ thống
  getAll: () => {
    return axiosClient.get("/SystemSettings");
  },

  // Cập nhật cấu hình hàng loạt (Gửi danh sách Key-Value)
  updateBatch: (settings: SystemSettingPayload[]) => {
    return axiosClient.post("/SystemSettings/batch", settings);
  },
};
