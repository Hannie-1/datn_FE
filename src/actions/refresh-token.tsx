import axiosInstance from "@/lib/config-axios";

const API_URL = `/auth/refresh`;

interface IAccessToken {
    access_token: string | null
}

const refreshToken = async (data: IAccessToken) => {
    if(!data.access_token){
        throw new Error("access token is missing");
    }
    try {
        const res = await axiosInstance.post(API_URL, data);
        return res;
    } catch (err) {
        throw err
    }
}

export default refreshToken;