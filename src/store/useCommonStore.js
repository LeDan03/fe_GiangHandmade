// src/store/useCommonStore.js
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import CategoryService from "../services/CategoryService";
import ProductService from "../services/ProductService";

const useCommonStore = create(
  persist(
    (set, get) => ({
      products: [],
      productStatuses: [],

      setProducts: (products) => set({ products }),
      setProductStatuses: (statuses) => set({ productStatuses: statuses }),

      fetchProducts: async () => {
        try {
          const res = await ProductService.findProducts();
          if (res?.status === 200 && Array.isArray(res.data)) {
            set({ products: res.data });
          }
        } catch (err) {
          console.error("Error fetching products:", err);
        }
      },

      createProduct: async (form) => {
        try {
          const res = await ProductService.createProduct(form);
          if (res?.status === 201 || res?.status === 200) {
            set({ products: [...get().products, res.data] });
          }
          return res.data;
        } catch (err) {
          console.error("Error creating product:", err);
          throw err;
        }
      },

      updateProduct: async (productId, form) => {
        try {
          const res = await ProductService.updateProduct(productId, form);
          if (res?.status === 200) {
            set({
              products: get().products.map((p) =>
                p.id === res.data.id ? res.data : p
              ),
            });
          }
          return res.data;
        } catch (err) {
          console.error("Error updating product:", err);
          throw err;
        }
      },

      deleteProduct: async (productId) => {
        try {
          const res = await ProductService.deleteProduct(productId);
          if (res?.status === 200 || res?.status === 204) {
            set({
              products: get().products.filter((p) => p.id !== productId),
            });
          }
        } catch (err) {
          console.error("Error deleting product:", err);
          throw err;
        }
      },

      categories: [],
      setCategories: (categories) => set({ categories }),

      fetchCategories: async () => {
        try {
          const res = await CategoryService.getAllCategories();
          if (res?.status === 200 && Array.isArray(res.data)) {
            set({ categories: res.data });
          }
        } catch (err) {
          console.error("Error fetching categories:", err);
        }
      },

      createCategory: async (form) => {
        try {
          const res = await CategoryService.createCategory(form);
          if (res?.status === 201 || res?.status === 200) {
            set({ categories: [...get().categories, res.data] });
          }
          return res.data;
        } catch (err) {
          console.error("Error creating category:", err);
          throw err;
        }
      },

      updateCategory: async (categoryId, form) => {
        try {
          const res = await CategoryService.updateCategory(categoryId, form);
          if (res?.status === 200) {
            set({
              categories: get().categories.map((c) =>
                c.id === res.data.id ? res.data : c
              ),
            });
          }
          return res.data;
        } catch (err) {
          console.error("Error updating category:", err);
          throw err;
        }
      },

      deleteCategory: async (categoryId) => {
        try {
          const res = await CategoryService.deleteCategory(categoryId);
          if (res?.status === 200 || res?.status === 204) {
            set({
              categories: get().categories.filter((c) => c.id !== categoryId),
            });
          }
        } catch (err) {
          console.error("Error deleting category:", err);
          throw err;
        }
      },
    }),
    {
      name: "common-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useCommonStore;
