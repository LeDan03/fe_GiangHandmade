import axiosClient from "./axiosClient";

const authApi = {
    register: (registerData) => { return axiosClient.post("/auth/registration/email", registerData) },
    login: (loginData) => { return axiosClient.post("/auth/login", loginData) },
    logout: () => { return axiosClient.post("/auth/logout") },
    refreshAccessToken: () => { return axiosClient.post("/auth/accessToken/refresh") }
}

export default authApi; 