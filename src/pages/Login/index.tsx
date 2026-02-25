// src/pages/Login/index.tsx
import { useState } from "react";
import { Form, Input, Button, Card, Typography, message, Alert } from "antd";
import { UserOutlined, LockOutlined, LoginOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import authApi, { type LoginRequest } from "../../api/authApi";
import { useAuthStore } from "../../stores/useAuthStore";

const { Title, Text } = Typography;

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // Hàm xử lý khi bấm nút Đăng nhập
  const onFinish = async (values: LoginRequest) => {
    setLoading(true);
    setErrorMsg("");
    try {
      // 1. Gọi API
      const response = await authApi.login(values);

      // 2. Kiểm tra kết quả
      if (response.success && response.data) {
        message.success("Đăng nhập thành công! 🎉");

        // 3. Lưu vào Store (Zustand)
        // Lưu ý: response.data chứa cả thông tin user và token
        login(response.data, response.data.jwToken);

        // 4. Chuyển hướng vào trang Admin
        navigate("/", { replace: true });
      } else {
        setErrorMsg(response.message || "Đăng nhập thất bại");
      }
    } catch (error: any) {
      // Xử lý lỗi từ server (VD: 400 Bad Request)
      const msg =
        error.response?.data?.message || "Có lỗi xảy ra, vui lòng thử lại";
      setErrorMsg(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Logo hoặc Tên thương hiệu */}
      <div className="text-center">
        <Title level={2} style={{ color: "#1f2937", marginBottom: 0 }}>
          NhatSoft Admin
        </Title>
        <Text type="secondary">Hệ thống quản trị nội dung</Text>
      </div>

      <Card
        className="w-full max-w-[400px] shadow-xl border-t-4 border-t-blue-600"
        variant="borderless"
      >
        <Title level={4} className="text-center !mb-6">
          Đăng Nhập
        </Title>

        {/* Hiển thị lỗi nếu có */}
        {errorMsg && (
          <Alert message={errorMsg} type="error" showIcon className="mb-4" />
        )}

        <Form
          name="login_form"
          initialValues={{ remember: true }}
          onFinish={onFinish}
          layout="vertical"
          size="large"
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập Email!" },
              { type: "email", message: "Email không hợp lệ!" },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Mật khẩu" />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="w-full bg-blue-600 hover:bg-blue-500"
              loading={loading}
              icon={<LoginOutlined />}
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>
      </Card>

      <Text type="secondary" className="text-xs">
        © 2026 NhatDev. All rights reserved.
      </Text>
    </div>
  );
};

export default LoginPage;
