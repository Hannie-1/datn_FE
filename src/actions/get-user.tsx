import axiosInstance from "@/lib/config-axios";

export interface UserResponse {
  userID: number;
  email: string;
  phone_number: string;
  role: string;
}

export async function getCurrentUserAction(): Promise<UserResponse | null> {
  try {
    const res = await axiosInstance.get("/common/get-user", {
      requireAuth: true, 
    });

    return res.data;
  } catch (error) {
    console.error("Lỗi lấy user:", error);
    return null;
  }
}
