import { create } from "zustand";
import ProductService from "../services/ProductService";

const useProductStore = create((set) => ({
  searchedProducts: [],
  isSearching: false,

  searchProducts: async (keyword) => {
    set({ isSearching: true });
    try {
      const res = await ProductService.findProducts(keyword);
      if (res?.status === 200 && Array.isArray(res.data)) {
        set({ searchedProducts: res.data });
      }
    } catch (err) {
      console.error("Error searching products:", err);
    } finally {
      set({ isSearching: false });
    }
  },

  clearSearch: () => set({ searchedProducts: [] }),
}));

export default useProductStore;
