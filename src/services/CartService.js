import cartApi from "../api/cartApi";

const CartService = {
    getCartByUserId: async (userId) => {
        try {
            const response = await cartApi.getByUserId(userId);
            return response;
        } catch (error) {
            throw error;
        }
    },
    add: async (data) => {
        try {
            const response = await cartApi.add(data);
            return response;
        } catch (error) {
            throw error;
        }
    },
    update: async (itemId, quantity) => {
        try {
            const response = await cartApi.update(itemId, quantity);
            return response;
        } catch (error) {
            throw error;
        }
    },
    removeItem: async (ids) => {
        try {
            const response = await cartApi.removeItem(ids);
            return response;
        } catch (error) {
            throw error;
        }
    }
};
export default CartService;