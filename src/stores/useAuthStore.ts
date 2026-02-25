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
      logout: () => set({ user: null, token: null, isAuthenticated: false }),
    }),
    {
      name: "auth-storage", // Tên key trong localStorage
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
