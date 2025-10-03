import { param } from "framer-motion/client";
import axiosClient from "./axiosClient";
import { axiosPublicClient } from "./axiosClient";

const userApi = {
    getUserByEmail: (email) => {
        return axiosClient.get("/users", {
            params: {
                email: email || null
            }
        })
    },
    getMe: () => { return axiosPublicClient.get("/users/me") }
};

export default userApi;