// https://nhatdev.top
// src/layouts/AdminLayout.tsx
import { Layout, Menu, Button, theme } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  ProjectOutlined,
  LogoutOutlined,
  AppstoreOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import { EditOutlined } from "@ant-design/icons";

const { Header, Sider, Content } = Layout;

const AdminLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuthStore();

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // Định nghĩa menu items với Link (Chuẩn UX Admin)
  const menuItems = [
    {
      key: "/",
      icon: <DashboardOutlined />,
      label: <Link to="/">Dashboard</Link>,
    },
    {
      key: "/categories",
      icon: <AppstoreOutlined />,
      label: <Link to="/categories">Danh mục</Link>,
    },
    {
      key: "/posts",
      icon: <EditOutlined />,
      label: <Link to="/posts">Bài viết</Link>,
    },
    {
      key: "/projects",
      icon: <ProjectOutlined />,
      label: <Link to="/projects">Quản lý Dự án</Link>,
    },
    // Sau này thêm bài viết:
    // { key: "/posts", icon: <EditOutlined />, label: <Link to="/posts">Bài viết</Link> },
  ];

  return (
    <Layout className="h-screen">
      <Sider
        trigger={null}
        collapsible
        collapsed={collapsed}
        className="bg-slate-900"
      >
        <div className="demo-logo-vertical h-16 flex items-center justify-center text-white font-bold text-xl border-b border-slate-700">
          {collapsed ? "ND" : "NhatDev Admin"}
        </div>

        <Menu
          theme="dark"
          mode="inline"
          // Logic highlight: Lấy đường dẫn hiện tại làm key
          selectedKeys={[location.pathname]}
          items={menuItems}
        />
      </Sider>

      <Layout>
        <Header
          style={{ padding: 0, background: colorBgContainer }}
          className="flex justify-between items-center pr-6 shadow-sm"
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: "16px", width: 64, height: 64 }}
          />

          <div className="flex items-center gap-4">
            <span className="font-semibold text-gray-700">
              Xin chào, {user?.userName}
            </span>
            <Button
              type="primary"
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              Thoát
            </Button>
          </div>
        </Header>

        <Content
          style={{
            margin: "24px 16px",
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            overflow: "auto",
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;
