import { create } from "zustand";

const useCartIconStore = create((set) => ({
  cartRect: null,
  setCartRect: (rect) => set({ cartRect: rect }),
}));

export default useCartIconStore;
