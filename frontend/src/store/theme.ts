import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type ThemeState = {
  dark: boolean;
  toggle: () => void;
  apply: () => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      dark: false,
      toggle: () => {
        set((state) => ({ dark: !state.dark }));
        get().apply();
      },
      apply: () => {
        document.documentElement.classList.toggle('dark', get().dark);
      }
    }),
    { name: 'lms-theme' }
  )
);
