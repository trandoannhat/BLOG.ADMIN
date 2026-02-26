// https://nhatdev.top
// src/pages/Categories/index.tsx
import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Popconfirm,
  message,
  Card,
  Input,
  Row,
  Col,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import categoryApi from "../../api/categoryApi";
import type {
  CategoryDto,
  CreateCategoryDto,
} from "../../types/category.types";

import CategoryModal from "./CategoryModal";

const CategoriesPage = () => {
  const [loading, setLoading] = useState(false);

  // State chứa data dạng cây cho Table
  const [treeData, setTreeData] = useState<CategoryDto[]>([]);
  // State chứa data phẳng để truyền vào dropdown Modal
  const [flatData, setFlatData] = useState<CategoryDto[]>([]);

  const [keyword, setKeyword] = useState("");

  // Modal State
  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<CategoryDto | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // 1. Fetch Data
  const fetchData = async () => {
    setLoading(true);
    try {
      // Gọi cả 2 API: getTree cho Table và getAll cho Dropdown
      // Tùy API của bạn cấu hình thế nào, ở đây tôi dùng Promise.all cho tối ưu
      const [treeRes, flatRes] = await Promise.all([
        categoryApi.getTree(),
        categoryApi.getAll(),
      ]);

      if (treeRes?.data) setTreeData(treeRes.data);
      if (flatRes?.data) setFlatData(flatRes.data);
    } catch (error) {
      console.error("LỖI CHI TIẾT:", error);
      message.error("Lỗi tải danh mục!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. Handlers
  const handleModalSubmit = async (values: CreateCategoryDto) => {
    setSubmitting(true);
    try {
      if (editingItem?.id) {
        await categoryApi.update({ ...values, id: editingItem.id });
        message.success("Cập nhật thành công!");
      } else {
        await categoryApi.create(values);
        message.success("Tạo mới thành công!");
      }
      setModalVisible(false);
      fetchData(); // Load lại data
    } catch (error: any) {
      message.error(error.response?.data?.message || "Có lỗi xảy ra!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await categoryApi.delete(id);
      message.success("Đã xóa danh mục!");
      fetchData();
    } catch (error: any) {
      const msg = error.response?.data?.message || "Xóa thất bại!";
      message.error(msg);
    }
  };

  // Lọc Table theo Keyword ở Frontend (Vì đang dùng Tree Data)
  const filteredData = treeData.filter((item) =>
    item.name.toLowerCase().includes(keyword.toLowerCase()),
  );

  // 3. Columns
  const columns: ColumnsType<CategoryDto> = [
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
      render: (text, record) => (
        <div>
          <div className="font-semibold text-blue-700">{text}</div>
          <div className="text-xs text-gray-400 italic">{record.slug}</div>
        </div>
      ),
    },
    {
      title: "Mô tả",
      dataIndex: "description",
      key: "description",
      ellipsis: true,
    },
    {
      title: "Bài viết",
      dataIndex: "postCount",
      key: "postCount",
      align: "center",
      width: 100,
      render: (count) => <span className="font-bold">{count}</span>,
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      width: 150,
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 100,
      align: "center",
      render: (_, record) => (
        <Space size="small">
          <Button
            icon={<EditOutlined />}
            size="small"
            onClick={() => {
              setEditingItem(record);
              setModalVisible(true);
            }}
          />
          <Popconfirm
            title="Xóa danh mục?"
            description="Các danh mục con (nếu có) sẽ trở thành danh mục gốc."
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button icon={<DeleteOutlined />} danger size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title="Quản Lý Danh Mục Blog"
      variant="borderless"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingItem(null);
            setModalVisible(true);
          }}
        >
          Thêm mới
        </Button>
      }
    >
      <div className="mb-5 p-4 bg-gray-50 border border-gray-100 rounded-lg">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={12}>
            <div className="text-xs font-semibold text-gray-500 mb-1">
              TỪ KHÓA
            </div>
            <Input
              placeholder="Tìm tên danh mục..."
              prefix={<FilterOutlined className="text-gray-400" />}
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              allowClear
            />
          </Col>
          <Col xs={24} md={12} className="flex items-end">
            <Button
              icon={<ReloadOutlined />}
              onClick={() => {
                setKeyword("");
                fetchData();
              }}
            >
              Làm mới
            </Button>
          </Col>
        </Row>
      </div>

      <Table
        columns={columns}
        dataSource={filteredData}
        rowKey="id"
        loading={loading}
        pagination={false} // Tắt phân trang vì cấu trúc Tree không phù hợp phân trang cứng
      />

      <CategoryModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleModalSubmit}
        loading={submitting}
        initialData={editingItem}
        categories={flatData} // Truyền data phẳng vào cho Modal
      />
    </Card>
  );
};

export default CategoriesPage;
