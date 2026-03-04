// https://nhatdev.top
// src/router/index.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import { Button, Result } from "antd";

import ProfilePage from "../pages/Profile";
import SettingsPage from "../pages/Settings";
// --- IMPORTS ---
import AuthLayout from "../layouts/AuthLayout";
import AdminLayout from "../layouts/AdminLayout";
import LoginPage from "../pages/Login";
import ProjectsPage from "../pages/Projects";
import CategoriesPage from "../pages/Categories";
import PostsPage from "../pages/Posts";
import DonationsPage from "../pages/Donations";
import DashboardPage from "../pages/Dashboard";

// Import store Zustand
import { useAuthStore } from "../stores/useAuthStore";

// ==========================================
// 1. CÁC COMPONENT BẢO VỆ ROUTE (GUARDS)
// ==========================================

// ✅ THÊM COMPONENT 403 - FORBIDDEN
const Forbidden = () => {
  const handleLogout = () => {
    // Xóa token và bắt buộc đăng nhập lại
    localStorage.removeItem("auth-storage");
    window.location.href = "/login";
  };

  return (
    <Result
      status="403"
      title="403 Không có quyền"
      subTitle="Khu vực cấm! Tài khoản của bạn không có quyền truy cập trang Quản trị."
      extra={
        <Button type="primary" onClick={handleLogout}>
          Đăng nhập bằng tài khoản Admin
        </Button>
      }
    />
  );
};

// 👇 ĐÃ SỬA: Bảo vệ trang Admin (Check cả Đăng nhập & Quyền)
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  // Lấy thêm thông tin `user` để check roles
  const { isAuthenticated, token, user } = useAuthStore();

  // 1. Nếu chưa đăng nhập -> Đá về Login
  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Nếu đã đăng nhập nhưng KHÔNG CÓ chữ "Admin" trong mảng roles -> Hiện màn hình 403
  const isAdmin = user?.roles?.includes("Admin");

  if (!isAdmin) {
    return <Forbidden />;
  }

  // 3. Đúng là Admin -> Cho vào nhà
  return <>{children}</>;
};

// Bảo vệ trang Login: Đã login -> Đá về Dashboard
const RejectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, token } = useAuthStore();

  if (isAuthenticated && token) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

// ==========================================
// 2. TRANG 404
// ==========================================
const NotFound = () => (
  <Result
    status="404"
    title="404"
    subTitle="Xin lỗi, trang bạn tìm kiếm không tồn tại."
    extra={
      <Button type="primary" href="/">
        Về trang chủ
      </Button>
    }
  />
);

// ==========================================
// 3. CẤU HÌNH ROUTER CHÍNH
// ==========================================

export const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AdminLayout />
      </ProtectedRoute>
    ),
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      { path: "projects", element: <ProjectsPage /> },
      { path: "categories", element: <CategoriesPage /> },
      { path: "posts", element: <PostsPage /> },
      { path: "donations", element: <DonationsPage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "settings", element: <SettingsPage /> },
    ],
  },
  {
    path: "/login",
    element: (
      <RejectedRoute>
        <AuthLayout />
      </RejectedRoute>
    ),
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
