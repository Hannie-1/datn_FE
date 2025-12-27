import axiosInstance from "@/lib/config-axios";

const API_URL = `/admin/products`;

const getAllProductsAdmin = async () => {
  try {
    const res = await axiosInstance.get(API_URL, {
      requireAuth: true,
    });

    return {
      success: true,
      data: res.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message:
        error?.response?.data?.message ||
        "Không thể lấy danh sách sản phẩm",
    };
  }
};

export default getAllProductsAdmin;
