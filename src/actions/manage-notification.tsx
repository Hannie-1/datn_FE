import axiosInstance from "@/lib/config-axios";

export interface NotificationPayload {
  productId: number;
  title: string;
  content: string;
  status: string;
}

export async function createNotificationAction(
  payload: NotificationPayload
) {
  try {
    const res = await axiosInstance.post(
      "/seller/create-notification",
      payload,
      {
        requireAuth: true, 
      }
    );

    return { success: true, data: res.data };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message || "Tạo thông báo thất bại",
    };
  }
}

export async function updateNotificationAction(
  noticeId: number | string,
  payload: NotificationPayload
) {
  try {
    const res = await axiosInstance.put(
      `/seller/update-notice/${noticeId}`,
      payload,
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
        error?.response?.data?.message || "Cập nhật thông báo thất bại",
    };
  }
}