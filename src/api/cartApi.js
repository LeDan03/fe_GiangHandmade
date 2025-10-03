import { removeItem } from "framer-motion";
import axiosClient from "./axiosClient";
import { data } from "react-router-dom";
import { param } from "framer-motion/client";

const cartApi = {
    getByUserId: (userId) => {
        return axiosClient.get(`/carts/${userId}`);
    },
    add: (data) => {
        const url = "/carts";
        return axiosClient.post(url, data);
    },
    update: (itemId, quantity) => {
        const url = `/carts/${itemId}`;
        return axiosClient.put(url, { params: { quantity } });
    },
    removeItem: (ids) => {
        const url = `/carts`;
        return axiosClient.delete(url, { data: ids });
    }
};
export default cartApi;