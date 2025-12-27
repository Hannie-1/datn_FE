import axiosInstance from "@/lib/config-axios";

export interface UpdateUserPayload {
  email: string;
  phone_number: string;
  password?: string;
}

export async function updateUserAction(payload: UpdateUserPayload) {
  try {
    const res = await axiosInstance.put(
      "/common/update-user",
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
        error?.response?.data?.message || "Cập nhật thất bại",
    };
  }
}
