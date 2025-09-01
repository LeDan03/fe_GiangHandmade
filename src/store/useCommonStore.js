import { create } from "zustand";
import { persist } from "zustand/middleware";

const useCommonStore = create(
    persist(
        (set) => ({
            products: [],
            setProducts: (products) => set({ products }),
            categories: [],
            setCategories: (categories) => set({ categories }),
        }),
        {
            name: "common-storage",
            getStorage: () => sessionStorage,
        }
    )
)
export default useCommonStore;