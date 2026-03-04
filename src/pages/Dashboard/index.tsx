// https://nhatdev.top
// src/pages/Dashboard/index.tsx
import { useEffect, useState } from "react";
import { Card, Col, Row, Statistic, Progress, Button, Spin, Tag } from "antd";
import {
  FileTextOutlined,
  ProjectOutlined,
  DollarCircleOutlined,
  HourglassOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import donationApi from "../../api/donationApi";
import postApi from "../../api/postApi";
import projectApi from "../../api/projectApi";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalProjects: 0,
    totalDonations: 0,
    targetDonation: 1000000,
    pendingDonations: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [donationStatsRes, pendingDonationsRes, postRes, projectRes] =
          await Promise.all([
            donationApi.getStats(),
            donationApi.getPaged({
              pageNumber: 1,
              pageSize: 1,
              isConfirmed: false,
            }),
            postApi.getPaged({ pageNumber: 1, pageSize: 1 }),
            projectApi.getAll({ pageNumber: 1, pageSize: 1 }),
          ]);

        const statsData: any = donationStatsRes?.data || donationStatsRes || {};

        setStats({
          totalDonations: statsData.totalRaised || 0,
          targetDonation: statsData.targetAmount || 1000000,
          pendingDonations: pendingDonationsRes?.totalRecords || 0,
          totalPosts: postRes?.totalRecords || 0,
          totalProjects: projectRes?.totalRecords || 0,
        });
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu Dashboard:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const formatMoney = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  const progressPercent = Math.min(
    (stats.totalDonations / stats.targetDonation) * 100,
    100,
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Spin size="large" />
        <span className="text-slate-500">Đang tải tổng quan hệ thống...</span>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 mb-1">
          Tổng quan Hệ thống
        </h1>
        <p className="text-slate-500 text-sm">
          Chào mừng trở lại! Dưới đây là tình hình hoạt động của NhatDev.
        </p>
      </div>

      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" className="shadow-sm rounded-2xl">
            <Statistic
              title={
                <span className="font-semibold text-slate-500">
                  Tổng Bài Viết
                </span>
              }
              value={stats.totalPosts}
              prefix={<FileTextOutlined className="text-blue-500 mr-2" />}
              styles={{
                content: {
                  fontSize: "28px",
                  fontWeight: "bold",
                  color: "#1e293b",
                },
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" className="shadow-sm rounded-2xl">
            <Statistic
              title={
                <span className="font-semibold text-slate-500">
                  Dự án & Case Study
                </span>
              }
              value={stats.totalProjects}
              prefix={<ProjectOutlined className="text-purple-500 mr-2" />}
              styles={{
                content: {
                  fontSize: "28px",
                  fontWeight: "bold",
                  color: "#1e293b",
                },
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card variant="borderless" className="shadow-sm rounded-2xl">
            <Statistic
              title={
                <span className="font-semibold text-slate-500">
                  Tổng quỹ Donate
                </span>
              }
              value={stats.totalDonations}
              formatter={(val) => formatMoney(Number(val))}
              prefix={
                <DollarCircleOutlined className="text-emerald-500 mr-2" />
              }
              styles={{
                content: {
                  fontSize: "24px",
                  fontWeight: "bold",
                  color: "#059669",
                },
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            variant="borderless"
            className={`shadow-sm rounded-2xl ${stats.pendingDonations > 0 ? "bg-amber-50" : ""}`}
          >
            <Statistic
              title={
                <span className="font-semibold text-slate-500">
                  Donate chờ duyệt
                </span>
              }
              value={stats.pendingDonations}
              prefix={
                <HourglassOutlined
                  className={
                    stats.pendingDonations > 0
                      ? "text-amber-500 mr-2"
                      : "text-slate-400 mr-2"
                  }
                />
              }
              styles={{
                content: {
                  fontSize: "28px",
                  fontWeight: "bold",
                  color: stats.pendingDonations > 0 ? "#d97706" : "#64748b",
                },
              }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={16}>
          <Card
            title="🎯 Mục tiêu duy trì Server năm nay"
            variant="borderless"
            className="shadow-sm rounded-2xl h-full"
            extra={<Tag color="blue">Năm {new Date().getFullYear()}</Tag>}
          >
            <div className="flex justify-between items-end mb-2">
              <div>
                <p className="text-xs text-slate-500 font-bold mb-1 uppercase tracking-wider">
                  Đã đạt được
                </p>
                <p className="text-2xl font-extrabold text-blue-600">
                  {formatMoney(stats.totalDonations)}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xs text-slate-500 font-bold mb-1 uppercase tracking-wider">
                  Mục tiêu
                </p>
                <p className="text-lg font-bold text-slate-700">
                  {formatMoney(stats.targetDonation)}
                </p>
              </div>
            </div>
            <Progress
              percent={Number(progressPercent.toFixed(1))}
              status="active"
              strokeColor={{ "0%": "#3b82f6", "100%": "#6366f1" }}
              railColor="#f1f5f9"
              size={{ height: 20 }} //  TypeScript sẽ không báo lỗi ở đây
            />
          </Card>
        </Col>
        <Col xs={24} lg={8}>
          <Card
            title="⚡ Thao tác nhanh"
            variant="borderless"
            className="shadow-sm rounded-2xl h-full"
          >
            <div className="flex flex-col gap-3">
              <Button
                type="primary"
                size="large"
                icon={<ArrowRightOutlined />}
                className="w-full text-left flex justify-start items-center bg-blue-600 rounded-xl"
                onClick={() => navigate("/posts")}
              >
                Quản lý Bài viết
              </Button>
              <Button
                size="large"
                icon={<ArrowRightOutlined />}
                className="w-full text-left flex justify-start items-center rounded-xl"
                onClick={() => navigate("/projects")}
              >
                Quản lý Dự án
              </Button>
              <Button
                type="dashed"
                size="large"
                icon={<ArrowRightOutlined />}
                className="w-full text-left flex justify-start items-center rounded-xl"
                onClick={() => navigate("/donations")}
              >
                Quản lý Ủng hộ
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
