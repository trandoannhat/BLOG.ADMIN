// src/pages/Projects/index.tsx
import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Space,
  Popconfirm,
  message,
  Image,
  Card,
  Input,
  Tooltip,
  Select,
  DatePicker,
  Row,
  Col,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  ReloadOutlined,
  StarFilled,
  StarOutlined,
  FilterOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import type { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";

import projectApi from "../../api/projectApi";
import type {
  ProjectDto,
  CreateProjectDto,
  ProjectFilter,
} from "../../types/project.types";
import ProjectModal from "./ProjectModal";

const { Option } = Select;
const { RangePicker } = DatePicker;

const ProjectsPage = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<ProjectDto[]>([]);
  const [total, setTotal] = useState(0);

  const [filters, setFilters] = useState<ProjectFilter>({
    pageNumber: 1,
    pageSize: 10,
    keyword: "",
    isFeatured: null,
    fromDate: undefined,
    toDate: undefined,
  });

  const [modalVisible, setModalVisible] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectDto | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async (currentFilters: ProjectFilter) => {
    setLoading(true);
    try {
      const response = await projectApi.getAll(currentFilters);
      if (response && response.data) {
        setData(response.data);
        setTotal(response.totalRecords);
      }
    } catch (error) {
      console.error(error);
      message.error("Không thể tải dữ liệu. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData(filters);
    }, 600);
    return () => clearTimeout(timer);
  }, [filters]);

  const handleTableChange = (newPagination: any) => {
    setFilters({
      ...filters,
      pageNumber: newPagination.current,
      pageSize: newPagination.pageSize,
    });
  };

  const handleKeywordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilters({ ...filters, keyword: e.target.value, pageNumber: 1 });
  };

  const handleFeaturedChange = (value: string) => {
    let val: boolean | null = null;
    if (value === "true") val = true;
    if (value === "false") val = false;
    setFilters({ ...filters, isFeatured: val, pageNumber: 1 });
  };

  const handleDateChange = (dates: any) => {
    if (dates && dates.length === 2) {
      setFilters({
        ...filters,
        fromDate: dates[0].format("YYYY-MM-DD"),
        toDate: dates[1].format("YYYY-MM-DD"),
        pageNumber: 1,
      });
    } else {
      setFilters({
        ...filters,
        fromDate: undefined,
        toDate: undefined,
        pageNumber: 1,
      });
    }
  };

  const handleApplyFilter = () => {
    fetchData(filters);
  };

  const handleRefresh = () => {
    setFilters({
      pageNumber: 1,
      pageSize: 10,
      keyword: "",
      isFeatured: null,
      fromDate: undefined,
      toDate: undefined,
    });
  };

  const handleModalSubmit = async (values: CreateProjectDto) => {
    setSubmitting(true);
    try {
      if (editingProject?.id) {
        await projectApi.update({ ...values, id: editingProject.id });
        message.success("Cập nhật dự án thành công!");
      } else {
        await projectApi.create(values);
        message.success("Thêm mới dự án thành công!");
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
      await projectApi.delete(id);
      message.success("Đã xóa dự án!");
      fetchData(filters);
    } catch (error) {
      message.error("Xóa thất bại!");
    }
  };

  const columns: ColumnsType<ProjectDto> = [
    {
      title: "Ảnh",
      dataIndex: "thumbnailUrl",
      width: 80,
      render: (url) => (
        <Image
          src={url || "error"}
          width={60}
          height={40}
          className="rounded border object-cover"
          fallback="https://via.placeholder.com/150"
        />
      ),
    },
    {
      title: "Tên dự án",
      dataIndex: "name",
      render: (text, record) => (
        <div>
          <div className="font-bold text-blue-600">{text}</div>
          {record.clientName && (
            <div className="text-xs text-gray-500 mt-1">
              KH: {record.clientName}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Nổi bật",
      dataIndex: "isFeatured",
      width: 90,
      align: "center",
      render: (featured) =>
        featured ? (
          <Tooltip title="Dự án tiêu biểu">
            <StarFilled style={{ color: "#fadb14", fontSize: 18 }} />
          </Tooltip>
        ) : (
          <StarOutlined style={{ color: "#d9d9d9", fontSize: 18 }} />
        ),
    },
    {
      title: "Thời gian",
      width: 150,
      render: (_, record) => (
        <div className="text-xs">
          <div className="font-medium text-gray-700">
            {dayjs(record.startDate).format("DD/MM/YYYY")}
          </div>
          {record.completedDate && (
            <div className="text-gray-400">
              → {dayjs(record.completedDate).format("DD/MM/YYYY")}
            </div>
          )}
        </div>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 100,
      align: "center",
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="Chỉnh sửa">
            <Button
              type="text"
              icon={<EditOutlined className="text-blue-500" />}
              onClick={() => {
                setEditingProject(record);
                setModalVisible(true);
              }}
            />
          </Tooltip>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn có chắc muốn xóa?"
              description="Hành động này không thể hoàn tác"
              onConfirm={() => handleDelete(record.id)}
              okText="Xóa"
              cancelText="Hủy"
              okButtonProps={{ danger: true }}
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title={<span className="text-lg font-bold">Quản Lý Dự Án</span>}
      variant="borderless"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingProject(null);
            setModalVisible(true);
          }}
          className="bg-blue-600 hover:bg-blue-700"
        >
          Thêm mới dự án
        </Button>
      }
    >
      <div className="mb-6 p-4 bg-gray-50 border border-gray-100 rounded-xl shadow-sm">
        <Row gutter={[16, 16]}>
          <Col xs={24} md={7}>
            <div className="text-xs font-semibold text-gray-500 mb-1">
              TỪ KHÓA
            </div>
            <Input
              placeholder="Tìm tên, khách hàng..."
              prefix={<FilterOutlined className="text-gray-400" />}
              value={filters.keyword}
              onChange={handleKeywordChange}
              allowClear
              onPressEnter={handleApplyFilter}
            />
          </Col>

          <Col xs={24} md={5}>
            <div className="text-xs font-semibold text-gray-500 mb-1">
              TRẠNG THÁI
            </div>
            <Select
              style={{ width: "100%" }}
              value={
                filters.isFeatured === null
                  ? "all"
                  : filters.isFeatured
                    ? "true"
                    : "false"
              }
              onChange={handleFeaturedChange}
            >
              <Option value="all">Tất cả</Option>
              <Option value="true">⭐ Nổi bật</Option>
              <Option value="false">☆ Bình thường</Option>
            </Select>
          </Col>

          <Col xs={24} md={7}>
            <div className="text-xs font-semibold text-gray-500 mb-1">
              KHOẢNG THỜI GIAN
            </div>
            <RangePicker
              style={{ width: "100%" }}
              format="DD/MM/YYYY"
              onChange={handleDateChange}
              value={
                filters.fromDate
                  ? [dayjs(filters.fromDate), dayjs(filters.toDate)]
                  : null
              }
              placeholder={["Từ ngày", "Đến ngày"]}
            />
          </Col>

          <Col xs={24} md={5}>
            <div className="text-xs font-semibold text-gray-500 mb-1">
              THAO TÁC
            </div>
            <div className="flex gap-2 w-full">
              <Button
                type="primary"
                icon={<SearchOutlined />}
                onClick={handleApplyFilter}
                className="flex-1"
              >
                Tìm
              </Button>
              <Tooltip title="Làm mới bộ lọc">
                <Button
                  icon={<ReloadOutlined />}
                  onClick={handleRefresh}
                  className="flex-1"
                >
                  Reset
                </Button>
              </Tooltip>
            </div>
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
          showSizeChanger: true,
          showTotal: (total, range) =>
            `${range[0]}-${range[1]} / ${total} dự án`,
          locale: { items_per_page: " / trang" },
        }}
        onChange={handleTableChange}
        scroll={{ x: 800 }}
      />
      <ProjectModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onSubmit={handleModalSubmit}
        loading={submitting}
        initialData={editingProject}
      />
    </Card>
  );
};

export default ProjectsPage;
