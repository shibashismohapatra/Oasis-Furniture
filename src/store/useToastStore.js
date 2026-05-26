import { create } from 'zustand';

let _id = 0;

export const useToastStore = create((set, get) => ({
  toasts: [],

  show: (message, type = 'success') => {
    const id = ++_id;
    set(state => ({ toasts: [...state.toasts, { id, message, type }] }));
    setTimeout(() => {
      set(state => ({ toasts: state.toasts.filter(t => t.id !== id) }));
    }, 3000);
  },

  remove: (id) => set(state => ({ toasts: state.toasts.filter(t => t.id !== id) })),
}));