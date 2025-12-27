import axiosInstance from "@/lib/config-axios";

const API_URL = `/user/create-order2`;

const createOrder = async (data: any) => {
    try {
        const res = await axiosInstance.post(API_URL, data,{requireAuth: true});
        return res;
    } catch (err) {
        throw err
    }
}

export default createOrder;