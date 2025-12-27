"use server";

import axiosInstance from "@/lib/config-axios";

export async function deleteNoticeAction(noticeId: string | undefined) {
  try {
    const res = await axiosInstance.delete(
      `/seller/delete-notice/${noticeId}`,
      {
        requireAuth: true, // cần token
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
        error?.response?.data?.message || "Xóa thông báo thất bại",
    };
  }
}
