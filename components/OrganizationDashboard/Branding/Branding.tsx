"use client";

import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

import toast from "react-hot-toast";
import {
  getSingleOrganizationBranding,
  updateOrganizationBranding,
} from "@/service/organization/organizationService";
import Form from "../../Form/Form";
import { TextInput } from "../../Form/TextInput";

type BrandingFormValues = {
  portalTitle: string;
  primaryColor: string;
  secondaryColor: string;
  supportEmail: string;
  whatsapp: string;
};

const Branding = () => {
  const [loading, setLoading] = useState(false);
  const organizationId =
    typeof window !== "undefined"
      ? localStorage.getItem("organizationId")
      : null;
  console.log("🚀 ~ Branding ~ organizationId:", organizationId);

  const form = useForm<BrandingFormValues>({
    defaultValues: {
      portalTitle: "",
      primaryColor: "",
      secondaryColor: "",
      supportEmail: "",
      whatsapp: "",
    },
  });

  // Fetch branding data on mount

  useEffect(() => {
    const fetchBranding = async () => {
      if (!organizationId) return;
      setLoading(true);
      try {
        const res = await getSingleOrganizationBranding(organizationId);
        const branding = res.data; // <-- fix here
        console.log("🚀 ~ fetchBranding ~ branding:", branding);
        form.reset({
          portalTitle: branding.portalTitle || "",
          primaryColor: branding.primaryColor || "",
          secondaryColor: branding.secondaryColor || "",
          supportEmail: branding.supportEmail || "",
          whatsapp: branding.whatsapp || "",
        });
      } catch (err) {
        toast.error("Failed to load branding data");
      } finally {
        setLoading(false);
      }
    };
    fetchBranding();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [organizationId]);

  const onSubmit = async (values: BrandingFormValues) => {
    if (!organizationId) {
      toast.error("Organization ID not found");
      return;
    }
    setLoading(true);
    try {
      const payload = {
        portalTitle: values.portalTitle,
        primaryColor: values.primaryColor,
        secondaryColor: values.secondaryColor,
        supportEmail: values.supportEmail,
        whatsapp: values.whatsapp,
      };

      await updateOrganizationBranding(payload, organizationId);
      toast.success("Branding updated successfully");
    } catch (err) {
      toast.error("Failed to update branding");
    } finally {
      setLoading(false);
    }
  };

  //   if (loading) {
  //     return <Loader />;
  //   }
  return (
    <div className="bg-white rounded shadow-md p-4">
      <Form form={form} onSubmit={onSubmit}>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextInput
            label="Portal Title"
            name="portalTitle"
            placeholder="Enter Portal Title"
          />
          <TextInput
            label="Primary Color"
            name="primaryColor"
            placeholder="#22C55E"
          />
          <TextInput
            label="Secondary Color"
            name="secondaryColor"
            placeholder="#020617"
          />
          <TextInput
            label="Support Email"
            name="supportEmail"
            placeholder="help@alpha.com"
          />
          <div className="sm:col-span-2">
            <TextInput
              label="WhatsApp"
              name="whatsapp"
              placeholder="+8801911122233"
            />
          </div>
        </div>
        <div className="mt-3">
          <button
            type="submit"
            className="bg-primary text-white px-8 py-2"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update"}
          </button>
        </div>
      </Form>
    </div>
  );
};

export default Branding;
