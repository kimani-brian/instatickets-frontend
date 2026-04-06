import apiClient from "./client";
import type { User, LoginPayload, RegisterPayload } from "@/types";

interface AuthResponse {
  token: string;
  user: User;
}

export const authApi = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>("/auth/login", payload);
    return data;
  },

  register: async (payload: RegisterPayload): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>(
      "/auth/register",
      payload
    );
    return data;
  },

  validate: async (token: string): Promise<User> => {
    const { data } = await apiClient.get<{ user: User }>("/auth/validate", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return data.user;
  },
};