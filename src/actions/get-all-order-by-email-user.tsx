import axiosInstance from "@/lib/config-axios";

const API_URL = `/user/get-all-order-by-email-user`;

const getAllOrderByEmailUser = async () => {
  try {
    const res = await axiosInstance.get(API_URL, {
      requireAuth: true, 
    });

    return res.data;
  } catch (err) {
    throw err;
  }
};

export default getAllOrderByEmailUser;
