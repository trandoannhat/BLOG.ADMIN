// https://nhatdev.top
// src/pages/Posts/PostModal.tsx
import { useEffect, useState } from "react";
import {
  Modal,
  Form,
  Input,
  Switch,
  Row,
  Col,
  message,
  TreeSelect,
} from "antd";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

import type { CreatePostDto, PostDto } from "../../types/post.types";
import type { CategoryDto } from "../../types/category.types";
import categoryApi from "../../api/categoryApi";
import ImageUpload from "../../components/ImageUpload";

interface Props {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: CreatePostDto) => void;
  initialData?: PostDto | null;
  loading: boolean;
}

const PostModal = ({
  visible,
  onCancel,
  onSubmit,
  initialData,
  loading,
}: Props) => {
  const [form] = Form.useForm();
  const [categories, setCategories] = useState<CategoryDto[]>([]);

  useEffect(() => {
    if (visible) {
      fetchCategories();
      if (initialData) {
        form.setFieldsValue(initialData);
      } else {
        form.resetFields();
        form.setFieldsValue({ isPublished: true });
      }
    }
  }, [visible, initialData, form]);

  // --- SỬA: Dùng getTree() thay vì getAll() ---
  const fetchCategories = async () => {
    try {
      const res = await categoryApi.getTree();
      setCategories(res.data || []);
    } catch (error) {
      message.error("Lỗi tải danh mục");
    }
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
    });
  };

  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image", "code-block"],
      ["clean"],
    ],
  };

  return (
    <Modal
      title={initialData ? "Sửa bài viết" : "Viết bài mới"}
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={loading}
      width={1000}
    >
      <Form form={form} layout="vertical">
        <Row gutter={16}>
          <Col span={16}>
            <Form.Item
              name="title"
              label="Tiêu đề bài viết"
              rules={[{ required: true, message: "Nhập tiêu đề!" }]}
            >
              <Input placeholder="Nhập tiêu đề hấp dẫn..." size="large" />
            </Form.Item>

            <Form.Item name="summary" label="Tóm tắt (Mô tả ngắn SEO)">
              <Input.TextArea rows={2} placeholder="Đoạn mở bài ngắn gọn..." />
            </Form.Item>

            <Form.Item
              name="content"
              label="Nội dung chi tiết"
              rules={[
                { required: true, message: "Nội dung không được để trống!" },
              ]}
            >
              <ReactQuill
                theme="snow"
                modules={modules}
                style={{ height: "350px", marginBottom: "40px" }}
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            {/* --- SỬA: Dùng TreeSelect để hiển thị danh mục đa cấp --- */}
            <Form.Item
              name="categoryId"
              label="Danh mục"
              rules={[{ required: true, message: "Chọn danh mục!" }]}
            >
              <TreeSelect
                showSearch
                style={{ width: "100%" }}
                dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                placeholder="-- Chọn danh mục --"
                allowClear
                treeDefaultExpandAll
                treeData={categories}
                // Map đúng các key của CategoryDto vào TreeSelect
                fieldNames={{
                  label: "name",
                  value: "id",
                  children: "children",
                }}
                treeNodeFilterProp="name" // Hỗ trợ tìm kiếm theo tên
              />
            </Form.Item>

            <Form.Item name="thumbnailUrl" label="Ảnh bìa bài viết">
              <ImageUpload folder="blogs" />
            </Form.Item>

            <Form.Item
              name="isPublished"
              label="Trạng thái xuất bản"
              valuePropName="checked"
            >
              <Switch
                checkedChildren="Công khai"
                unCheckedChildren="Bản nháp"
              />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default PostModal;
