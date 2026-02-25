// https://nhatdev.top
// src/layouts/AuthLayout.tsx
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-4">
        {/* Nơi hiển thị nội dung trang con (Login/Register) */}
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
