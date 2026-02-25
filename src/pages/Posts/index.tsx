// https://nhatdev.top
// src/pages/Posts/index.tsx
import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Popconfirm,
  message,
  Tag,
  Row,
  Col,
  Input,
  Select,
  Image,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  SearchOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

import postApi from "../../api/postApi";
import categoryApi from "../../api/categoryApi";
import type {
  PostDto,
  CreatePostDto,
  PostFilter,
} from "../../types/post.types";
import type { CategoryDto } from "../../types/category.types";
import PostModal from "./PostModal";

const { Option } = Select;

const PostsPage = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<PostDto[]>([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState<CategoryDto[]>([]);

  const [filters, setFilters] = useState<PostFilter>({
    pageNumber: 1,
    pageSize: 10,
    keyword: "",
    categoryId: null,
    isPublished: null,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<PostDto | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await categoryApi.getAll();
      setCategories(res.data || []);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchData = async (currentFilters: PostFilter) => {
    setLoading(true);
    try {
      const response = await postApi.getPaged(currentFilters);
      if (response && response.data) {
        setData(response.data);
        setTotal(response.totalRecords);
      }
    } catch (error) {
      message.error("Lỗi tải danh sách bài viết!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(filters);
    }, 500);
    return () => clearTimeout(timer);
  }, [filters]);

  const handleTableChange = (pagination: any) => {
    setFilters({
      ...filters,
      pageNumber: pagination.current,
      pageSize: pagination.pageSize,
    });
  };

  const handleModalSubmit = async (values: CreatePostDto) => {
    setSubmitting(true);
    try {
      if (editingItem?.id) {
        await postApi.update({ ...values, id: editingItem.id });
        message.success("Cập nhật bài viết thành công!");
      } else {
        await postApi.create(values);
        message.success("Tạo bài viết thành công!");
      }
      setModalVisible(false);
      fetchData(filters);
    } catch (error: any) {
      message.error(error.response?.data?.message || "Có lỗi xảy ra!");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await postApi.delete(id);
      message.success("Đã xóa bài viết!");
      fetchData(filters);
    } catch (error) {
      message.error("Xóa thất bại!");
    }
  };

  const columns: ColumnsType<PostDto> = [
    {
      title: "Ảnh bìa",
      dataIndex: "thumbnailUrl",
      width: 80,
      render: (url) => (
        <Image
          src={url}
          width={60}
          height={40}
          className="object-cover rounded"
          fallback="https://via.placeholder.com/60"
        />
      ),
    },
    {
      title: "Tiêu đề",
      dataIndex: "title",
      render: (text, record) => (
        <div>
          <div className="font-semibold text-blue-700">{text}</div>
          <div className="text-xs text-gray-500">{record.slug}</div>
        </div>
      ),
    },
    {
      title: "Danh mục",
      dataIndex: "categoryName",
      width: 150,
      render: (cat) => <Tag color="blue">{cat}</Tag>,
    },
    {
      title: "Lượt xem",
      dataIndex: "viewCount",
      width: 100,
      align: "center",
      render: (views) => (
        <>
          <EyeOutlined className="mr-1 text-gray-400" /> {views}
        </>
      ),
    },
    {
      title: "Trạng thái",
      dataIndex: "isPublished",
      width: 120,
      align: "center",
      render: (isPub) => (
        <Tag color={isPub ? "success" : "default"}>
          {isPub ? "Công khai" : "Bản nháp"}
        </Tag>
      ),
    },
    {
      title: "Ngày tạo",
      dataIndex: "createdAt",
      width: 120,
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
            title="Xóa bài viết?"
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
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Quản lý Bài Viết</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingItem(null);
            setModalVisible(true);
          }}
        >
          Viết bài mới
        </Button>
      </div>

      <div className="mb-5 p-4 bg-gray-50 rounded-lg">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={10}>
            <Input
              placeholder="Tìm tiêu đề bài viết..."
              value={filters.keyword}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  keyword: e.target.value,
                  pageNumber: 1,
                })
              }
              prefix={<SearchOutlined className="text-gray-400" />}
              allowClear
            />
          </Col>
          <Col xs={24} md={7}>
            <Select
              style={{ width: "100%" }}
              placeholder="Lọc theo danh mục"
              allowClear
              value={filters.categoryId}
              onChange={(val) =>
                setFilters({ ...filters, categoryId: val, pageNumber: 1 })
              }
            >
              {categories.map((c) => (
                <Option key={c.id} value={c.id}>
                  {c.name}
                </Option>
              ))}
            </Select>
          </Col>
          <Col xs={24} md={7}>
            <Select
              style={{ width: "100%" }}
              placeholder="Trạng thái"
              allowClear
              value={filters.isPublished?.toString()}
              onChange={(val) =>
                setFilters({
                  ...filters,
                  isPublished:
                    val === "true" ? true : val === "false" ? false : null,
                  pageNumber: 1,
                })
              }
            >
              <Option value="true">Đã công khai</Option>
              <Option value="false">Bản nháp</Option>
            </Select>
          </Col>
        </Row>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{
          current: filters.pageNumber,
          pageSize: filters.pageSize,
          total: total,
        }}
        onChange={handleTableChange}
      />

      <PostModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleModalSubmit}
        loading={submitting}
        initialData={editingItem}
      />
    </div>
  );
};

export default PostsPage;
