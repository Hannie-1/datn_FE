import axiosInstance from "@/lib/config-axios";

const API_URL = `/seller/add-product`;

const createProduct = async (data: any) => {
    try {
        const res = await axiosInstance.post(API_URL, data,{requireAuth: true});
        return res;
    } catch (err) {
        throw err
    }
}

export default createProduct;