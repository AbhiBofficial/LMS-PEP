import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AuthResponse, UserSummary } from '../types/api';

type AuthState = {
  accessToken?: string;
  refreshToken?: string;
  user?: UserSummary;
  roles: string[];
  setAuth: (response: AuthResponse) => void;
  clearAuth: () => void;
  isStaff: () => boolean;
  isAdmin: () => boolean;
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      roles: [],
      setAuth: (response) =>
        set({
          accessToken: response.accessToken,
          refreshToken: response.refreshToken,
          user: response.user,
          roles: response.roles
        }),
      clearAuth: () => set({ accessToken: undefined, refreshToken: undefined, user: undefined, roles: [] }),
      isStaff: () => get().roles.includes('ADMIN') || get().roles.includes('LIBRARIAN'),
      isAdmin: () => get().roles.includes('ADMIN')
    }),
    { name: 'lms-auth' }
  )
);
