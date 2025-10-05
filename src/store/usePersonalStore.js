// stores/useCartStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

import CartService from "../services/CartService";

const useCartStore = create(
  persist(
    (set) => ({
      cart: {
        cartId: null,
        quantity: 0,
        totalPrice: 0,
        items: [],
      },

      setCart: (cart) => set({ cart }),

      fetchCart: async (userId) => {
        try {
          const response = await CartService.getCartByUserId(userId);
          set({ cart: response.data }); // data đã là CartResponse
        } catch (err) {
          console.error("Error fetching cart:", err);
        }
      },

      addItem: async (item) => {
        try {
          const response = await CartService.add(item); // backend trả CartItemResponse
          const newItem = response.data;
          set((state) => {
            const existingIndex = state.cart.items.findIndex(
              (it) => it.id === newItem.id
            );

            let updatedItems;
            if (existingIndex !== -1) {
              // Nếu sản phẩm đã có thì cập nhật lại quantity
              updatedItems = [...state.cart.items];
              updatedItems[existingIndex] = {
                ...updatedItems[existingIndex],
                quantity: updatedItems[existingIndex].quantity + newItem.quantity,
              };
            } else {
              // Nếu chưa có thì thêm mới
              updatedItems = [...state.cart.items, newItem];
            }

            return {
              cart: {
                ...state.cart,
                quantity: state.cart.quantity + newItem.quantity,
                totalPrice: state.cart.totalPrice + (newItem.price * newItem.quantity),
                items: updatedItems,
              },
            };
          });
        } catch (err) {
          console.error("Error adding item:", err);
        }
      },
      updateItem: async (itemId, quantity) => {
        try {
          const updatedItem = await CartService.update(itemId, quantity);
          console.log("Updated item:", updatedItem);
          set((state) => {
            const updatedItems = state.cart.items.map((item) =>
              item.id === itemId ? { ...item, quantity, priceSnapshot: updatedItem.priceSnapshot } : item
            );
            const totalQuantity = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
            const totalPrice = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

            return {
              cart: {
                ...state.cart,
                quantity: totalQuantity,
                totalPrice,
                items: updatedItems,
              },
            };
          });
        } catch (err) {
          console.error("Error updating item:", err);
        }
      },
      removeItem: async (ids) => {
        try {
          await CartService.removeItem(ids);

          set((state) => {
            const updatedItems = state.cart.items.filter((item) => !ids.includes(item.id));
            const totalQuantity = updatedItems.reduce((sum, item) => sum + item.quantity, 0);
            const totalPrice = updatedItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

            return {
              cart: {
                ...state.cart,
                quantity: totalQuantity,
                totalPrice,
                items: updatedItems,
              },
            };
          });
        } catch (err) {
          console.error("Error removing item:", err);
        }
      },
    }),
    {
      name: "personal-storage",
      getStorage: () => sessionStorage,
    }
  )
);

export default useCartStore;
