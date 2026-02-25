// src/layouts/AdminLayout.tsx
import { Layout, Menu, Button, theme } from "antd";
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  DashboardOutlined,
  ProjectOutlined,
  LogoutOutlined,
} from "@ant-design/icons";
import { useState } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
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
          defaultSelectedKeys={[location.pathname]}
          onClick={({ key }) => navigate(key)}
          items={[
            {
              key: "/",
              icon: <DashboardOutlined />,
              label: "Dashboard",
            },
            {
              key: "/projects",
              icon: <ProjectOutlined />,
              label: "Quản lý Dự án",
            },
          ]}
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
