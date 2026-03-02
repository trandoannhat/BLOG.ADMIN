import axiosClient from "./axiosClient";
import type { PagedResult } from "../types/common.types";
import type { DonationDto, DonationFilter } from "../types/donation.types";

const donationApi = {
  // Lấy danh sách phân trang
  getPaged(filter: DonationFilter) {
    // 👇 ĐÃ SỬA: Xóa chữ /paged đi, chỉ để "/Donations"
    return axiosClient.get<any, PagedResult<DonationDto>>("/Donations", {
      params: {
        PageNumber: filter.pageNumber,
        PageSize: filter.pageSize,
        Keyword: filter.keyword,
        IsConfirmed: filter.isConfirmed,
      },
    });
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
