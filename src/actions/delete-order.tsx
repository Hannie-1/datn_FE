"use server";

import axiosInstance from "@/lib/config-axios";

export interface DeleteOrderResult {
  success: boolean;
  data?: any;
  message?: string;
}

/**
 * Xoá order (SELLER – cần token)
 */
export async function deleteOrderAction(
  orderId: number | string
): Promise<DeleteOrderResult> {
  try {
    const res = await axiosInstance.delete(
      `/seller/delete-order/${orderId}`,
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
        error?.response?.data?.message || "Xoá đơn hàng thất bại",
    };
  }
}
