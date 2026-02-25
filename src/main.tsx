// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";

// --- 1. Import ConfigProvider của Ant Design ---
import { ConfigProvider } from "antd";
import viVN from "antd/locale/vi_VN"; // File ngôn ngữ tiếng Việt của Antd

// --- 2. Cấu hình Dayjs sang tiếng Việt (Cho lịch, ngày tháng) ---
import dayjs from "dayjs";
import "dayjs/locale/vi"; // Import locale tiếng Việt
dayjs.locale("vi"); // Kích hoạt tiếng Việt cho toàn bộ ứng dụng

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* 3. Bọc toàn bộ RouterProvider bằng ConfigProvider */}
    <ConfigProvider locale={viVN}>
      <RouterProvider router={router} />
    </ConfigProvider>
  </React.StrictMode>,
);
