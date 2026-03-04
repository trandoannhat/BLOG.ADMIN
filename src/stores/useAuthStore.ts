// src/stores/useAuthStore.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// 1. Định nghĩa kiểu dữ liệu User
interface User {
  id: string;
  email: string;
  userName: string;
  roles: string[];
  avatarUrl?: string; //  Đã thêm avatar
  phoneNumber?: string;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (updatedData: Partial<User>) => void;
}

// 2. Tạo Store
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      // Hàm đăng nhập
      login: (user, token) => set({ user, token, isAuthenticated: true }),

      // Hàm đăng xuất
      logout: () => {
        // 1. Reset state (Zustand sẽ TỰ ĐỘNG cập nhật localStorage "auth-storage" thành rỗng)
        set({ user: null, token: null, isAuthenticated: false });

        // 2. Dọn dẹp các key rác từ thời code cũ (nếu có)
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("isSystemAdmin");
      },
      updateUser: (updatedData) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedData } : null,
        })),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
