// https://nhatdev.top
// src/api/axiosClient.ts
import axios from "axios";
import { message } from "antd";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://localhost:7000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// 1. Interceptor REQUEST: Tự động gắn Token
axiosClient.interceptors.request.use(
  (config) => {
    const storage = localStorage.getItem("auth-storage");
    let token = null;

    if (storage) {
      try {
        const parsed = JSON.parse(storage);
        token = parsed.state?.token;
      } catch (e) {
        console.error("Lỗi parse token từ localStorage", e);
      }
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// 2. Interceptor RESPONSE: Bóc tách data
axiosClient.interceptors.response.use(
  (response) => {
    // Trả về thẳng body (ApiResponse) để các trang tự xử lý message
    return response.data;
  },
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      message.warning("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
      localStorage.removeItem("auth-storage");
      window.location.href = "/login";
    } else if (status === 403) {
      message.error("Bạn không có quyền thực hiện thao tác này!");
    } else if (status === 400 || status === 500) {
      // Chỉ hiện lỗi khi server có message lỗi cụ thể, nếu không trang Page sẽ tự handle
      const errorMsg = error.response?.data?.message;
      if (errorMsg) message.error(errorMsg);
    }

    return Promise.reject(error);
  },
);

export default axiosClient;
