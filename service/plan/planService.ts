/* eslint-disable @typescript-eslint/no-explicit-any */

import axiosInstance from "@/utils/axiosInstance";
import { useQuery } from "@tanstack/react-query";

export interface CreatePlanPayload {
  name: string;
  price: number;
  durationDays: number;
  type: string;
  features: {
    MockTest: number;
    SectionTest: number;
    QuestionTest: number;
  };
}
interface PlanParams {
  searchTerm?: string;
  limit?: number;
  page?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  isActive?: string;
}
// Create batch
export const createPlan = async (payload: CreatePlanPayload) => {
  try {
    const { data } = await axiosInstance.post("/plans", payload);
    return data;
  } catch (error: any) {
    console.error("Error submitting read aloud response:", error);
    throw error.response?.data || error;
  }
};

// Get all Plans
export const useGetAllPlans = (params?: PlanParams) => {
  const {
    data: plansData,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ["plans", params],
    queryFn: async () => {
      const queryParams: any = {};

      if (params?.searchTerm) queryParams.searchTerm = params.searchTerm;
      if (params?.limit) queryParams.limit = params.limit;
      if (params?.page) queryParams.page = params.page;
      if (params?.sortBy) queryParams.sortBy = params.sortBy;
      if (params?.sortOrder) queryParams.sortOrder = params.sortOrder;
      if (params?.isActive === "true") queryParams.isActive = true;
      else if (params?.isActive === "false") queryParams.isActive = false;

      const res = await axiosInstance.get("/plans/all", {
        params: queryParams,
      });
      return res.data;
    },
  });

  return { plansData, isLoading, isError, error, refetch };
};
export const deletePlan = async (planId: string) => {
  try {
    const { data } = await axiosInstance.delete(`/plans/${planId}`);
    return data;
  } catch (error: any) {
    console.error("Error deleting plan:", error);
    throw error.response?.data || error;
  }
};

export const updatePlan = async (
  planId: string,
  payload: CreatePlanPayload,
) => {
  try {
    const { data } = await axiosInstance.patch(`/plans/${planId}`, payload);
    return data;
  } catch (error: any) {
    console.error("Error updating plan:", error);
    throw error.response?.data || error;
  }
};
