/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";
import { getSingleOrganizationBranding } from "../service/organization/organizationService";

interface BrandingState {
  branding: any;
  loading: boolean;
  fetched: boolean;
  fetchBranding: (orgId: string) => Promise<void>;
  clearBranding: () => void;
}

export const useBrandingStore = create<BrandingState>((set) => ({
  branding: null,
  loading: false,
  fetched: false,
  fetchBranding: async (orgId: string) => {
    set({ loading: true });
    try {
      const data = await getSingleOrganizationBranding(orgId);
      set({ branding: data, fetched: true });
    } catch {
      set({ branding: null, fetched: true });
    } finally {
      set({ loading: false });
    }
  },
  clearBranding: () => set({ branding: null, fetched: false }),
}));
