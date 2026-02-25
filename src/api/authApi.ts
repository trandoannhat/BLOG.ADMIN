// https://nhatdev.top
// src/api/authApi.ts
import axiosClient from "./axiosClient";

// ==========================================
// 1. CÁC INTERFACE (Quan trọng: Phải có chữ export)
// ==========================================

// Dữ liệu gửi lên (Request)
export interface LoginRequest {
  email: string;
  password?: string;
}

// Dữ liệu nhận về (Response)
export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    id: string;
    userName: string;
    email: string;
    roles: string[];
    jwToken: string;
  };
}

// ==========================================
// 2. OBJECT GỌI API
// ==========================================
const authApi = {
  login(data: LoginRequest): Promise<LoginResponse> {
    return axiosClient.post("/Account/authenticate", data);
  },
};

export default authApi;
