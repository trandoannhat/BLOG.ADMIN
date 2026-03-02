// src/pages/Projects/ProjectModal.tsx
import { useEffect } from "react";
import { Modal, Form, Input, Switch, DatePicker, Row, Col } from "antd";
import type { CreateProjectDto, ProjectDto } from "../../types/project.types";
import dayjs from "dayjs";
import ImageUpload from "../../components/ImageUpload";

// 👇 IMPORT THƯ VIỆN SOẠN THẢO VĂN BẢN
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css"; // Style mặc định của Quill

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
        form.setFieldsValue({
          ...initialData,
          techStacks: initialData.techStacks?.join(", "),
          startDate: initialData.startDate
            ? dayjs(initialData.startDate)
            : null,
          completedDate: initialData.completedDate
            ? dayjs(initialData.completedDate)
            : null,
          // Bắt đúng URL ảnh từ data cũ để truyền vào ImageUpload
          thumbnailUrl: initialData.thumbnailUrl,
          // Bắt đúng nội dung HTML cũ
          content: initialData.content,
        });
      } else {
        form.resetFields();
        form.setFieldsValue({
          startDate: dayjs(),
          isFeatured: false,
          content: "", // Khởi tạo nội dung rỗng
        });
      }
    }
  }, [visible, initialData, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      // 1. XỬ LÝ LỖI ẢNH:
      let finalThumbnailUrl = "";
      if (typeof values.thumbnailUrl === "string") {
        finalThumbnailUrl = values.thumbnailUrl;
      } else if (values.thumbnailUrl && values.thumbnailUrl.url) {
        finalThumbnailUrl = values.thumbnailUrl.url;
      }

      // 2. XỬ LÝ NỘI DUNG RỖNG CỦA REACT-QUILL
      let finalContent = values.content;
      if (finalContent === "<p><br></p>" || finalContent === "<h1><br></h1>") {
        finalContent = "";
      }

      const submitData: CreateProjectDto = {
        ...values,
        startDate: values.startDate
          ? values.startDate.toISOString()
          : undefined,
        completedDate: values.completedDate
          ? values.completedDate.toISOString()
          : undefined,

        techStacks: values.techStacks
          ? values.techStacks
              .split(",")
              .map((t: string) => t.trim())
              .filter((t: string) => t !== "")
          : [],

        content: finalContent, // Dùng content đã xử lý

        // 👇 GỬI CHÍNH XÁC DỮ LIỆU LÊN BACKEND
        thumbnailUrl: finalThumbnailUrl,

        // Luôn gửi mảng imageUrls, nếu có ảnh thì add vào, không thì rỗng
        imageUrls: finalThumbnailUrl ? [finalThumbnailUrl] : [],
      };

      onSubmit(submitData);
    });
  };

  // Cấu hình thanh công cụ cho ReactQuill
  const quillModules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike", "blockquote"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  return (
    <Modal
      title={initialData ? "Cập nhật dự án" : "Thêm dự án mới"}
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={loading}
      width={1000} // Mở rộng Modal để soạn thảo thoải mái
      style={{ top: 20 }}
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              name="name"
              label="Tên dự án"
              rules={[{ required: true, message: "Vui lòng nhập tên dự án" }]}
            >
              <Input placeholder="Ví dụ: QLTS PRO 7.1..." />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item name="clientName" label="Khách hàng / Đơn vị (Tùy chọn)">
              <Input placeholder="Ví dụ: DTSoft..." />
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              name="startDate"
              label="Ngày bắt đầu"
              rules={[{ required: true, message: "Chọn ngày bắt đầu" }]}
            >
              <DatePicker className="w-full" format="DD/MM/YYYY" />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="completedDate" label="Ngày hoàn thành">
              <DatePicker
                className="w-full"
                format="DD/MM/YYYY"
                placeholder="Đang thực hiện..."
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="isFeatured"
              valuePropName="checked"
              label="Gắn cờ Nổi bật?"
            >
              <Switch checkedChildren="Nổi bật" unCheckedChildren="Thường" />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          name="techStacks"
          label="Công nghệ sử dụng (Cách nhau bằng dấu phẩy)"
        >
          <Input placeholder="React, .NET 8, PostgreSQL..." />
        </Form.Item>

        <Form.Item name="description" label="Mô tả ngắn (Hiển thị ngoài Card)">
          <Input.TextArea
            rows={2}
            placeholder="Viết 1-2 câu tóm tắt về dự án..."
          />
        </Form.Item>

        {/* THAY THẾ BẰNG KHUNG SOẠN THẢO RICH TEXT EDITOR */}
        <Form.Item
          name="content"
          label="Nội dung Case Study chi tiết (Sẽ hiển thị thành bài viết)"
        >
          <ReactQuill
            theme="snow"
            modules={quillModules}
            placeholder="Viết chi tiết về dự án của bạn tại đây..."
            style={{ height: "300px", marginBottom: "40px" }} // Chừa khoảng trống cho thanh toolbar & bottom
          />
        </Form.Item>

        <Row gutter={16}>
          <Col span={8}>
            <Form.Item name="liveDemoUrl" label="Link Sản phẩm / Demo">
              <Input placeholder="https://..." />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="sourceCodeUrl" label="Link Source Code (Tùy chọn)">
              <Input placeholder="https://github.com/..." />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="thumbnailUrl" label="Ảnh Thumbnail (Bìa)">
              {/* Form.Item sẽ tự đẩy value và onChange vào ImageUpload */}
              <ImageUpload folder="projects" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default ProjectModal;
