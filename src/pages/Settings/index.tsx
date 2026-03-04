// https://nhatdev.top
// src/pages/Settings/index.tsx
import { useEffect, useState } from "react";
import {
  Card,
  Form,
  Input,
  Button,
  message,
  InputNumber,
  Tabs,
  Skeleton,
} from "antd";
import {
  FacebookOutlined,
  GithubOutlined,
  MessageOutlined,
  SaveOutlined,
} from "@ant-design/icons";
import { settingApi } from "../../api/adminApi";
import donationApi from "../../api/donationApi";

const SettingsPage = () => {
  const [formGeneral] = Form.useForm();
  const [formSocial] = Form.useForm();
  const [formDonate] = Form.useForm();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [settingsRes, donateStatsRes]: any = await Promise.all([
        settingApi.getAll().catch(() => null),
        donationApi.getStats().catch(() => null),
      ]);

      // Delay cực ngắn để đảm bảo Tabs đã mount các Form thông qua forceRender
      setTimeout(() => {
        if (settingsRes?.success && settingsRes?.data) {
          const dataObj = Array.isArray(settingsRes.data)
            ? settingsRes.data.reduce(
                (acc: any, curr: any) => ({ ...acc, [curr.key]: curr.value }),
                {},
              )
            : settingsRes.data;
          formGeneral.setFieldsValue(dataObj);
          formSocial.setFieldsValue(dataObj);
        }

        if (donateStatsRes?.data) {
          formDonate.setFieldsValue({
            targetAmount: donateStatsRes.data.targetAmount,
          });
        }
      }, 100);
    } catch (error) {
      message.error("Lỗi tải dữ liệu cài đặt!");
    } finally {
      setFetching(false);
    }
  };

  const onSaveSettings = async (values: any) => {
    setLoading(true);
    try {
      const payload = Object.keys(values).map((key) => ({
        key: key,
        value: values[key]?.toString() || "",
      }));

      const response: any = await settingApi.updateBatch(payload);
      if (response.success) {
        message.success("Đã lưu cấu hình hệ thống thành công! 🎉");
      } else {
        message.error(response.message || "Lưu cấu hình thất bại!");
      }
    } catch (error) {
      message.error("Có lỗi xảy ra khi kết nối máy chủ!");
    } finally {
      setLoading(false);
    }
  };

  const onSaveDonateTarget = async (values: any) => {
    if (!values.targetAmount || values.targetAmount <= 0) {
      return message.warning("Vui lòng nhập số tiền hợp lệ!");
    }
    setLoading(true);
    try {
      await donationApi.updateTargetAmount(values.targetAmount);
      message.success("Đã cập nhật mục tiêu Donate thành công! 🎯");
    } catch (error) {
      message.error("Cập nhật mục tiêu thất bại!");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="max-w-4xl mx-auto">
        <Card
          title="Cài đặt hệ thống"
          variant="borderless"
          className="shadow-sm"
        >
          <Skeleton active paragraph={{ rows: 6 }} />
        </Card>
      </div>
    );
  }

  const items = [
    {
      key: "1",
      label: "Cấu hình chung",
      forceRender: true,
      children: (
        <Form form={formGeneral} layout="vertical" onFinish={onSaveSettings}>
          <Form.Item label="Tên Website (Tiêu đề SEO)" name="siteName">
            <Input placeholder="VD: NhatDev - Lập trình & Cuộc sống" />
          </Form.Item>
          <Form.Item label="Email Liên hệ" name="contactEmail">
            <Input placeholder="Email hiển thị dưới Footer" />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            icon={<SaveOutlined />}
          >
            Lưu cấu hình chung
          </Button>
        </Form>
      ),
    },
    {
      key: "2",
      label: "Mạng xã hội",
      forceRender: true,
      children: (
        <Form form={formSocial} layout="vertical" onFinish={onSaveSettings}>
          <Form.Item label="Link Facebook" name="facebookUrl">
            <Input
              prefix={<FacebookOutlined className="text-blue-600" />}
              placeholder="https://facebook.com/..."
            />
          </Form.Item>
          <Form.Item label="Link Zalo" name="zaloUrl">
            <Input
              prefix={<MessageOutlined className="text-blue-400" />}
              placeholder="https://zalo.me/..."
            />
          </Form.Item>
          <Form.Item label="Link GitHub" name="githubUrl">
            <Input
              prefix={<GithubOutlined className="text-gray-800" />}
              placeholder="https://github.com/..."
            />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            icon={<SaveOutlined />}
          >
            Lưu Mạng xã hội
          </Button>
        </Form>
      ),
    },
    {
      key: "3",
      label: "Cài đặt Donate",
      forceRender: true,
      children: (
        <Form form={formDonate} layout="vertical" onFinish={onSaveDonateTarget}>
          <Form.Item label="Mục tiêu Donate (VNĐ)" name="targetAmount">
            <InputNumber
              className="w-full max-w-xs"
              formatter={(value) =>
                `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
              }
              parser={(value) => value!.replace(/\$\s?|(,*)/g, "") as any}
              suffix="VNĐ" // Thay addonAfter -> suffix
              min={1000}
              step={100000}
            />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            icon={<SaveOutlined />}
          >
            Lưu mục tiêu
          </Button>
        </Form>
      ),
    },
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <Card title="Cài đặt hệ thống" variant="borderless" className="shadow-sm">
        <Tabs defaultActiveKey="1" items={items} />
      </Card>
    </div>
  );
};

export default SettingsPage;
