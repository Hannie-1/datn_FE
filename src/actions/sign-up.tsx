import axiosInstance from "@/lib/config-axios";
import { SignUp } from "@/types";

const API_URL = `/auth/sign-up-seller`;
const API_URL2 = `/auth/sign-up`;

const signUpUser = async (data: SignUp) => {
    try {
        if (data.role == "SELLER") {
            const res = await axiosInstance.post(API_URL, data);
            return res;
        }
        else {
            const res = await axiosInstance.post(API_URL2, data);
            return res;
        }
    } catch (err) {
        throw err
    }
}

export default signUpUser;