/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";

interface OrganizationParams {
  searchTerm?: string;
  limit?: number;
  page?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}
export interface brandingPayload {
  portalTitle: string;
  primaryColor: string;
  secondaryColor: string;
  supportEmail: string;
  whatsapp: string;
}

// Create Organization
export const createOrganization = async (payload: FormData) => {
  try {
    const { data } = await axiosInstance.post("/organization", payload, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data;
  } catch (error: any) {
    console.error("Error submitting read aloud response:", error);
    throw error.response?.data || error;
  }
};

// Update Organization (using ID)
export const updateOrganization = async (
  payload: FormData,
  organizationId: string,
) => {
  try {
    const { data } = await axiosInstance.patch(
      `/organization/${organizationId}`,
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return data;
  } catch (error: any) {
    console.error("Error updating organization:", error);
    throw error.response?.data || error;
  }
};

// Delete Organization (using ID)
export const deleteOrganization = async (organizationId: string) => {
  try {
    const { data } = await axiosInstance.delete(
      `/organization/${organizationId}/branding`,
    );
    return data;
  } catch (error: any) {
    console.error("Error deleting organization:", error);
    throw error.response?.data || error;
  }
};

// Get All Organizations
export const useGetAllOrganizations = (params?: OrganizationParams) => {
  const {
    data: organizationsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["organization", params],
    queryFn: async () => {
      const queryParams: any = {};

      if (params?.searchTerm) queryParams.searchTerm = params.searchTerm;
      if (params?.limit) queryParams.limit = params.limit;
      if (params?.page) queryParams.page = params.page;
      if (params?.sortBy) queryParams.sortBy = params.sortBy;
      if (params?.sortOrder) queryParams.sortOrder = params.sortOrder;

      const res = await axiosInstance.get("/organization", {
        params: queryParams,
      });
      return res.data;
    },
  });

  return { organizationsData, isLoading, isError, error, refetch };
};

// Get Single Organization by Slug (for view details)
export const useGetOrganizationBySlug = (
  slug: string | null,
  enabled = true,
) => {
  const {
    data: organizationData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["organization-slug", slug],
    queryFn: async () => {
      if (!slug) return null;
      const res = await axiosInstance.get(`/organization/${slug}`);
      return res.data;
    },
    enabled: !!slug && enabled,
  });

  return { organizationData, isLoading, isError, error, refetch };
};

export const handleToggleActive = async (
  id: string,
  currentActive: boolean,
  refetch: () => Promise<any>,
) => {
  try {
    const newActive = !currentActive;
    const res = await axiosInstance.patch(`/organization/${id}/status`, {
      isActive: newActive,
    });

    if (res.data?.success === true) {
      toast.success(
        res?.data?.message ||
          `ModuleContent ${
            newActive ? "activated" : "deactivated"
          } successfully`,
      );
      await refetch();
    } else {
      toast.error(
        res?.data?.message ||
          `Failed to ${newActive ? "activate" : "deactivate"} ModuleContent`,
      );
    }
  } catch (error: any) {
    const errorMessage =
      error?.response?.data?.message ||
      `Failed to ${currentActive ? "activate" : "deactivate"} ModuleContent`;
    toast.error(errorMessage);
  }
};

export const assignAdmin = async (organizationId: string, userId: string) => {
  try {
    const res = await axiosInstance.post(
      `/organization/${organizationId}/admin`,
      { userId },
    );
    return res.data;
  } catch (error: any) {
    console.error("Error assigning admin:", error);
    throw error.response?.data || error;
  }
};

// only for organization branding
export const getSingleOrganizationBranding = async (organizationId: string) => {
  try {
    const { data } = await axiosInstance.get(
      `/organization/${organizationId}/branding`,
    );
    return data;
  } catch (error: any) {
    console.error("Error fetching organization branding:", error);
    throw error.response?.data || error;
  }
};

export const updateOrganizationBranding = async (
  payload: brandingPayload,
  organizationId: string,
) => {
  try {
    const { data } = await axiosInstance.patch(
      `/organization/${organizationId}/branding`,
      payload,
    );
    return data;
  } catch (error: any) {
    console.error("Error updating organization branding:", error);
    throw error.response?.data || error;
  }
};
