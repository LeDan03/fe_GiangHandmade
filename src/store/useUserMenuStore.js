import { create } from "zustand";

const useUserMenuStore = create((set) => ({
    isUserMenuOpen: false,

    openUserMenu: () => set({ isUserMenuOpen: true }),
    closeUserMenu: () => set({ isUserMenuOpen: false }),
    toggleUserMenu: () => set((state) => ({ isUserMenuOpen: !state.isUserMenuOpen })),
}));

export default useUserMenuStore;