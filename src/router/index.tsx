// src/router/index.tsx
import { createBrowserRouter, Navigate } from "react-router-dom";
import { Button, Result } from "antd";

import ProfilePage from "../pages/Profile";
import SettingsPage from "../pages/Settings";
import AuthLayout from "../layouts/AuthLayout";
import AdminLayout from "../layouts/AdminLayout";
import LoginPage from "../pages/Login";
import ProjectsPage from "../pages/Projects";
import CategoriesPage from "../pages/Categories";
import PostsPage from "../pages/Posts";
import DonationsPage from "../pages/Donations";
import DashboardPage from "../pages/Dashboard";

// 👇 ĐÃ THÊM: Import trang Contacts
import ContactsPage from "../pages/Contacts";

import { useAuthStore } from "../stores/useAuthStore";
import UsersPage from "../pages/Users";
import PartnerAdsPage from "../pages/PartnerAds";

// ==========================================
// 1. CÁC COMPONENT BẢO VỆ ROUTE (GUARDS)
// ==========================================
const Forbidden = () => {
  const handleLogout = () => {
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

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, token, user } = useAuthStore();

  if (!isAuthenticated || !token) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = user?.roles?.includes("Admin");
  if (!isAdmin) {
    return <Forbidden />;
  }

  return <>{children}</>;
};

const RejectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, token } = useAuthStore();
  if (isAuthenticated && token) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

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

      { path: "contacts", element: <ContactsPage /> },
      { path: "users", element: <UsersPage /> },
      { path: "partner-ads", element: <PartnerAdsPage /> },
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
