import axios from "axios";
// import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token =
      typeof window !== "undefined"
        ? localStorage.getItem("access_token")
        : null;

    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle only 401 errors once
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        // const refreshToken = Cookies.get("refreshToken");
        const refreshToken = localStorage.getItem("refresh_token");
        if (!refreshToken) throw new Error("No refresh token found in cookies");

        const { data } = await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/auth/refresh-token`,
          {},
          {
            headers: { Authorization: refreshToken },
            withCredentials: true,
          },
        );

        localStorage.setItem("access_token", data.data.accessToken);
        originalRequest.headers.Authorization = data.data.accessToken;

        // retry original request with new token
        return axiosInstance(originalRequest);
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          console.error(
            "🔴 Refresh failed:",
            err.response?.data || err.message,
          );
        } else if (err instanceof Error) {
          console.error("🔴 Refresh failed:", err.message);
        } else {
          console.error("🔴 Refresh failed: Unknown error", err);
        }

        // localStorage.removeItem("access_token");
        // Cookies.remove("refresh_token");
        // window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  },
);

export default axiosInstance;
