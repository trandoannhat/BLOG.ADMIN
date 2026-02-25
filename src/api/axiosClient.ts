// https://nhatdev.top
// src/api/axiosClient.ts
import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://localhost:7000/api", // Thêm fallback cho chắc ăn
  headers: {
    "Content-Type": "application/json",
  },
});

// 1. Interceptor REQUEST: Tự động gắn Token từ ZUSTAND STORAGE
axiosClient.interceptors.request.use(
  (config) => {
    // 👇 SỬA ĐOẠN NÀY: Lấy token từ 'auth-storage' của Zustand
    const storage = localStorage.getItem("auth-storage");
    let token = null;

    if (storage) {
      try {
        // Zustand lưu dạng: { state: { token: "...", user: ... }, version: 0 }
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

// 2. Interceptor RESPONSE
axiosClient.interceptors.response.use(
  (response) => {
    // Trả về data (body) của response
    return response.data;
  },
  (error) => {
    // Nếu lỗi 401 -> Token hết hạn -> Xóa storage và đá về login
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("auth-storage"); // Xóa key của Zustand
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
