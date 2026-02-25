// https://nhatdev.top
// src/router/index.tsx

import { createBrowserRouter, Navigate } from "react-router-dom";
import { Button, Result } from "antd";
import AuthLayout from "../layouts/AuthLayout";
import AdminLayout from "../layouts/AdminLayout";
import LoginPage from "../pages/Login";
import ProjectsPage from "../pages/Projects"; // <--- 1. Import trang Projects thật
import { useAuthStore } from "../stores/useAuthStore";
import CategoriesPage from "../pages/Categories";
import PostsPage from "../pages/Posts";
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
// 2. CÁC TRANG TẠM THỜI (PLACEHOLDERS)
// ==========================================

const Dashboard = () => (
  <div>
    <h1 className="text-2xl font-bold mb-4">Dashboard Thống Kê</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="bg-blue-500 text-white p-6 rounded-lg shadow">
        <h3 className="text-lg">Tổng Dự Án</h3>
        <p className="text-3xl font-bold">12</p>
      </div>
      <div className="bg-green-500 text-white p-6 rounded-lg shadow">
        <h3 className="text-lg">Đang Chạy</h3>
        <p className="text-3xl font-bold">5</p>
      </div>
      <div className="bg-orange-500 text-white p-6 rounded-lg shadow">
        <h3 className="text-lg">Hoàn Thành</h3>
        <p className="text-3xl font-bold">7</p>
      </div>
    </div>
  </div>
);

// (Đã xóa component Projects tạm thời ở đây)

// Trang 404
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
        element: <Dashboard />,
      },
      {
        path: "projects",
        element: <ProjectsPage />, // <--- 2. Sử dụng trang thật ở đây
      },
      { path: "categories", element: <CategoriesPage /> },
      { path: "posts", element: <PostsPage /> },
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
