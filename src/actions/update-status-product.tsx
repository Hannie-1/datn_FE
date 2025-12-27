// import axiosInstance from "@/lib/config-axios";

// const API_URL = `/seller/update-status-product`;

// const updateStatusProduct = async (id: string | string[]) => {
//     try {
//         const res = await axiosInstance.put(`${API_URL}/${id}`);
//         return res?.data;
//     } catch (err) {
//         throw err
//     }
// }

// export default updateStatusProduct;

import axiosInstance from "@/lib/config-axios";

const API_URL = `/seller/update-status-product`;

const updateStatusProduct = async (id: string | string[]) => {
  try {
    const res = await axiosInstance.put(
      `${API_URL}/${id}`,
      null,
      {
        requireAuth: true,
      }
    );
    return res.data;
  } catch (err) {
    throw err;
  }
};

export default updateStatusProduct;
