import axios from "axios";
import path from "../utils/path";

const baseURL = import.meta.env.VITE_SERVER_BASE_URL;

const axiosClient = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

const refreshClient = axios.create({
    baseURL,
    headers: { "Content-Type": "application/json" },
    withCredentials: true,
});

axiosClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        console.error("Axios error:", error);
        if (error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url.includes("/accessToken/refresh")) {
            originalRequest._retry = true;
            try {
                await refreshClient.post("/auth/accessToken/refresh");
                // Cap nhat lai access token moi vao header mac dinh cua axios neu khong dung cookie
                // axiosClient.defaults.headers.common["Authorization"] = `Bearer ${response.data.accessToken}`;
                return axiosClient(originalRequest);
            } catch (refreshError) {
                console.error("Refresh token failed:", refreshError);
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default axiosClient;