/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";

export interface CreateMaterialContentPayload {
  title: string;
  organizationId: string;
  type: "STRATEGY" | "TEMPLATE" | "GRAMMAR";
  order: number;
  description: string;
  content: string;
  mediaUrl: string;
  isPublished: boolean;
}
interface MaterialContentParams {
  searchTerm?: string;
  limit?: number;
  page?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  isActive?: string;
}
// Create batch
export const createMaterialContent = async (
  organizationId: string,
  payload: CreateMaterialContentPayload,
) => {
  try {
    const { data } = await axiosInstance.post(
      `/org-content/org/${payload.organizationId}/contents`,
      payload,
    );
    return data;
  } catch (error: any) {
    console.error("Error submitting read aloud response:", error);
    throw error.response?.data || error;
  }
};

// Get all MaterialContents
export const useGetAllMaterialContents = (
  organizationId: string,
  params?: MaterialContentParams,
) => {
  const {
    data: materialContentsData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["materialContents", organizationId, params],
    queryFn: async () => {
      const queryParams: any = {};

      if (params?.searchTerm) queryParams.searchTerm = params.searchTerm;
      if (params?.limit) queryParams.limit = params.limit;
      if (params?.page) queryParams.page = params.page;
      if (params?.sortBy) queryParams.sortBy = params.sortBy;
      if (params?.sortOrder) queryParams.sortOrder = params.sortOrder;
      if (params?.isActive === "true") queryParams.isActive = true;
      else if (params?.isActive === "false") queryParams.isActive = false;

      const res = await axiosInstance.get(
        `/org-content/org/${organizationId}/contents`,
        {
          params: queryParams,
        },
      );
      return res.data;
    },
  });

  return { materialContentsData, isLoading, isError, error, refetch };
};
export const deleteMaterialContent = async (
  organizationId: string,
  materialContentId: string,
) => {
  try {
    const { data } = await axiosInstance.delete(
      `/org-content/org/${organizationId}/contents/${materialContentId}`,
    );
    return data;
  } catch (error: any) {
    console.error("Error deleting material content:", error);
    throw error.response?.data || error;
  }
};

export const updateMaterialContent = async (
  organizationId: string,
  materialContentId: string,
  payload: CreateMaterialContentPayload,
) => {
  try {
    const { data } = await axiosInstance.patch(
      `/org-content/org/${organizationId}/contents/${materialContentId}`,
      payload,
    );
    return data;
  } catch (error: any) {
    console.error("Error updating material content:", error);
    throw error.response?.data || error;
  }
};

export const getSingleMaterialContent = async (
  organizationId: string,
  materialContentId: string,
) => {
  try {
    const { data } = await axiosInstance.get(
      `/org-content/org/${organizationId}/contents/${materialContentId}`,
    );
    return data;
  } catch (error: any) {
    console.error("Error fetching single material content:", error);
    throw error.response?.data || error;
  }
};
