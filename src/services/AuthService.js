import authApi from "../api/authApi";

const AuthService = {
    async register(registerData) {
        const response = await authApi.register(registerData);
        console.log("Register response:", response);
        return response.data;
    },
    async login(loginData) {
        const response = await authApi.login(loginData);
        return response.data;
    },
    async logout() {
        const response = await authApi.logout();
        return response.data;
    },
    async refreshAccessToken() {
        const response = await authApi.refreshAccessToken();
        return response.data;
    }
}

export default AuthService;