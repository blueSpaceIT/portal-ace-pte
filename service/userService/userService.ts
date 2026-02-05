/* eslint-disable @typescript-eslint/no-explicit-any */

import axiosInstance from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";

interface UserParams {
  searchTerm?: string;
  limit?: number;
  page?: number;
  status?: string;
  userRole?: string;
}

interface UserPayload {
  name: string;
  phone: string;
  city: string;
  email: string;
  password: string;
}

// User role to endpoint mapping
const USER_ROLE_ENDPOINTS: Record<string, string> = {
  STUDENT: "/user/create-student",
  ADMIN: "/user/create-admin",
  TEACHER: "/user/create-teacher",
  ACCOUNTANT: "/user/create-accountant",
};

export const submitUser = async (
  payload: UserPayload,
  role: string = "STUDENT",
) => {
  try {
    const endpoint = USER_ROLE_ENDPOINTS[role];

    if (!endpoint) {
      throw new Error(`Invalid user role: ${role}`);
    }

    const { data } = await axiosInstance.post(endpoint, payload);
    return data;
  } catch (error: any) {
    console.error("Error submitting user:", error);
    throw error.response?.data || error;
  }
};
export const submitOrganization = async (payload: UserPayload) => {
  try {
    const { data } = await axiosInstance.post(
      "user/org/create-student",
      payload,
    );
    return data;
  } catch (error: any) {
    console.error("Error submitting user:", error);
    throw error.response?.data || error;
  }
};

export const useGetAllUsers = (params?: UserParams) => {
  const {
    data: usersData = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["users", params],
    queryFn: async () => {
      const queryParams: any = {};

      if (params?.searchTerm) queryParams.searchTerm = params.searchTerm;
      if (params?.limit) queryParams.limit = params.limit;
      if (params?.page) queryParams.page = params.page;
      if (params?.status) queryParams.status = params.status;
      if (params?.userRole) queryParams.userRole = params.userRole;

      const res = await axiosInstance.get("/user", {
        params: queryParams,
      });
      return res.data;
    },
  });

  return { usersData, isLoading, isError, error, refetch };
};
export const useGetAllUsersOrganization = (params?: UserParams) => {
  const {
    data: usersData = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["organization-users", params],
    queryFn: async () => {
      const queryParams: any = {};

      if (params?.searchTerm) queryParams.searchTerm = params.searchTerm;
      if (params?.limit) queryParams.limit = params.limit;
      if (params?.page) queryParams.page = params.page;
      if (params?.status) queryParams.status = params.status;
      // if (params?.userRole) queryParams.userRole = params.userRole;

      const res = await axiosInstance.get("/user/org/students", {
        params: queryParams,
      });
      return res.data;
    },
  });

  return { usersData, isLoading, isError, error, refetch };
};

export const useGetSingleUser = (userId: string | null, enabled = true) => {
  const {
    data: userData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["user", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User ID is required");
      const res = await axiosInstance.get(`/user/${userId}`);
      return res.data;
    },
    enabled: enabled && !!userId,
  });

  return { userData, isLoading, isError, error, refetch };
};

export const deleteUser = async (userId: string) => {
  try {
    const { data } = await axiosInstance.delete(`/user/${userId}`);
    return data;
  } catch (error: any) {
    console.error("Error deleting user:", error);
    throw error.response?.data || error;
  }
};

export const toggleUserStatus = async (userId: string, newStatus: string) => {
  try {
    const { data } = await axiosInstance.patch(`/user/${userId}/status`, {
      status: newStatus,
    });
    return data;
  } catch (error: any) {
    console.error("Error toggling user status:", error);
    throw error.response?.data || error;
  }
};
