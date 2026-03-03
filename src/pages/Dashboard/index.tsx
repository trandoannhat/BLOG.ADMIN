import React, { useEffect, useState } from "react";
import { Card, Col, Row, Statistic, Progress, Button, Spin, Tag } from "antd";
import {
  FileTextOutlined,
  ProjectOutlined,
  DollarCircleOutlined,
  HourglassOutlined,
  ArrowRightOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";

// IMPORT CÁC API THẬT TỪ DỰ ÁN CỦA BẠN
import donationApi from "../../api/donationApi";
import postApi from "../../api/postApi";
import projectApi from "../../api/projectApi";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // State lưu trữ các con số thống kê
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
            projectApi.getAll({ pageNumber: 1, pageSize: 1 }), // Đã sử dụng getAll thay vì getPaged
          ]);

        // Xử lý cẩn thận các lớp dữ liệu trả về từ Axios / API
        setStats({
          totalDonations:
            donationStatsRes?.data?.totalRaised ||
            donationStatsRes?.totalRaised ||
            0,
          targetDonation:
            donationStatsRes?.data?.targetAmount ||
            donationStatsRes?.targetAmount ||
            1000000,
          pendingDonations:
            pendingDonationsRes?.data?.totalRecords ||
            pendingDonationsRes?.totalRecords ||
            0,
          totalPosts: postRes?.data?.totalRecords || postRes?.totalRecords || 0, // Fix lỗi đếm = 0
          totalProjects:
            projectRes?.data?.totalRecords || projectRes?.totalRecords || 0, // Fix lỗi đếm = 0
        });
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu Dashboard:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format tiền tệ
  const formatMoney = (amount: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);

  // Tính phần trăm
  const progressPercent = Math.min(
    (stats.totalDonations / stats.targetDonation) * 100,
    100,
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Spin size="large" tip="Đang tải tổng quan hệ thống..." />
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
          Chào mừng trở lại! Dưới đây là tình hình hoạt động của NhatDev hôm
          nay.
        </p>
      </div>

      {/* DÒNG 1: 4 THẺ THỐNG KÊ */}
      <Row gutter={[16, 16]} className="mb-8">
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm border-slate-100 hover:shadow-md transition-shadow rounded-2xl">
            <Statistic
              title={
                <span className="font-semibold text-slate-500">
                  Tổng Bài Viết
                </span>
              }
              value={stats.totalPosts}
              prefix={<FileTextOutlined className="text-blue-500 mr-2" />}
              valueStyle={{
                fontSize: "28px",
                fontWeight: "bold",
                color: "#1e293b",
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm border-slate-100 hover:shadow-md transition-shadow rounded-2xl">
            <Statistic
              title={
                <span className="font-semibold text-slate-500">
                  Dự án & Case Study
                </span>
              }
              value={stats.totalProjects}
              prefix={<ProjectOutlined className="text-purple-500 mr-2" />}
              valueStyle={{
                fontSize: "28px",
                fontWeight: "bold",
                color: "#1e293b",
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm border-slate-100 hover:shadow-md transition-shadow rounded-2xl">
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
              valueStyle={{
                fontSize: "24px",
                fontWeight: "bold",
                color: "#059669",
              }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card
            className={`shadow-sm transition-shadow rounded-2xl ${stats.pendingDonations > 0 ? "border-amber-300 bg-amber-50/30" : "border-slate-100"}`}
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
                      ? "text-amber-500 mr-2 animate-spin-slow"
                      : "text-slate-400 mr-2"
                  }
                />
              }
              valueStyle={{
                fontSize: "28px",
                fontWeight: "bold",
                color: stats.pendingDonations > 0 ? "#d97706" : "#64748b",
              }}
            />
            {stats.pendingDonations > 0 && (
              <div className="absolute top-4 right-4 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-amber-500"></span>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {/* DÒNG 2: TIẾN ĐỘ DONATE & THAO TÁC NHANH */}
      <Row gutter={[16, 16]}>
        {/* Cột Trái: Tiến độ Donate */}
        <Col xs={24} lg={16}>
          <Card
            title="🎯 Mục tiêu duy trì Server năm nay"
            className="shadow-sm border-slate-100 rounded-2xl h-full"
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
              trailColor="#f1f5f9"
              size={["100%", 20]} // Độ dày thanh progress
            />
            <p className="mt-4 text-sm text-slate-500">
              {progressPercent >= 100
                ? "🎉 Quá tuyệt vời! Bạn đã hoàn thành mục tiêu kinh phí Server cho năm nay."
                : `Còn thiếu ${formatMoney(Math.max(0, stats.targetDonation - stats.totalDonations))} nữa để đạt mục tiêu.`}
            </p>
          </Card>
        </Col>

        {/* Cột Phải: Thao tác nhanh */}
        <Col xs={24} lg={8}>
          <Card
            title="⚡ Thao tác nhanh"
            className="shadow-sm border-slate-100 rounded-2xl h-full"
          >
            <div className="flex flex-col gap-3">
              <Button
                type="primary"
                size="large"
                icon={<ArrowRightOutlined />}
                className="w-full text-left flex justify-start items-center bg-blue-600 rounded-xl"
                onClick={() => navigate("/posts")}
              >
                Quản lý Bài viết Blog
              </Button>

              <Button
                size="large"
                icon={<ArrowRightOutlined />}
                className="w-full text-left flex justify-start items-center rounded-xl border-slate-300"
                onClick={() => navigate("/projects")}
              >
                Quản lý Dự án (Case Study)
              </Button>

              <div className="my-2 border-t border-dashed border-slate-200"></div>

              <Button
                type="dashed"
                size="large"
                icon={<ArrowRightOutlined />}
                className="w-full text-left flex justify-start items-center rounded-xl text-emerald-600 border-emerald-300 hover:border-emerald-500 hover:text-emerald-700"
                onClick={() => navigate("/donations")}
              >
                Quản lý Ủng hộ (Donate)
                {stats.pendingDonations > 0 && (
                  <span className="ml-auto bg-amber-100 text-amber-700 py-0.5 px-2 rounded-md text-xs font-bold">
                    {stats.pendingDonations} chờ duyệt
                  </span>
                )}
              </Button>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
