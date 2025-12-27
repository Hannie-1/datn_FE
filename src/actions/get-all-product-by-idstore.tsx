// import axiosInstance from "@/lib/config-axios";

// const API_URL = `/seller/get-all-product-by-idstore`;

// interface getProductProps {
//     id: Number
// }

// const getAllProductByIdStore = async (data: getProductProps) => {
//     try {
//         const res = await axiosInstance.post(API_URL, data,{requireAuth: true});
//         return res;
//     } catch (err) {
//         throw err
//     }
// }

// export default getAllProductByIdStore;

import axiosInstance from "@/lib/config-axios";

export async function getAllProductByIdStore() {
  try {
    const res = await axiosInstance.get("/seller/products", {
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
}
