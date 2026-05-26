import { create } from 'zustand';

export const useWishlistStore = create((set, get) => ({
  items: [],

  toggle: (product) => {
    const exists = get().items.find(i => i.id === product.id);
    if (exists) {
      set(state => ({ items: state.items.filter(i => i.id !== product.id) }));
      return 'removed';
    } else {
      set(state => ({ items: [...state.items, product] }));
      return 'added';
    }
  },

  isWishlisted: (id) => !!get().items.find(i => i.id === id),
  count: () => get().items.length,
}));