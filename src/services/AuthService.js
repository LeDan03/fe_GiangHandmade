import authApi from "../api/authApi";

const AuthService = {
    async register(registerData) {
        const response = await authApi.register(registerData);
        return response;
    },
    async login(loginData) {
        const response = await authApi.login(loginData);
        return response;
    },
    async logout() {
        const response = await authApi.logout();
        return response;
    },
    async refreshAccessToken() {
        const response = await authApi.refreshAccessToken();
        return response;
    }
}

export default AuthService;