// https://nhatdev.top
// src/pages/Donations/index.tsx
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
  Switch,
  Tag,
  Select,
  Modal,
  Descriptions,
} from "antd";
import {
  DeleteOutlined,
  ReloadOutlined,
  FilterOutlined,
  EyeOutlined, // 👇 THÊM ICON CON MẮT
} from "@ant-design/icons";
import type { ColumnsType, TablePaginationConfig } from "antd/es/table";
import dayjs from "dayjs";
import donationApi from "../../api/donationApi";
import type { DonationDto, DonationFilter } from "../../types/donation.types";

const DonationsPage = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<DonationDto[]>([]);
  const [total, setTotal] = useState(0);

  // State bộ lọc (Filter)
  const [filter, setFilter] = useState<DonationFilter>({
    pageNumber: 1,
    pageSize: 10,
    keyword: "",
    isConfirmed: undefined, // Đã fix lỗi null
  });

  // 👇 STATE CHO MODAL CHI TIẾT
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState<DonationDto | null>(null);

  // Hàm format tiền tệ
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  // 1. Lấy dữ liệu
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await donationApi.getPaged(filter);
      if (res?.data) {
        setData(res.data);
        setTotal(res.totalRecords);
      }
    } catch (error) {
      message.error("Lỗi tải danh sách Donate!");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.pageNumber, filter.pageSize, filter.isConfirmed]);

  // 2. Handlers
  const handleTableChange = (pagination: TablePaginationConfig) => {
    setFilter((prev) => ({
      ...prev,
      pageNumber: pagination.current || 1,
      pageSize: pagination.pageSize || 10,
    }));
  };

  const handleToggleApproval = async (id: string, checked: boolean) => {
    try {
      await donationApi.toggleApproval(id);
      message.success(checked ? "Đã duyệt lên web!" : "Đã gỡ khỏi web!");
      fetchData();
    } catch (error: any) {
      message.error(error.response?.data?.message || "Cập nhật thất bại!");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await donationApi.delete(id);
      message.success("Đã xóa giao dịch!");
      fetchData();
    } catch (error: any) {
      message.error(error.response?.data?.message || "Xóa thất bại!");
    }
  };

  // 👇 HÀM MỞ MODAL XEM CHI TIẾT
  const handleViewDetails = (record: DonationDto) => {
    setSelectedItem(record);
    setViewModalVisible(true);
  };

  // 3. Cấu hình Cột
  const columns: ColumnsType<DonationDto> = [
    {
      title: "Người gửi",
      dataIndex: "donorName",
      key: "donorName",
      render: (text) => (
        <span className="font-semibold text-blue-700">{text}</span>
      ),
    },
    {
      title: "Số tiền",
      dataIndex: "amount",
      key: "amount",
      align: "right",
      render: (amount: number) => (
        <span className="font-bold text-green-600">
          {formatCurrency(amount)}
        </span>
      ),
    },
    {
      title: "Kênh",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: "Lời nhắn",
      dataIndex: "message",
      key: "message",
      ellipsis: true, // Nếu dài quá sẽ hiển thị ...
    },
    {
      title: "Ngày gửi",
      dataIndex: "createdAt",
      width: 150,
      render: (date) => dayjs(date).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Duyệt",
      key: "isConfirmed",
      align: "center",
      width: 120,
      render: (_, record) => (
        <Switch
          checked={record.isConfirmed}
          onChange={(checked) => handleToggleApproval(record.id, checked)}
          checkedChildren="Bật"
          unCheckedChildren="Tắt"
        />
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      width: 100,
      align: "center",
      render: (_, record) => (
        <Space size="small">
          {/* NÚT XEM CHI TIẾT */}
          <Button
            icon={<EyeOutlined />}
            size="small"
            title="Xem chi tiết"
            onClick={() => handleViewDetails(record)}
          />
          <Popconfirm
            title="Xóa giao dịch này?"
            description="Thao tác này không thể hoàn tác."
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
            okButtonProps={{ danger: true }}
          >
            <Button icon={<DeleteOutlined />} danger size="small" title="Xóa" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <>
      <Card title="Quản Lý Ủng Hộ (Donations)" variant="borderless">
        {/* KHU VỰC FILTER */}
        <div className="mb-5 p-4 bg-gray-50 border border-gray-100 rounded-lg">
          <Row gutter={[16, 16]}>
            <Col xs={24} md={10}>
              <div className="text-xs font-semibold text-gray-500 mb-1">
                TỪ KHÓA
              </div>
              <Input.Search
                placeholder="Tìm tên, lời nhắn, phương thức..."
                prefix={<FilterOutlined className="text-gray-400" />}
                value={filter.keyword}
                onChange={(e) =>
                  setFilter({ ...filter, keyword: e.target.value })
                }
                onSearch={fetchData}
                enterButton
                allowClear
              />
            </Col>
            <Col xs={24} md={6}>
              <div className="text-xs font-semibold text-gray-500 mb-1">
                TRẠNG THÁI
              </div>
              <Select
                className="w-full"
                value={
                  filter.isConfirmed === undefined ? "" : filter.isConfirmed
                }
                onChange={(value) =>
                  setFilter({
                    ...filter,
                    isConfirmed: value === "" ? undefined : (value as boolean),
                    pageNumber: 1,
                  })
                }
                options={[
                  { value: "", label: "Tất cả" },
                  { value: true, label: "Đã duyệt" },
                  { value: false, label: "Chờ duyệt" },
                ]}
              />
            </Col>
            <Col xs={24} md={8} className="flex items-end justify-end">
              <Button
                icon={<ReloadOutlined />}
                onClick={() => {
                  setFilter({
                    pageNumber: 1,
                    pageSize: 10,
                    keyword: "",
                    isConfirmed: undefined,
                  });
                }}
              >
                Làm mới
              </Button>
            </Col>
          </Row>
        </div>

        {/* BẢNG DỮ LIỆU */}
        <Table
          columns={columns}
          dataSource={data}
          rowKey="id"
          loading={loading}
          pagination={{
            current: filter.pageNumber,
            pageSize: filter.pageSize,
            total: total,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} bản ghi`,
          }}
          onChange={handleTableChange}
        />
      </Card>

      {/* 👇 MODAL XEM CHI TIẾT */}
      <Modal
        title="Chi tiết thông tin ủng hộ"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Đóng
          </Button>,
        ]}
      >
        {selectedItem && (
          <Descriptions
            column={1}
            bordered
            size="small"
            labelStyle={{ width: "130px", fontWeight: "bold" }}
          >
            <Descriptions.Item label="Người gửi">
              <span className="text-blue-700 font-semibold">
                {selectedItem.donorName}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Số tiền">
              <span className="font-bold text-green-600 text-lg">
                {formatCurrency(selectedItem.amount)}
              </span>
            </Descriptions.Item>
            <Descriptions.Item label="Kênh thanh toán">
              <Tag color="blue">{selectedItem.paymentMethod}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày gửi">
              {dayjs(selectedItem.createdAt).format("DD/MM/YYYY HH:mm:ss")}
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái web">
              {selectedItem.isConfirmed ? (
                <Tag color="success">Đã duyệt hiển thị</Tag>
              ) : (
                <Tag color="warning">Đang chờ duyệt</Tag>
              )}
            </Descriptions.Item>
            <Descriptions.Item label="Lời nhắn đính kèm">
              <div className="whitespace-pre-wrap bg-gray-50 p-3 rounded-md border border-gray-200 mt-1 italic text-gray-700">
                {selectedItem.message || "Không có lời nhắn"}
              </div>
            </Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </>
  );
};

export default DonationsPage;
