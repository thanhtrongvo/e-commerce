import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      login: (userData, token, refreshToken) => {
        localStorage.setItem("access_token", token);
        localStorage.setItem("refresh_token", refreshToken);
        set({ user: userData, token, isAuthenticated: true });
      },

      logout: () => {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        set({ user: null, token: null, isAuthenticated: false });
      },

      isAdmin: () => {
        const user = get().user;
        return user?.roles?.includes("ROLE_ADMIN") || false;
      },
    }),
    {
      name: "auth-store",
      partialize: (s) => ({
        user: s.user,
        token: s.token,
        isAuthenticated: s.isAuthenticated,
      }),
    },
  ),
);
