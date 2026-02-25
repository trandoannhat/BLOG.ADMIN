// src/router/index.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import { Button, Result } from "antd"; // Dùng cho trang 404
import AuthLayout from "../layouts/AuthLayout";
import AdminLayout from "../layouts/AdminLayout";
import LoginPage from "../pages/Login"; // Import trang Login thật
import { useAuthStore } from "../stores/useAuthStore";

// ==========================================
// 1. CÁC COMPONENT BẢO VỆ ROUTE (GUARDS)
// ==========================================

// Bảo vệ trang Admin: Chưa login -> Đá về Login
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, token } = useAuthStore();

  // Kiểm tra cả state và token trong localStorage cho chắc chắn
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
// Sau này bạn tạo file src/pages/Dashboard/index.tsx thì xóa dòng này đi import vào

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

const Projects = () => (
  <div>
    <h1 className="text-2xl font-bold mb-4">Quản Lý Dự Án</h1>
    <p>Chỗ này sau sẽ đặt cái Table Ant Design vào đây...</p>
  </div>
);

// Trang 404 - Không tìm thấy
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
    errorElement: <NotFound />, // Xử lý lỗi crash trang
    children: [
      {
        index: true, // Đường dẫn mặc định (/)
        element: <Dashboard />,
      },
      {
        path: "projects",
        element: <Projects />,
      },
      // Thêm các route admin khác ở đây...
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
  // Catch-all: Nếu nhập linh tinh -> Đá về 404 hoặc Home
  {
    path: "*",
    element: <NotFound />,
  },
]);
