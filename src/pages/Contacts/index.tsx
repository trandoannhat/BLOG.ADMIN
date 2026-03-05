// src/pages/Contacts/index.tsx
import { useEffect, useState } from "react";
import {
  Card,
  Table,
  Tag,
  Button,
  Input,
  Select,
  Space,
  Modal,
  Form,
  Popconfirm,
  message,
  Typography,
} from "antd";
import { SearchOutlined, EyeOutlined, DeleteOutlined } from "@ant-design/icons";
import { contactApi } from "../../api/contactApi";
import dayjs from "dayjs";

const { Text } = Typography;
const { TextArea } = Input;

// Định nghĩa trạng thái (Bạn có thể điều chỉnh cho khớp với Enum bên C#)
const STATUS_OPTIONS = [
  { value: 0, label: "Mới nhận", color: "blue" },
  { value: 1, label: "Đang xử lý", color: "warning" },
  { value: 2, label: "Đã hoàn thành", color: "success" },
  { value: 3, label: "Từ chối / Spam", color: "error" },
];

const ContactsPage = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // 👇 ĐÃ SỬA: Khai báo rõ ràng status có thể là undefined
  const [filter, setFilter] = useState({
    pageNumber: 1,
    pageSize: 10,
    keyword: "",
    status: undefined as number | undefined,
  });

  // State cho Modal Xem & Cập nhật
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [form] = Form.useForm();
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, [filter.pageNumber, filter.pageSize, filter.status]);

  const fetchContacts = async () => {
    setLoading(true);
    try {
      const res: any = await contactApi.getAll(filter);

      // Xử lý linh hoạt việc C# trả về ApiResponse hay trả thẳng Object
      const items =
        res.data?.items || res.data?.Data || res.Data || res.items || [];
      const totalRecords =
        res.data?.total ||
        res.data?.TotalRecords ||
        res.TotalRecords ||
        res.total ||
        0;

      setData(items);
      setTotal(totalRecords);
    } catch (error) {
      message.error("Không thể tải danh sách liên hệ!");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setFilter({ ...filter, keyword: value, pageNumber: 1 });
    // Phải gọi thủ công vì useEffect không theo dõi filter.keyword để tránh gọi API liên tục khi đang gõ
    setTimeout(fetchContacts, 100);
  };

  const handleDelete = async (id: string) => {
    try {
      await contactApi.delete(id);
      message.success("Đã xóa liên hệ!");
      fetchContacts();
    } catch (error) {
      message.error("Lỗi khi xóa!");
    }
  };

  const openModal = (record: any) => {
    setSelectedContact(record);
    form.setFieldsValue({
      status: record.status || 0,
      adminNote: record.adminNote || "",
    });
    setIsModalVisible(true);
  };

  const handleUpdateStatus = async (values: any) => {
    setSubmitLoading(true);
    try {
      const payload = {
        id: selectedContact.id,
        status: values.status,
        adminNote: values.adminNote,
      };
      await contactApi.updateStatus(selectedContact.id, payload);
      message.success("Cập nhật trạng thái thành công!");
      setIsModalVisible(false);
      fetchContacts();
    } catch (error) {
      message.error("Lỗi khi cập nhật!");
    } finally {
      setSubmitLoading(false);
    }
  };

  const columns = [
    {
      title: "Khách hàng",
      dataIndex: "fullName",
      key: "fullName",
      render: (text: string, record: any) => (
        <div>
          <div className="font-bold">{text}</div>
          <div className="text-gray-500 text-sm">{record.email}</div>
        </div>
      ),
    },
    {
      title: "Số điện thoại",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Dịch vụ quan tâm",
      dataIndex: "subject",
      key: "subject",
      render: (text: string) => <Tag color="purple">{text || "Chưa chọn"}</Tag>,
    },
    {
      title: "Ngày gửi",
      dataIndex: "createdAt",
      key: "createdAt",
      render: (val: string) => dayjs(val).format("DD/MM/YYYY HH:mm"),
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: number) => {
        const option =
          STATUS_OPTIONS.find((o) => o.value === status) || STATUS_OPTIONS[0];
        return <Tag color={option.color}>{option.label}</Tag>;
      },
    },
    {
      title: "Thao tác",
      key: "action",
      align: "center" as const,
      render: (_: any, record: any) => (
        <Space size="middle">
          <Button
            type="text"
            className="text-blue-600"
            icon={<EyeOutlined />}
            onClick={() => openModal(record)}
          >
            Xử lý
          </Button>
          <Popconfirm
            title="Xóa liên hệ này?"
            description="Bạn có chắc chắn muốn xóa vĩnh viễn không?"
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
        title="Quản lý Liên hệ / Yêu cầu tư vấn"
        variant="borderless"
        className="shadow-sm"
      >
        <div className="flex flex-col sm:flex-row justify-between mb-6 gap-4">
          <Input.Search
            placeholder="Tìm theo Tên hoặc Email..."
            allowClear
            onSearch={handleSearch}
            className="max-w-md"
            size="large"
            enterButton={<SearchOutlined />}
          />
          <Select
            size="large"
            className="w-full sm:w-48"
            placeholder="Lọc theo trạng thái"
            allowClear
            // 👇 ĐÃ SỬA: Ép kiểu val về undefined nếu val bị rỗng (khi bấm nút Xóa bộ lọc)
            onChange={(val) =>
              setFilter({ ...filter, status: val ?? undefined, pageNumber: 1 })
            }
            options={STATUS_OPTIONS}
          />
        </div>

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
            onChange: (page, size) =>
              setFilter({ ...filter, pageNumber: page, pageSize: size }),
          }}
        />
      </Card>

      {/* MODAL XỬ LÝ LIÊN HỆ */}
      <Modal
        title="Chi tiết Yêu cầu Liên hệ"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedContact && (
          <div className="mt-4">
            <div className="bg-gray-50 p-4 rounded-lg mb-6 space-y-3 border border-gray-100">
              <p>
                <Text strong>Người gửi:</Text> {selectedContact.fullName}
              </p>
              <p>
                <Text strong>Email:</Text> {selectedContact.email}
              </p>
              <p>
                <Text strong>SĐT:</Text>{" "}
                {selectedContact.phone || "Không cung cấp"}
              </p>
              <p>
                <Text strong>Dịch vụ:</Text>{" "}
                <Tag color="purple">{selectedContact.subject}</Tag>
              </p>
              <div>
                <Text strong>Nội dung tin nhắn:</Text>
                <div className="mt-2 p-3 bg-white border border-gray-200 rounded text-gray-700 whitespace-pre-wrap">
                  {selectedContact.message || "Không có nội dung."}
                </div>
              </div>
            </div>

            <Form form={form} layout="vertical" onFinish={handleUpdateStatus}>
              <Form.Item label="Trạng thái xử lý" name="status">
                <Select options={STATUS_OPTIONS} size="large" />
              </Form.Item>
              <Form.Item
                label="Ghi chú nội bộ (Chỉ Admin xem)"
                name="adminNote"
              >
                <TextArea
                  rows={4}
                  placeholder="Ghi chú lại kết quả trao đổi với khách hàng..."
                />
              </Form.Item>
              <div className="flex justify-end gap-3 mt-6">
                <Button onClick={() => setIsModalVisible(false)}>Đóng</Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={submitLoading}
                >
                  Lưu thay đổi
                </Button>
              </div>
            </Form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ContactsPage;
