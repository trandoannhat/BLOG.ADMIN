// https://nhatdev.top
// src/pages/Categories/CategoryModal.tsx
import { useEffect } from "react";
import { Modal, Form, Input, Select } from "antd";
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
  categories: CategoryDto[]; // --- THÊM MỚI: Nhận danh sách phẳng để làm options ---
}

const CategoryModal = ({
  visible,
  onCancel,
  onSubmit,
  initialData,
  loading,
  categories,
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
      // Đảm bảo parentId là null nếu không chọn gì, thay vì undefined hay chuỗi rỗng
      const payload = {
        ...values,
        parentId: values.parentId || null,
      };
      onSubmit(payload);
    });
  };

  // --- THÊM MỚI: Lọc bỏ chính danh mục đang edit (và các con của nó nếu cần, nhưng tạm thời chỉ cần bỏ chính nó để chống lặp level 1) ---
  const parentOptions = categories
    .filter((c) => c.id !== initialData?.id)
    .map((c) => ({
      value: c.id,
      label: c.name,
    }));

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

        {/* --- THÊM MỚI: Dropdown chọn danh mục cha --- */}
        <Form.Item name="parentId" label="Danh mục cha">
          <Select
            allowClear
            showSearch
            placeholder="Chọn danh mục cha (để trống nếu là danh mục gốc)"
            options={parentOptions}
            filterOption={(input, option) =>
              (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
            }
          />
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
