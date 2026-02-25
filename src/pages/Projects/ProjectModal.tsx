// https://nhatdev.top
// src/pages/Projects/ProjectModal.tsx
import { useEffect } from "react";
import { Modal, Form, Input, Switch, DatePicker, Row, Col } from "antd";
import type { CreateProjectDto, ProjectDto } from "../../types/project.types";
import dayjs from "dayjs";
// 👇 1. Import Component Upload
import ImageUpload from "../../components/ImageUpload";

interface ProjectModalProps {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: CreateProjectDto) => void;
  initialData?: ProjectDto | null;
  loading: boolean;
}

const ProjectModal = ({
  visible,
  onCancel,
  onSubmit,
  initialData,
  loading,
}: ProjectModalProps) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (initialData) {
        // --- LOGIC FILL DATA ---
        form.setFieldsValue({
          ...initialData,
          techStacks: initialData.techStacks?.join(", "),
          startDate: initialData.startDate
            ? dayjs(initialData.startDate)
            : null,
          completedDate: initialData.completedDate
            ? dayjs(initialData.completedDate)
            : null,
          // 👇 Ant Design Form sẽ tự bind giá trị này vào prop 'value' của ImageUpload
          thumbnailUrl: initialData.thumbnailUrl,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          startDate: dayjs(),
          isFeatured: false,
        });
      }
    }
  }, [visible, initialData, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {

// 👇 1. Debug: In ra xem Form đã nhận được URL ảnh chưa?
    console.log("Giá trị Form:", values);

      const submitData: CreateProjectDto = {
        ...values,
        startDate: values.startDate
          ? values.startDate.toISOString()
          : undefined,
        completedDate: values.completedDate
          ? values.completedDate.toISOString()
          : undefined,
        techStacks: values.techStacks
          ? values.techStacks.split(",").map((t: string) => t.trim())
          : [],
        // Logic này giữ nguyên: lấy URL từ ImageUpload đóng gói vào mảng
        imageUrls: values.thumbnailUrl ? [values.thumbnailUrl] : [],
      };
      onSubmit(submitData);
    });
  };

  return (
    <Modal
      title={initialData ? "Cập nhật dự án" : "Thêm dự án mới"}
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={loading}
      width={800}
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Tên dự án"
              rules={[{ required: true, message: "Vui lòng nhập tên dự án" }]}
            >
              <Input placeholder="Tên dự án..." />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="clientName" label="Khách hàng">
              <Input placeholder="Tên khách hàng..." />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="startDate"
              label="Ngày bắt đầu"
              rules={[{ required: true, message: "Chọn ngày bắt đầu" }]}
            >
              <DatePicker className="w-full" format="DD/MM/YYYY" />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="completedDate" label="Ngày hoàn thành">
              <DatePicker
                className="w-full"
                format="DD/MM/YYYY"
                placeholder="Đang thực hiện..."
              />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="isFeatured"
          valuePropName="checked"
          label="Dự án nổi bật?"
        >
          <Switch checkedChildren="Nổi bật" unCheckedChildren="Thường" />
        </Form.Item>

        <Form.Item name="description" label="Mô tả ngắn">
          <Input.TextArea rows={2} placeholder="Mô tả hiển thị trên card..." />
        </Form.Item>

        <Form.Item name="content" label="Nội dung chi tiết (Case Study)">
          <Input.TextArea
            rows={6}
            placeholder="Viết chi tiết về quá trình làm dự án..."
          />
        </Form.Item>

        <Form.Item name="techStacks" label="Công nghệ (ngăn cách phẩy)">
          <Input placeholder="React, .NET, SQL Server..." />
        </Form.Item>

        <Row gutter={16}>
          <Col span={12}>
            <Form.Item name="liveDemoUrl" label="Live Demo">
              <Input placeholder="https://..." />
            </Form.Item>
          </Col>

          {/* 👇 2. THAY THẾ INPUT TEXT BẰNG IMAGE UPLOAD */}
          <Col span={12}>
            <Form.Item
              name="thumbnailUrl"
              label="Ảnh Thumbnail"
              // Thêm rules nếu muốn bắt buộc phải có ảnh
              // rules={[{ required: true, message: "Vui lòng upload ảnh!" }]}
            >
              {/* Form.Item sẽ tự động truyền:
                  - value={form.getFieldValue('thumbnailUrl')}
                  - onChange={(url) => form.setFieldValue('thumbnailUrl', url)}
                  vào component này.
              */}
              <ImageUpload folder="projects" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ProjectModal;
