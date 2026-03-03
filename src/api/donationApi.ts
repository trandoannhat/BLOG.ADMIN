import axiosClient from "./axiosClient";
import type { PagedResult } from "../types/common.types";
import type { DonationDto, DonationFilter } from "../types/donation.types";

const donationApi = {
  // Lấy danh sách phân trang
  getPaged(filter: DonationFilter) {
    return axiosClient.get<any, PagedResult<DonationDto>>("/Donations", {
      params: {
        PageNumber: filter.pageNumber,
        PageSize: filter.pageSize,
        Keyword: filter.keyword,
        IsConfirmed: filter.isConfirmed,
      },
    });
  },

  // 👇 THÊM: Lấy thống kê (để lấy TargetAmount hiện tại hiển thị lên Admin)
  getStats() {
    return axiosClient.get("/Donations/stats");
  },

  // 👇 THÊM: Cập nhật Mục tiêu Donate
  updateTargetAmount(targetAmount: number) {
    return axiosClient.put("/Donations/target-amount", { targetAmount });
  },

  // Gạt công tắc Duyệt / Bỏ duyệt
  toggleApproval(id: string) {
    return axiosClient.put(`/Donations/${id}/toggle-approval`);
  },

  // Xóa giao dịch
  delete(id: string) {
    return axiosClient.delete(`/Donations/${id}`);
  },
};

export default donationApi;
