// https://nhatdev.top
// src/components/ImageUpload.tsx
import { useState } from "react";
import { Upload, message, Button, Image } from "antd";
import {
  UploadOutlined,
  LoadingOutlined,
  DeleteOutlined,
  //EyeOutlined,
} from "@ant-design/icons";
import fileApi from "../api/fileApi"; // Import fileApi vừa tạo

interface Props {
  value?: string; // URL ảnh (Form truyền vào)
  onChange?: (url: string) => void; // Hàm báo lại cho Form khi upload xong
  folder?: string; // Cho phép chọn folder (projects, blogs, avatars...)
}

const ImageUpload = ({ value, onChange, folder = "general" }: Props) => {
  const [loading, setLoading] = useState(false);

  // Xử lý upload custom
  const customRequest = async (options: any) => {
    const { file, onSuccess, onError } = options;
    setLoading(true);

    try {
      // Gọi API Upload lên Cloudinary
      const res: any = await fileApi.upload(file, folder);

      // Backend trả về: Success(new { url }, ...)
      // Cấu trúc response thường là: { data: { url: "..." }, ... } hoặc trực tiếp { url: "..." } tùy axiosClient
      // Đoạn này lấy an toàn:
      const url = res.data?.url || res.url || res;

      if (!url) throw new Error("Không nhận được URL ảnh");

      // Cập nhật giá trị cho Form
      onChange?.(url);

      onSuccess(url);
      message.success("Upload ảnh thành công!");
    } catch (err) {
      console.error(err);
      onError(err);
      message.error("Lỗi upload ảnh!");
    } finally {
      setLoading(false);
    }
  };

  const handleRemove = () => {
    onChange?.(""); // Xóa URL
  };

  return (
    <div className="flex flex-col gap-2">
      {/* 1. Đã có ảnh -> Hiển thị Preview */}
      {value ? (
        <div className="relative group w-40 h-40 border border-gray-200 rounded-lg overflow-hidden bg-gray-50">
          <Image
            src={value}
            alt="Preview"
            className="object-cover w-full h-full"
            width="100%"
            height="100%"
          />

          {/* Overlay chứa nút chức năng */}
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
            <Button
              type="primary"
              danger
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={handleRemove}
              title="Xóa ảnh"
            />
          </div>
        </div>
      ) : (
        // 2. Chưa có ảnh -> Hiện nút Upload
        <Upload
          name="file"
          listType="picture-card"
          showUploadList={false}
          customRequest={customRequest}
          beforeUpload={(file) => {
            // Check đuôi file và dung lượng ở Client cho nhanh
            const isImage = file.type.startsWith("image/");
            if (!isImage) message.error("Chỉ được upload file ảnh!");

            const isLt5M = file.size / 1024 / 1024 < 5;
            if (!isLt5M) message.error("Ảnh phải nhỏ hơn 5MB!");

            return isImage && isLt5M;
          }}
        >
          <div className="flex flex-col items-center justify-center text-gray-500">
            {loading ? (
              <LoadingOutlined className="text-xl text-blue-500" />
            ) : (
              <UploadOutlined className="text-xl" />
            )}
            <div className="mt-2 text-xs">
              {loading ? "Đang lên mây..." : "Tải ảnh lên"}
            </div>
          </div>
        </Upload>
      )}
    </div>
  );
};

export default ImageUpload;
