// src/pages/PartnerAds/index.tsx
import { useEffect, useState } from "react";
import {
  Card,
  Table,
  Button,
  Space,
  Popconfirm,
  message,
  Tag,
  Modal,
  Form,
  Input,
  Select,
  Switch,
  Image,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  LinkOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import { partnerAdApi } from "../../api/partnerAdApi";
import dayjs from "dayjs";

// Khớp với Enum AdPosition bên C#
const POSITION_OPTIONS = [
  { value: 1, label: "Sidebar Bài viết", color: "blue" },
  { value: 2, label: "Dưới Footer Bài viết", color: "green" },
  { value: 3, label: "Banner Trang chủ", color: "purple" },
  { value: 4, label: "Trang Công cụ", color: "orange" },
];

const PartnerAdsPage = () => {
  const [ads, setAds] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [editingAd, setEditingAd] = useState<any>(null); // Null = Thêm mới, Có data = Sửa
  const [form] = Form.useForm();

  useEffect(() => {
    fetchAds();
  }, []);

  const fetchAds = async () => {
    setLoading(true);
    try {
      const res: any = await partnerAdApi.getAll();
      const items = res.data || res.Data || res.items || res || [];
      setAds(Array.isArray(items) ? items : []);
    } catch (error) {
      message.error("Lỗi khi tải danh sách quảng cáo");
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (record?: any) => {
    if (record) {
      setEditingAd(record);
      form.setFieldsValue(record);
    } else {
      setEditingAd(null);
      form.resetFields();
      form.setFieldValue("isActive", true); // Mặc định bật khi thêm mới
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: any) => {
    setSubmitLoading(true);
    try {
      if (editingAd) {
        values.id = editingAd.id;
        await partnerAdApi.update(editingAd.id, values);
        message.success("Cập nhật quảng cáo thành công!");
      } else {
        await partnerAdApi.create(values);
        message.success("Thêm quảng cáo thành công!");
      }
      setIsModalOpen(false);
      fetchAds();
    } catch (error: any) {
      message.error(error.response?.data?.message || "Có lỗi xảy ra!");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleToggle = async (id: string) => {
    try {
      await partnerAdApi.toggleActive(id);
      message.success("Đã thay đổi trạng thái!");
      fetchAds();
    } catch (error) {
      message.error("Không thể thay đổi trạng thái");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await partnerAdApi.delete(id);
      message.success("Đã xóa quảng cáo!");
      fetchAds();
    } catch (error) {
      message.error("Lỗi khi xóa quảng cáo!");
    }
  };

  const columns = [
    {
      title: "Banner / Tiêu đề",
      key: "info",
      render: (_: any, record: any) => (
        <Space className="items-start">
          {record.imageUrl ? (
            <Image
              width={80}
              height={50}
              src={record.imageUrl}
              className="object-cover rounded border"
              fallback="https://via.placeholder.com/80x50?text=No+Image"
            />
          ) : (
            <div className="w-20 h-12 bg-gray-100 flex items-center justify-center rounded border text-gray-400">
              <PictureOutlined />
            </div>
          )}
          <div>
            <div className="font-bold text-gray-800">{record.title}</div>
            <a
              href={record.targetUrl}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-blue-500 hover:underline flex items-center gap-1 mt-1"
            >
              <LinkOutlined /> Xem Link đích
            </a>
          </div>
        </Space>
      ),
    },
    {
      title: "Vị trí đặt",
      dataIndex: "position",
      key: "position",
      render: (pos: number) => {
        const option = POSITION_OPTIONS.find((o) => o.value === pos);
        return (
          <Tag color={option?.color}>{option?.label || "Không xác định"}</Tag>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (date: string) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Trạng thái",
      key: "isActive",
      render: (_: any, record: any) => (
        <Switch
          checked={record.isActive}
          onChange={() => handleToggle(record.id)}
          checkedChildren="Đang chạy"
          unCheckedChildren="Đã tắt"
        />
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center" as const,
      render: (_: any, record: any) => (
        <Space>
          <Button
            type="text"
            className="text-blue-600"
            icon={<EditOutlined />}
            onClick={() => handleOpenModal(record)}
          />
          <Popconfirm
            title="Xóa quảng cáo này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <Card
        title="Quản lý Đối tác & Quảng cáo"
        variant="borderless"
        className="shadow-sm"
      >
        <div className="flex justify-end mb-4">
          <Button
            type="primary"
            size="large"
            icon={<PlusOutlined />}
            onClick={() => handleOpenModal()}
          >
            Thêm Quảng cáo
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={ads}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingAd ? "Cập nhật Quảng cáo" : "Thêm Quảng cáo mới"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={() => form.submit()}
        confirmLoading={submitLoading}
        width={600}
        okText="Lưu lại"
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          className="mt-4"
        >
          <Form.Item
            label="Tên chiến dịch / Tiêu đề"
            name="title"
            rules={[{ required: true, message: "Vui lòng nhập tiêu đề!" }]}
          >
            <Input placeholder="VD: Khuyến mãi VPS iNet" size="large" />
          </Form.Item>

          <Form.Item label="Link ảnh Banner (Tùy chọn)" name="imageUrl">
            <Input
              placeholder="Dán link ảnh (https://...) hoặc bỏ trống nếu chỉ dùng text"
              size="large"
            />
          </Form.Item>

          <Form.Item
            label="Link Affiliate đích (Target URL)"
            name="targetUrl"
            rules={[{ required: true, message: "Vui lòng dán link đích!" }]}
          >
            <Input
              placeholder="VD: https://inet.vn/vps?aff=168833"
              size="large"
            />
          </Form.Item>

          <div className="flex gap-4">
            <Form.Item
              label="Vị trí hiển thị"
              name="position"
              rules={[{ required: true, message: "Vui lòng chọn vị trí!" }]}
              className="flex-1"
            >
              <Select
                options={POSITION_OPTIONS}
                size="large"
                placeholder="Chọn vị trí..."
              />
            </Form.Item>

            <Form.Item
              label="Trạng thái"
              name="isActive"
              valuePropName="checked"
            >
              <Switch checkedChildren="Bật" unCheckedChildren="Tắt" />
            </Form.Item>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default PartnerAdsPage;
