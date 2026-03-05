// src/pages/Users/index.tsx
import { useEffect, useState } from "react";
import {
  Card,
  Table,
  Button,
  Space,
  Popconfirm,
  message,
  Select,
  Avatar,
  Tooltip,
  Input,
  Modal,
  Form,
} from "antd";
import {
  UserOutlined,
  DeleteOutlined,
  SafetyCertificateOutlined,
  SearchOutlined,
  PlusOutlined,
  LockOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { userManagementApi } from "../../api/adminApi";

const ROLE_OPTIONS = [
  { value: 0, label: "Admin", color: "red" },
  { value: 1, label: "Client", color: "blue" },
];

const UsersPage = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res: any = await userManagementApi.getAllUsers();
      const items = res.data || res.Data || res.items || [];
      setUsers(items);
    } catch (error) {
      console.error("Fetch users error:", error);
      message.error("Lỗi khi tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  // 👇 ĐÃ SỬA: Gửi đi payload chứa đủ 4 trường chuẩn chỉ
  const handleCreateUser = async (values: any) => {
    setSubmitLoading(true);
    try {
      const payload = {
        fullName: values.fullName,
        email: values.email,
        password: values.password,
        confirmPassword: values.confirmPassword,
      };

      const res: any = await userManagementApi.createUser(payload);

      const isSuccess =
        res?.succeeded ||
        res?.success ||
        res?.isSuccess ||
        res.ok ||
        res.status === 200;

      if (isSuccess) {
        message.success("Tạo tài khoản thành công!");
        setIsModalOpen(false);
        form.resetFields();
        fetchUsers();
      } else {
        message.error(res?.message || "Không thể tạo tài khoản!");
      }
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message ||
        "Lỗi hệ thống hoặc định dạng không hợp lệ!";
      message.error(`Từ chối: ${errorMsg}`);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: number) => {
    try {
      const res: any = await userManagementApi.updateRole(userId, newRole);

      const isSuccess =
        res?.succeeded ||
        res?.success ||
        res?.isSuccess ||
        res.ok ||
        res.status === 200;

      if (isSuccess) {
        message.success(res?.message || "Cập nhật quyền thành công!");
        fetchUsers();
      } else {
        message.error(res?.message || "Không thể cập nhật quyền!");
      }
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || "Lỗi hệ thống khi cập nhật quyền!";
      message.error(errorMsg);
      fetchUsers();
    }
  };

  const handleDelete = async (userId: string) => {
    try {
      const res: any = await userManagementApi.deleteUser(userId);

      const isSuccess =
        res?.succeeded ||
        res?.success ||
        res?.isSuccess ||
        res.ok ||
        res.status === 200;

      if (isSuccess) {
        message.success(res?.message || "Đã xóa người dùng!");
        fetchUsers();
      } else {
        message.error(res?.message || "Xóa thất bại!");
      }
    } catch (error: any) {
      const errorMsg =
        error.response?.data?.message || "Lỗi khi xóa người dùng!";
      message.error(errorMsg);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchText.toLowerCase()),
  );

  const columns = [
    {
      title: "Người dùng",
      key: "user",
      render: (_: any, record: any) => (
        <Space>
          <Avatar
            src={record.avatarUrl}
            icon={<UserOutlined />}
            className="bg-blue-500"
          />
          <div>
            <div className="font-bold flex items-center gap-2">
              {record.fullName}
              {record.role === "Admin" && (
                <Tooltip title="Quản trị viên">
                  <SafetyCertificateOutlined className="text-red-500" />
                </Tooltip>
              )}
            </div>
            <div className="text-gray-500 text-sm">{record.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phoneNumber",
      key: "phoneNumber",
      render: (text: string) =>
        text || <span className="text-gray-400 italic">Chưa cập nhật</span>,
    },
    {
      title: "Vai trò (Role)",
      key: "role",
      width: 150,
      render: (_: any, record: any) => {
        const currentRole = record.role === "Admin" ? 0 : 1;
        return (
          <Select
            value={currentRole}
            options={ROLE_OPTIONS}
            onChange={(val) => handleRoleChange(record.id, val)}
            className="w-full"
          />
        );
      },
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center" as const,
      width: 100,
      render: (_: any, record: any) => (
        <Popconfirm
          title="Xóa tài khoản này?"
          description="Hành động này sẽ xóa hoàn toàn khỏi cơ sở dữ liệu."
          onConfirm={() => handleDelete(record.id)}
          okText="Xóa vĩnh viễn"
          cancelText="Hủy"
          okButtonProps={{ danger: true }}
        >
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            disabled={record.role === "Admin"}
          />
        </Popconfirm>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <Card
        title="Quản lý Tài khoản (Users)"
        variant="borderless"
        className="shadow-sm"
      >
        <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
          <Input.Search
            placeholder="Tìm theo Họ tên hoặc Email..."
            allowClear
            onChange={(e) => setSearchText(e.target.value)}
            className="max-w-md"
            size="large"
            enterButton={<SearchOutlined />}
          />
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => setIsModalOpen(true)}
          >
            Thêm tài khoản
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredUsers}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title="Tạo tài khoản mới"
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        confirmLoading={submitLoading}
        okText="Tạo tài khoản"
        cancelText="Hủy bỏ"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreateUser}
          className="mt-4"
        >
          <Form.Item
            label="Họ và Tên"
            name="fullName"
            rules={[{ required: true, message: "Vui lòng nhập họ tên!" }]}
          >
            <Input
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Ví dụ: Nguyễn Văn A"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Email đăng nhập"
            name="email"
            rules={[
              { required: true, message: "Vui lòng nhập email!" },
              { type: "email", message: "Định dạng email không hợp lệ!" },
            ]}
          >
            <Input
              prefix={<MailOutlined className="text-gray-400" />}
              placeholder="Ví dụ: nhatdev@gmail.com"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Mật khẩu"
            name="password"
            rules={[
              { required: true, message: "Vui lòng nhập mật khẩu!" },
              { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Nhập mật khẩu"
              size="large"
            />
          </Form.Item>

          {/* 👇 ĐÃ THÊM: Ô Xác nhận mật khẩu và logic Validate khớp mật khẩu */}
          <Form.Item
            label="Xác nhận mật khẩu"
            name="confirmPassword"
            dependencies={["password"]}
            rules={[
              { required: true, message: "Vui lòng xác nhận mật khẩu!" },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(
                    new Error("Mật khẩu xác nhận không khớp!"),
                  );
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Nhập lại mật khẩu"
              size="large"
            />
          </Form.Item>

          <div className="text-sm text-gray-500 italic mt-2">
            * Tài khoản mới tạo sẽ mặc định mang quyền "Client". Bạn có thể cấp
            quyền Admin trên bảng quản lý sau khi tạo.
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default UsersPage;
