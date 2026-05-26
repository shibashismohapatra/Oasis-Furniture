import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  items: [],
  isOpen: false,

  addItem: (product) => {
    const existing = get().items.find(i => i.id === product.id);
    if (existing) {
      set(state => ({ items: state.items.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i) }));
    } else {
      set(state => ({ items: [...state.items, { ...product, qty: 1 }] }));
    }
  },

  removeItem: (id) => set(state => ({ items: state.items.filter(i => i.id !== id) })),

  updateQty: (id, qty) => set(state => ({
    items: qty < 1
      ? state.items.filter(i => i.id !== id)
      : state.items.map(i => i.id === id ? { ...i, qty } : i)
  })),

  total: () => get().items.reduce((sum, i) => sum + i.price * i.qty, 0),
  count: () => get().items.reduce((sum, i) => sum + i.qty, 0),

  clearCart: () => set({ items: [] }),
  toggleCart: () => set(state => ({ isOpen: !state.isOpen })),
  closeCart: () => set({ isOpen: false }),
}));