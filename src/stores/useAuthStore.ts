// src/stores/useAuthStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// 1. Định nghĩa kiểu dữ liệu User (khớp với DTO Backend trả về)
interface User {
  id: string;
  email: string;
  userName: string;
  roles: string[];
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
}

// 2. Tạo Store (có persist để lưu vào localStorage tự động)
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // Hàm đăng nhập: Lưu user & token
      login: (user, token) => set({ user, token, isAuthenticated: true }),

      // Hàm đăng xuất: Xóa sạch

      logout: () => {
        // 1. Xóa state trong bộ nhớ React
        set({ user: null, token: null, isAuthenticated: false });

        // 2. Xóa key chính của Zustand
        localStorage.removeItem("auth-storage");

        // 3. Xóa các key "rác" còn sót lại (Bổ sung đoạn này)
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("isSystemAdmin");

        // MẸO: Nếu bạn muốn xóa sạch sành sanh không còn gì cả (Reset app hoàn toàn)
        // Thì dùng lệnh này thay thế cho tất cả các dòng removeItem ở trên:
        // localStorage.clear();
      },
    }),
    {
      name: "auth-storage", // Tên key trong localStorage
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
