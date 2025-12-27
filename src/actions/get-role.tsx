// import axiosInstance from "@/lib/config-axios";
// const API_URL = `/common/get-role`;

// const getRole = async (email: string) => {
//     try {
//         const res = await axiosInstance.get(`${API_URL}/${email}`);
//         return res;
//     } catch (err) {
//         throw err
//     }
// }

// export default getRole;

import axiosInstance from "@/lib/config-axios";

const getRole = async () => {
  const res = await axiosInstance.get("/common/get-role", {
    requireAuth: true, 
  });
  return res.data;
};

export default getRole;
