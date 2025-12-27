import axiosInstance from "@/lib/config-axios";
import { LocationResult } from "@/types";

const API_URL = `/common/get-all-product-pagi`;

const getAllProduct = async (page: string | null, userLocation?: LocationResult | null) => {
    try {
        const res = await axiosInstance.post(`${API_URL}/${page}`, userLocation ?? null);
        return res.data;
    } catch (err) {
        throw err;
    }
};

export default getAllProduct;
