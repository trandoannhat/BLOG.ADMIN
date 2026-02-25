// https://nhatdev.top
// src/pages/Categories/CategoryModal.tsx
import { useEffect } from "react";
import { Modal, Form, Input } from "antd";
import type {
  CategoryDto,
  CreateCategoryDto,
} from "../../types/category.types";

interface Props {
  visible: boolean;
  onCancel: () => void;
  onSubmit: (values: CreateCategoryDto) => void;
  initialData?: CategoryDto | null;
  loading: boolean;
}

const CategoryModal = ({
  visible,
  onCancel,
  onSubmit,
  initialData,
  loading,
}: Props) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      if (initialData) {
        form.setFieldsValue(initialData);
      } else {
        form.resetFields();
      }
    }
  }, [visible, initialData, form]);

  const handleOk = () => {
    form.validateFields().then((values) => {
      onSubmit(values);
    });
  };

  return (
    <Modal
      title={initialData ? "Cập nhật danh mục" : "Thêm danh mục mới"}
      open={visible}
      onOk={handleOk}
      onCancel={onCancel}
      confirmLoading={loading}
    >
      <Form form={form} layout="vertical">
        <Form.Item
          name="name"
          label="Tên danh mục"
          rules={[{ required: true, message: "Vui lòng nhập tên danh mục" }]}
        >
          <Input placeholder="Ví dụ: Công nghệ, Đời sống..." />
        </Form.Item>

        <Form.Item name="description" label="Mô tả">
          <Input.TextArea
            rows={3}
            placeholder="Mô tả ngắn về danh mục này..."
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default CategoryModal;
