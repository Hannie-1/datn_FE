import axiosInstance from "@/lib/config-axios";

export async function getAllNoticeByStoreAction() {
  try {
    const res = await axiosInstance.get(
      `/seller/notices`,
      {
        requireAuth: true,
      }
    );

    return {
      success: true,
      data: res.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        "Không thể lấy danh sách thông báo",
    };
  }
}
