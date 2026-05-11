import { create } from "zustand";

type AuthState = {
  isAuthenticated: boolean;
  login: () => void;
  register: () => void;
  logout: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  login: () => set({ isAuthenticated: true }),
  register: () => set({ isAuthenticated: true }),
  logout: () => set({ isAuthenticated: false }),
}));
