/* eslint-disable @typescript-eslint/no-explicit-any */

import { useAuthStore } from "@/store/useAuthStore";

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    accessToken: string;
    refreshToken: string;
    user: {
      id: string;
      name: string;
      email: string;
      userRole: string;
      organizationId: string | null;
      picture: string;
    };
  };
}

export async function loginUser(
  email: string,
  password: string,
): Promise<LoginResponse> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) throw new Error("Login failed");

  const data: LoginResponse = await res.json();

  if (typeof window !== "undefined") {
    // ✅ Save tokens & user to localStorage
    localStorage.setItem("access_token", data.data.accessToken);
    localStorage.setItem("refresh_token", data.data.refreshToken);
    localStorage.setItem("user", JSON.stringify(data.data.user));

    // ✅ Set cookies for middleware
    document.cookie = `access_token=${data.data.accessToken}; path=/; max-age=86400; SameSite=Lax; Secure`;
    document.cookie = `refresh_token=${data.data.refreshToken}; path=/; max-age=604800; SameSite=Lax; Secure`;
  }

  // ✅ Update Zustand state
  const { setUser, setAccessToken, setRefreshToken } = useAuthStore.getState();
  setUser(data.data.user);
  setAccessToken(data.data.accessToken);
  setRefreshToken(data.data.refreshToken);

  // ✅ Handle redirect (middleware adds ?redirect=)
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect");
    window.location.href = redirect || "/dashboard";
  }

  return data;
}

/**
 * 🔹 CHANGE PASSWORD (Requires auth)
 */
export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<{ success: boolean; message: string }> {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/change-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token ? `Bearer ${token}` : "",
      },
      credentials: "include",
      body: JSON.stringify({ currentPassword, newPassword }),
    },
  );

  if (!res.ok) throw new Error("Failed to change password");
  return await res.json();
}

/**
 * 🔹 FORGOT PASSWORD
 */
export async function forgotPassword(
  email: string,
): Promise<{ success: boolean; message: string }> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email }),
    },
  );

  if (!res.ok) throw new Error("Failed to send reset email");
  return await res.json();
}

/**
 * 🔹 RESET PASSWORD (Uses token from reset link)
 */

export async function resetPassword(
  token: string,
  password: string,
): Promise<{ success: boolean; message: string; data: any }> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password?token=${token}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ password }),
    },
  );

  if (!res.ok) throw new Error("Failed to reset password");

  const data = await res.json();

  if (typeof window !== "undefined") {
    // ✅ Save tokens & user to localStorage
    localStorage.setItem("access_token", data.data.accessToken);
    localStorage.setItem("refresh_token", data.data.refreshToken);
    localStorage.setItem("user", JSON.stringify(data.data.user));

    // ✅ Set cookies for middleware
    document.cookie = `access_token=${data.data.accessToken}; path=/; max-age=86400; SameSite=Lax; Secure`;
    document.cookie = `refresh_token=${data.data.refreshToken}; path=/; max-age=604800; SameSite=Lax; Secure`;
  }

  // ✅ Update Zustand state
  const { setUser, setAccessToken, setRefreshToken } = useAuthStore.getState();
  setUser(data.data.user);
  setAccessToken(data.data.accessToken);
  setRefreshToken(data.data.refreshToken);

  // ✅ Handle redirect (middleware adds ?redirect=)
  if (typeof window !== "undefined") {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get("redirect");
    window.location.href = redirect || "/dashboard";
  }

  return data;
}

/**
 * 🔹 LOGOUT USER
 */
export async function logoutUser(): Promise<{
  success: boolean;
  message: string;
}> {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  if (!res.ok) throw new Error("Logout failed");

  if (typeof window !== "undefined") {
    // Clear localStorage + cookies
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user");

    document.cookie = "access_token=; path=/; max-age=0; SameSite=Lax; Secure";
    document.cookie = "refresh_token=; path=/; max-age=0; SameSite=Lax; Secure";
  }

  // Reset Zustand auth state
  const { logout } = useAuthStore.getState();
  logout();

  return await res.json();
}
