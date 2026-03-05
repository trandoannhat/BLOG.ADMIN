// src/pages/Dashboard/index.tsx
import { useEffect, useState } from "react";
import { Card, Col, Row, Statistic, Progress, Spin, Tag } from "antd";
import {
  FileTextOutlined,
  ProjectOutlined,
  DollarCircleOutlined,
  HourglassOutlined,
  ArrowRightOutlined,
  TeamOutlined,
  MailOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import donationApi from "../../api/donationApi";
import postApi from "../../api/postApi";
import projectApi from "../../api/projectApi";
import { userManagementApi } from "../../api/adminApi";
import { contactApi } from "../../api/contactApi";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalPosts: 0,
    totalProjects: 0,
    totalDonations: 0,
    targetDonation: 1000000,
    pendingDonations: 0,
    totalUsers: 0,
    totalContacts: 0,
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const [
          donationStatsRes,
          pendingDonationsRes,
          postRes,
          projectRes,
          userRes,
          contactRes,
        ] = await Promise.all([
          donationApi.getStats().catch(() => null),
          donationApi
            .getPaged({ pageNumber: 1, pageSize: 1, isConfirmed: false })
            .catch(() => null),
          postApi.getPaged({ pageNumber: 1, pageSize: 1 }).catch(() => null),
          projectApi.getAll({ pageNumber: 1, pageSize: 1 }).catch(() => null),
          userManagementApi.getAllUsers().catch(() => null),
          contactApi.getAll({ pageNumber: 1, pageSize: 1 }).catch(() => null),
        ]);

        const statsData: any = donationStatsRes?.data || donationStatsRes || {};

        // ĐÃ SỬA: Ép kiểu any cục bộ để TypeScript không bắt lỗi các object từ Axios chưa có Interface
        const uRes: any = userRes;
        const cRes: any = contactRes;

        const usersList = uRes?.data?.data || uRes?.data || [];
        const contactTotal = cRes?.data?.totalRecords || cRes?.data?.total || 0;

        setStats({
          totalDonations: statsData.totalRaised || 0,
          targetDonation: statsData.targetAmount || 1000000,

          // ĐÃ SỬA: Xóa bỏ các fallback `?.total` vì PagedResult của bạn đã chuẩn hóa dùng `totalRecords`
          pendingDonations: pendingDonationsRes?.totalRecords || 0,
          totalPosts: postRes?.totalRecords || 0,
          totalProjects: projectRes?.totalRecords || 0,

          totalUsers: usersList.length || 0,
          totalContacts: contactTotal,
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
        {/* 1. Tổng bài viết */}
        <Col xs={24} sm={12} lg={8}>
          <Card
            variant="borderless"
            className="shadow-sm rounded-2xl cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all group"
            onClick={() => navigate("/posts")}
          >
            <div className="relative">
              <ArrowRightOutlined className="absolute top-0 right-0 text-slate-300 group-hover:text-blue-500 transition-colors text-lg" />
              <Statistic
                title={
                  <span className="font-semibold text-slate-500 group-hover:text-blue-600 transition-colors">
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
            </div>
          </Card>
        </Col>

        {/* 2. Tổng dự án */}
        <Col xs={24} sm={12} lg={8}>
          <Card
            variant="borderless"
            className="shadow-sm rounded-2xl cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all group"
            onClick={() => navigate("/projects")}
          >
            <div className="relative">
              <ArrowRightOutlined className="absolute top-0 right-0 text-slate-300 group-hover:text-purple-500 transition-colors text-lg" />
              <Statistic
                title={
                  <span className="font-semibold text-slate-500 group-hover:text-purple-600 transition-colors">
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
            </div>
          </Card>
        </Col>

        {/* 3. Tổng tài khoản */}
        <Col xs={24} sm={12} lg={8}>
          <Card
            variant="borderless"
            className="shadow-sm rounded-2xl cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all group"
            onClick={() => navigate("/users")}
          >
            <div className="relative">
              <ArrowRightOutlined className="absolute top-0 right-0 text-slate-300 group-hover:text-indigo-500 transition-colors text-lg" />
              <Statistic
                title={
                  <span className="font-semibold text-slate-500 group-hover:text-indigo-600 transition-colors">
                    Tài khoản Đăng ký
                  </span>
                }
                value={stats.totalUsers}
                prefix={<TeamOutlined className="text-indigo-500 mr-2" />}
                styles={{
                  content: {
                    fontSize: "28px",
                    fontWeight: "bold",
                    color: "#1e293b",
                  },
                }}
              />
            </div>
          </Card>
        </Col>

        {/* 4. Tổng liên hệ */}
        <Col xs={24} sm={12} lg={8}>
          <Card
            variant="borderless"
            className="shadow-sm rounded-2xl cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all group"
            onClick={() => navigate("/contacts")}
          >
            <div className="relative">
              <ArrowRightOutlined className="absolute top-0 right-0 text-slate-300 group-hover:text-pink-500 transition-colors text-lg" />
              <Statistic
                title={
                  <span className="font-semibold text-slate-500 group-hover:text-pink-600 transition-colors">
                    Yêu cầu Liên hệ
                  </span>
                }
                value={stats.totalContacts}
                prefix={<MailOutlined className="text-pink-500 mr-2" />}
                styles={{
                  content: {
                    fontSize: "28px",
                    fontWeight: "bold",
                    color: "#1e293b",
                  },
                }}
              />
            </div>
          </Card>
        </Col>

        {/* 5. Tổng quỹ Donate */}
        <Col xs={24} sm={12} lg={8}>
          <Card
            variant="borderless"
            className="shadow-sm rounded-2xl cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all group"
            onClick={() => navigate("/donations")}
          >
            <div className="relative">
              <ArrowRightOutlined className="absolute top-0 right-0 text-slate-300 group-hover:text-emerald-500 transition-colors text-lg" />
              <Statistic
                title={
                  <span className="font-semibold text-slate-500 group-hover:text-emerald-600 transition-colors">
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
            </div>
          </Card>
        </Col>

        {/* 6. Donate chờ duyệt */}
        <Col xs={24} sm={12} lg={8}>
          <Card
            variant="borderless"
            className={`shadow-sm rounded-2xl cursor-pointer hover:shadow-md hover:-translate-y-1 transition-all group ${stats.pendingDonations > 0 ? "bg-amber-50" : ""}`}
            onClick={() => navigate("/donations")}
          >
            <div className="relative">
              <ArrowRightOutlined
                className={`absolute top-0 right-0 text-lg transition-colors ${stats.pendingDonations > 0 ? "text-amber-300 group-hover:text-amber-600" : "text-slate-300 group-hover:text-slate-500"}`}
              />
              <Statistic
                title={
                  <span className="font-semibold text-slate-500 group-hover:text-slate-700 transition-colors">
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
            </div>
          </Card>
        </Col>
      </Row>

      {/* PHẦN DƯỚI: MỤC TIÊU DUY TRÌ SERVER */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card
            title="🎯 Mục tiêu duy trì Server năm nay"
            variant="borderless"
            className="shadow-sm rounded-2xl"
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
              size={{ height: 24 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
