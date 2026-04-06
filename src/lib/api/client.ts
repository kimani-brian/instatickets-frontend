import axios, { AxiosError, AxiosResponse } from "axios";

// Create a single Axios instance for the entire app.
// Every API call goes through this instance — interceptors apply globally.
const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // 15 second timeout
});

// --- Request interceptor ---
// Attaches the JWT token to every outgoing request automatically.
// Handlers and hooks never need to manually set Authorization headers.
apiClient.interceptors.request.use(
  (config) => {
    // Read the token from localStorage (set by the auth store on login)
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("instatickets_token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// --- Response interceptor ---
// Handles auth errors globally — if the server returns 401,
// clear the token and redirect to login.
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear stale token
      if (typeof window !== "undefined") {
        localStorage.removeItem("instatickets_token");
        localStorage.removeItem("instatickets_user");
        // Only redirect if we're not already on the login page
        if (!window.location.pathname.includes("/login")) {
          window.location.href = "/login";
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;

// --- Helper to extract error message from any API error ---
// Works whether the server returned { error: "..." } or { message: "..." }
export function getErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return (
      error.response?.data?.error ??
      error.response?.data?.message ??
      error.message ??
      "An unexpected error occurred"
    );
  }
  if (error instanceof Error) return error.message;
  return "An unexpected error occurred";
}