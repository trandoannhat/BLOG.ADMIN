export interface DonationDto {
  id: string;
  donorName: string;
  amount: number;
  message: string;
  paymentMethod: string;
  isConfirmed: boolean;
  createdAt: string;
}

export interface DonationFilter {
  pageNumber: number;
  pageSize: number;
  keyword?: string;
  isConfirmed?: boolean | null; // null để lấy tất cả, true là đã duyệt, false là chờ duyệt
}
