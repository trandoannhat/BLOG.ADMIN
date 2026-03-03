// https://nhatdev.top
// src/router/index.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import { Button, Result } from "antd";

// --- IMPORTS ---
import AuthLayout from "../layouts/AuthLayout";
import AdminLayout from "../layouts/AdminLayout";
import LoginPage from "../pages/Login";
import ProjectsPage from "../pages/Projects";
import CategoriesPage from "../pages/Categories";
import PostsPage from "../pages/Posts";
import DonationsPage from "../pages/Donations";
// 👇 BƯỚC 1: IMPORT TRANG DASHBOARD MỚI VÀO ĐÂY
import DashboardPage from "../pages/Dashboard";

import { useAuthStore } from "../stores/useAuthStore";

// ==========================================
// 1. CÁC COMPONENT BẢO VỆ ROUTE (GUARDS)
// ==========================================

// Bảo vệ trang Admin: Chưa login -> Đá về Login
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, token } = useAuthStore();

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }
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
// (Đã xóa cái component Dashboard tạm thời ở đây)

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
        // 👇 BƯỚC 2: GỌI COMPONENT DASHBOARD PAGE RA ĐÂY
        element: <DashboardPage />,
      },
      {
        path: "projects",
        element: <ProjectsPage />,
      },
      { path: "categories", element: <CategoriesPage /> },
      { path: "posts", element: <PostsPage /> },
      { path: "donations", element: <DonationsPage /> },
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
