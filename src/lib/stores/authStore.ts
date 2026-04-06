"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, AuthState } from "@/types";

// Zustand auth store with localStorage persistence.
// persist() serialises the store to localStorage automatically —
// the user stays logged in across page refreshes.
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,

      setAuth: (token: string, user: User) => {
        // Also store in localStorage for the Axios interceptor to read
        // (Zustand's persist stores under a key, Axios reads directly)
        localStorage.setItem("instatickets_token", token);
        localStorage.setItem("instatickets_user", JSON.stringify(user));
        set({ token, user, isAuthenticated: true });
      },

      clearAuth: () => {
        localStorage.removeItem("instatickets_token");
        localStorage.removeItem("instatickets_user");
        set({ token: null, user: null, isAuthenticated: false });
      },
    }),
    {
      name: "instatickets_auth", // localStorage key
      // Only persist these fields — don't persist functions
      partialize: (state) => ({
        token: state.token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);