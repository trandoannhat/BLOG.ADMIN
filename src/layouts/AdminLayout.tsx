// src/layouts/AdminLayout.tsx
import { Layout, Menu, Button, theme, Dropdown, Avatar, Space } from "antd";
import type { MenuProps } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  ProjectOutlined,
  LogoutOutlined,
  AppstoreOutlined,
  EditOutlined,
  HeartOutlined,
  UserOutlined,
  SettingOutlined,
  MailOutlined, // 👈 THÊM: Icon cho Menu Liên hệ
} from "@ant-design/icons";
import { useState } from "react";
import { Outlet, useNavigate, useLocation, Link } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";

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

  const handleUserMenuClick: MenuProps["onClick"] = ({ key }) => {
    if (key === "logout") {
      handleLogout();
    } else {
      navigate(`/${key}`);
    }
  };

  // 1. Menu bên trái (Sidebar)
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
    {
      key: "/donations",
      icon: <HeartOutlined />,
      label: <Link to="/donations">Quản lý Ủng hộ</Link>,
    },
    // 👇 THÊM: Menu Yêu cầu liên hệ
    {
      key: "/contacts",
      icon: <MailOutlined />,
      label: <Link to="/contacts">Yêu cầu liên hệ</Link>,
    },
  ];

  // 2. Menu thả xuống cho User Profile ở góc phải
  const userDropdownItems: MenuProps["items"] = [
    {
      key: "profile",
      icon: <UserOutlined />,
      label: "Hồ sơ cá nhân",
    },
    {
      key: "settings",
      icon: <SettingOutlined />,
      label: "Cài đặt hệ thống",
    },
    { type: "divider" },
    {
      key: "logout",
      icon: <LogoutOutlined />,
      label: "Đăng xuất",
      danger: true,
    },
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
          selectedKeys={[location.pathname]}
          items={menuItems}
        />
      </Sider>

      <Layout>
        <Header
          style={{ padding: 0, background: colorBgContainer }}
          className="flex justify-between items-center pr-6 shadow-sm z-10"
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: "16px", width: 64, height: 64 }}
          />

          <Dropdown
            menu={{ items: userDropdownItems, onClick: handleUserMenuClick }}
            placement="bottomRight"
            arrow
          >
            <Space className="cursor-pointer hover:bg-slate-50 px-3 py-1 rounded-md transition-colors">
              <Avatar
                src={user?.avatarUrl}
                icon={!user?.avatarUrl && <UserOutlined />}
                className="bg-blue-600"
              />
              <span className="font-medium text-gray-700 hidden sm:inline-block">
                {user?.userName || "Admin"}
              </span>
            </Space>
          </Dropdown>
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
