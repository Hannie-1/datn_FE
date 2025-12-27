import axiosInstance from "@/lib/config-axios";

const API_URL = `/common/get-owner-name`;

const getOwnerName = async () => {
    try {
        const res = await axiosInstance.get(`${API_URL}`);
        return res;
    } catch (err) {
        throw err
    }
}

export default getOwnerName;