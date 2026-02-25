import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// 1. Interceptor REQUEST: Tự động gắn Token vào Header
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// 2. Interceptor RESPONSE: Xử lý lỗi chung (VD: Hết hạn token -> Đá ra login)
axiosClient.interceptors.response.use(
  (response) => {
    // Trả về data (bóc tách lớp data của axios để lấy data của server)
    return response.data;
  },
  (error) => {
    // Nếu lỗi 401 (Unauthorized) -> Token hết hạn hoặc không hợp lệ
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
