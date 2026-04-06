"use client";

import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/stores/authStore";
import { getErrorMessage } from "@/lib/api/client";
import type { LoginFormData, RegisterFormData } from "@/lib/validators/authSchemas";

// Cookies the Next.js middleware reads to protect routes.
// We set them here in the browser alongside the Zustand store.
function setAuthCookie(token: string) {
  // 7-day expiry, SameSite=Strict for CSRF protection
  document.cookie = `instatickets_token=${token}; path=/; max-age=${60 * 60 * 24 * 7}; SameSite=Strict`;
}

function clearAuthCookie() {
  document.cookie =
    "instatickets_token=; path=/; max-age=0; SameSite=Strict";
}

export function useAuth() {
  const router = useRouter();
  const { user, token, isAuthenticated, setAuth, clearAuth } = useAuthStore();

  // --- Login ---
  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      setAuthCookie(data.token);
      toast.success(`Welcome back!`, {
        description: `Logged in as ${data.user.email}`,
      });
      // Redirect based on role
      if (data.user.role === "ORGANIZER") {
        router.push("/organizer");
      } else {
        router.push("/buyer");
      }
    },
    onError: (error) => {
      toast.error("Login failed", {
        description: getErrorMessage(error),
      });
    },
  });

  // --- Register ---
  const registerMutation = useMutation({
    mutationFn: (data: Pick<RegisterFormData, "email" | "password" | "role">) =>
      authApi.register(data),
    onSuccess: (data) => {
      setAuth(data.token, data.user);
      setAuthCookie(data.token);
      toast.success("Account created!", {
        description: `Welcome to InstaTickets, ${data.user.email}`,
      });
      if (data.user.role === "ORGANIZER") {
        router.push("/organizer");
      } else {
        router.push("/buyer");
      }
    },
    onError: (error) => {
      toast.error("Registration failed", {
        description: getErrorMessage(error),
      });
    },
  });

  // --- Logout ---
  function logout() {
    clearAuth();
    clearAuthCookie();
    toast.success("Logged out successfully");
    router.push("/");
  }

  // --- Login handler (called by form) ---
  function login(data: LoginFormData) {
    loginMutation.mutate(data);
  }

  // --- Register handler (called by form) ---
  function register(data: RegisterFormData) {
    registerMutation.mutate({
      email: data.email,
      password: data.password,
      role: data.role,
    });
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    isLoggingIn: loginMutation.isPending,
    isRegistering: registerMutation.isPending,
  };
}