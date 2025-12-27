import axiosInstance from "@/lib/config-axios";

const API_URL = `/seller/orders`;

const getAllOrderByIdStore = async () => {
    // try {
    //     const res = await axiosInstance.get(API_URL,{requireAuth: true});
    //     if (res?.status === 200) {
    //         console.log(res?.data);
    //         return res?.data;
    //     } else {
    //         return [];
    //     }
    // } catch (err) {
    //     throw err
    // }
    try {
    const res = await axiosInstance.get(
      `/seller/orders`,
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
        "Không thể lấy danh sách orders",
    };
  }
}

export default getAllOrderByIdStore;