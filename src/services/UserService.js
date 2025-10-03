import userApi from "../api/userApi";

const UserService = {
    getUserByEmail: async (email) => {
        try {
            const response = await userApi.getUserByEmail(email);
            return response;
        } catch (error) {
            console.warn("/users GET", error);
            return error;
        }
    },
    getMe: async () => {
        try {
            const response = await userApi.getMe();
            return response;
        } catch (error) {
            console.warn("/users/me GET", error);
            return error;
        }
    }
};

export default UserService