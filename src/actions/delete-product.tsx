import axiosInstance from "@/lib/config-axios";

const API_URL = `/seller/delete-product`;

const deleteProductById = async (id: string | string[]) => {
    try {
        const res = await axiosInstance.delete(`${API_URL}/${id}`,{requireAuth: true});
        return res?.data;
    } catch (err) {
        throw err
    }
}

export default deleteProductById;