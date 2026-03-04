// https://nhatdev.top
// src/pages/Profile/index.tsx
import { Card, Form, Input, Button, Avatar, message, Divider } from "antd";
import { UserOutlined, PhoneOutlined, MailOutlined } from "@ant-design/icons";
import { useAuthStore } from "../../stores/useAuthStore";
import { useState, useEffect } from "react";
import { accountApi } from "../../api/adminApi";
// 👇 1. IMPORT COMPONENT IMAGE UPLOAD CỦA BẠN
import ImageUpload from "../../components/ImageUpload";

const ProfilePage = () => {
  const { user, updateUser } = useAuthStore();
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm(); // Khởi tạo instance của Form

  // 👇 2. Dùng useWatch để lấy giá trị avatar mới nhất ngay khi vừa upload xong (để làm Live Preview)
  const currentAvatarUrl = Form.useWatch("avatarUrl", form);

  // Set giá trị mặc định cho form khi component render
  useEffect(() => {
    form.setFieldsValue({
      fullName: user?.userName,
      email: user?.email,
      avatarUrl: user?.avatarUrl,
      phoneNumber: user?.phoneNumber,
    });
  }, [user, form]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      const response: any = await accountApi.updateProfile({
        fullName: values.fullName,
        phoneNumber: values.phoneNumber,
        avatarUrl: values.avatarUrl,
      });

      if (response.success) {
        message.success("Cập nhật thông tin thành công!");
        updateUser({
          userName: values.fullName,
          avatarUrl: values.avatarUrl,
          phoneNumber: values.phoneNumber,
        });
      } else {
        message.error(response.message || "Cập nhật thất bại");
      }
    } catch (error) {
      message.error("Lỗi kết nối đến máy chủ!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card title="Hồ sơ cá nhân" variant="borderless" className="shadow-sm">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Cột trái: Ảnh đại diện (Hiển thị Live Preview) */}
          <div className="flex flex-col items-center gap-4 md:w-1/3 mt-4">
            <Avatar
              size={120}
              // Ưu tiên hiển thị ảnh vừa upload (currentAvatarUrl), nếu chưa có thì lấy ảnh cũ từ store
              src={currentAvatarUrl || user?.avatarUrl}
              icon={!(currentAvatarUrl || user?.avatarUrl) && <UserOutlined />}
              className="bg-blue-600 shadow-md"
            />
            <p className="text-gray-500 text-sm text-center">
              Ảnh đại diện xem trước
            </p>
          </div>

          {/* Cột phải: Form thông tin */}
          <div className="md:w-2/3">
            <Form
              form={form} // Kết nối form instance
              layout="vertical"
              onFinish={onFinish}
            >
              <Form.Item label="Email đăng nhập (Không thể đổi)" name="email">
                <Input
                  prefix={<MailOutlined />}
                  disabled
                  className="bg-gray-50 text-gray-500"
                />
              </Form.Item>

              <Form.Item
                label="Họ và tên"
                name="fullName"
                rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
              >
                <Input prefix={<UserOutlined />} placeholder="Nhập họ và tên" />
              </Form.Item>

              <Form.Item label="Số điện thoại" name="phoneNumber">
                <Input
                  prefix={<PhoneOutlined />}
                  placeholder="Nhập số điện thoại"
                />
              </Form.Item>

              {/* 👇 3. SỬ DỤNG COMPONENT UPLOAD ẢNH CHO AVATAR */}
              <Form.Item
                name="avatarUrl"
                label="Tải ảnh đại diện mới"
                help="Chọn ảnh từ máy tính của bạn (tối đa 2MB). Nhấn Lưu để áp dụng."
              >
                {/* Truyền prop folder="avatars" để phân loại thư mục lưu ảnh trên server */}
                <ImageUpload folder="avatars" />
              </Form.Item>

              <Divider />

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  className="bg-blue-600"
                >
                  Lưu thay đổi
                </Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ProfilePage;
