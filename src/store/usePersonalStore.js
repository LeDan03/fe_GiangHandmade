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
          const newItem = await CartService.add(item); // backend trả CartItemResponse
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
          await CartService.update(itemId, quantity);
          set((state) => ({
            cart: {
              ...state.cart,
              items: state.cart.items.map((item) =>
                item.id === itemId ? { ...item, quantity } : item
              ),
            },
          }));
        } catch (err) {
          console.error("Error updating item:", err);
        }
      },
      removeItem: async (ids) => {
        try {
          await CartService.removeItem(ids);
          set((state) => ({
            cart: {
              ...state.cart,
              items: state.cart.items.filter((i) => !ids.includes(i.id)),
            },
          }));
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
