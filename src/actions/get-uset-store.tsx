// import axiosInstance from "@/lib/config-axios";

// const API_URL = `/common/get-store`;

// interface IEmail {
//     emailUser: string | null
// }

// const getUserByEmail = async (data: IEmail) => {
//     try {
//         const res = await axiosInstance.post(API_URL, data);
//         return res;
//     } catch (err) {
//         throw err
//     }
// }

// export default getUserByEmail;
import axiosInstance from "@/lib/config-axios";

const API_URL = `/common/get-store`;

const getCurrentUser = async () => {
    const res = await axiosInstance.post(API_URL, null, {
        requireAuth: true,
    });
    return res.data;
};

export default getCurrentUser;
