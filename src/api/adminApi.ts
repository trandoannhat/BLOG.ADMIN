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
// Thêm vào cuối file src/api/adminApi.ts
export const userManagementApi = {
  // Lấy danh sách tất cả tài khoản
  getAllUsers: () => {
    return axiosClient.get("/Account/users");
  },

  // Cập nhật quyền (Role). Dữ liệu gửi lên là một con số Enum (0: Admin, 1: Client)
  updateRole: (id: string, role: number) => {
    return axiosClient.put(`/Account/users/${id}/role`, role, {
      headers: { "Content-Type": "application/json" }, // Đảm bảo gửi dạng số nguyên chứ không phải object
    });
  },

  // Xóa tài khoản
  deleteUser: (id: string) => {
    return axiosClient.delete(`/Account/users/${id}`);
  },
  createUser: (data: any) => {
    return axiosClient.post("/Account/register", data);
  },
};
