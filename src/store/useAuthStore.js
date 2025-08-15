import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
    persist(
        (set) => ({
            user: null,
            setUser: (user) => set({ user: user }),
            logout: () => set({ user: null }),
        }),
        {
            name: "auth-storage",
            getStorage: () => sessionStorage, 
        }
    )
)

export default useAuthStore;