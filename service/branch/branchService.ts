/* eslint-disable @typescript-eslint/no-explicit-any */
import axiosInstance from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";

export interface CreateBranchPayload {
  organizationId: string;
  name: string;
  code: string;
  address: string;
  isActive: boolean;
}
interface BranchParams {
  searchTerm?: string;
  limit?: number;
  page?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  isActive?: string;
}
// Create branch
export const createBranch = async (payload: CreateBranchPayload) => {
  try {
    const { data } = await axiosInstance.post("/branch", payload);
    return data;
  } catch (error: any) {
    console.error("Error submitting read aloud response:", error);
    throw error.response?.data || error;
  }
};

// Get all Branch
export const useGetAllBranch = (params?: BranchParams) => {
  const {
    data: BranchData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["Branch", params],
    queryFn: async () => {
      const queryParams: any = {};

      if (params?.searchTerm) queryParams.searchTerm = params.searchTerm;
      if (params?.limit) queryParams.limit = params.limit;
      if (params?.page) queryParams.page = params.page;
      if (params?.sortBy) queryParams.sortBy = params.sortBy;
      if (params?.sortOrder) queryParams.sortOrder = params.sortOrder;
      if (params?.isActive === "true") queryParams.isActive = true;
      else if (params?.isActive === "false") queryParams.isActive = false;

      const res = await axiosInstance.get("/branch", {
        params: queryParams,
      });
      return res.data;
    },
  });

  return { BranchData, isLoading, isError, error, refetch };
};
export const deleteBranch = async (BranchId: string) => {
  try {
    const { data } = await axiosInstance.delete(`/branch/${BranchId}`);
    return data;
  } catch (error: any) {
    console.error("Error deleting Branch:", error);
    throw error.response?.data || error;
  }
};

export const updateBranch = async (
  BranchId: string,
  payload: CreateBranchPayload,
) => {
  try {
    const { data } = await axiosInstance.patch(`/branch/${BranchId}`, payload);
    return data;
  } catch (error: any) {
    console.error("Error updating Branch:", error);
    throw error.response?.data || error;
  }
};
