import axiosClient from "./axiosClient";

const authApi = {
    register: (registerData) => { return axiosClient.post("/auth/users/email", registerData) },
    login: (loginData) => { return axiosClient.post("/auth/sessions", loginData) },
    logout: () => { return axiosClient.delete("/auth/sessions") },
    refreshAccessToken: () => { return axiosClient.post("/auth/tokens/refresh") }
}

export default authApi; 