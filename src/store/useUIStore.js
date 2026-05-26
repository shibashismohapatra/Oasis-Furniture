import { create } from 'zustand';

export const useUIStore = create((set) => ({
  menuOpen: false,
  activeSection: 'home',
  toggleMenu: () => set(state => ({ menuOpen: !state.menuOpen })),
  closeMenu: () => set({ menuOpen: false }),
  setActiveSection: (s) => set({ activeSection: s }),
}));