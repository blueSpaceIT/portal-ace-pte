import { create } from "zustand";
import axiosInstance from "../utils/axiosInstance";

interface User {
  id: string;
  name: string;
  email: string;
  userRole: string;
  organizationId: string | null;
  picture: string;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  loggingOut: boolean;

  setUser: (user: User) => void;
  setAccessToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
  logout: () => Promise<void>;
  initializeAuth: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: true, // ✅ IMPORTANT
  loggingOut: false,

  setUser: (user) =>
    set({
      user,
      isAuthenticated: true,
    }),

  setAccessToken: (token) => set({ accessToken: token }),
  setRefreshToken: (token) => set({ refreshToken: token }),

  initializeAuth: () => {
    if (typeof window === "undefined") return;

    try {
      const accessToken = localStorage.getItem("access_token");
      const refreshToken = localStorage.getItem("refresh_token");
      const storedUser = localStorage.getItem("user");

      let parsedUser: User | null = null;

      if (storedUser && storedUser !== "undefined") {
        parsedUser = JSON.parse(storedUser);
      }

      if (accessToken && parsedUser) {
        set({
          user: parsedUser,
          accessToken,
          refreshToken,
          isAuthenticated: true,
          loading: false,
        });
      } else {
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
          loading: false,
        });
      }
    } catch (error) {
      console.warn("Auth initialization failed:", error);
      set({
        user: null,
        isAuthenticated: false,
        loading: false,
      });
    }
  },

  logout: async () => {
    set({ loggingOut: true });
    try {
      await axiosInstance.post("/auth/logout");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
      localStorage.removeItem("user");

      document.cookie = "access_token=; path=/; max-age=0";
      document.cookie = "refresh_token=; path=/; max-age=0";

      set({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
      });

      window.location.href = "/login";
    }
  },
}));
