/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Separator } from "@/components/ui/separator";
import toast from "react-hot-toast";
import {
  createMaterialContent,
  deleteMaterialContent,
  updateMaterialContent,
  useGetAllMaterialContents,
} from "@/service/materialContent/materialContent";
import { HistoryIcon } from "@/shared/CustomizeTable/SVG/TableIcon";
import CustomizeTable from "@/shared/CustomizeTable/CustomizeTable";
import CustomizeModal from "@/shared/CustomizeModal/CustomizeModal";
import Form from "../../Form/Form";
import { TextInput } from "../../Form/TextInput";
import { SingleSelect } from "../../Form/SingleSelect";
import AlertDialog from "@/shared/AlertDialog/AlertDialog";
import { RichTextEditor } from "@/components/Form/TextEditor";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import axiosInstance from "@/utils/axiosInstance";

enum OrgContentType {
  STRATEGY = "STRATEGY",
  TEMPLATE = "TEMPLATE",
  GRAMMAR = "GRAMMAR",
}

const MaterialContentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  organizationId: z.string().uuid("Invalid organization ID"),
  type: z.nativeEnum(OrgContentType),
  order: z.number().int("Order must be an integer"),
  description: z.string().min(1, "Description is required"),
  content: z.string().min(1, "Content is required"),
  mediaUrl: z.string().url("Media URL must be a valid URL"),
  isPublished: z.boolean(),
});
type MaterialContentFormData = z.infer<typeof MaterialContentSchema>;

const MaterialContent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [MaterialContentToDelete, setMaterialContentToDelete] =
    useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [editingMaterialContent, setEditingMaterialContent] =
    useState<any>(null);
  const [isEditMode, setIsEditMode] = useState(false);

  // Fetch data
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(10);

  // Get organizationId from localStorage
  const getOrganizationId = () => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("organizationId") || "";
    }
    return "";
  };

  const organizationId = getOrganizationId();
  // Pass correct isActive value to API
  const { materialContentsData, isLoading, refetch } =
    useGetAllMaterialContents(organizationId, {
      searchTerm,
      page: currentPage,
      limit,
      isActive:
        statusFilter === "true"
          ? "true"
          : statusFilter === "false"
            ? "false"
            : undefined,
    });
  console.log(
    "🚀 ~ MaterialContent ~ materialContentsData:",
    materialContentsData,
  );

  // Initialize form for MaterialContent
  const form = useForm<MaterialContentFormData>({
    resolver: zodResolver(MaterialContentSchema),
    mode: "onBlur",
    defaultValues: {
      title: "",
      organizationId: "",
      type: OrgContentType.STRATEGY,
      order: 0,
      description: "",
      content: "",
      mediaUrl: "",
      isPublished: true,
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (isEditMode && editingMaterialContent) {
      setTimeout(() => {
        form.reset({
          title: editingMaterialContent.title || "",
          organizationId: editingMaterialContent.organizationId || "",
          type: editingMaterialContent.type ?? OrgContentType.STRATEGY,
          order: editingMaterialContent.order ?? 0,
          description: editingMaterialContent.description || "",
          content: editingMaterialContent.content || "",
          mediaUrl: editingMaterialContent.mediaUrl || "",
          isPublished: editingMaterialContent.isPublished ?? true,
        });
      }, 0);
    }
  }, [editingMaterialContent, isEditMode, form]);

  // Table columns with custom render for Status
  const columns = [
    { key: "title", label: "MaterialContent Title", sortable: true },
    { key: "type", label: "Type", sortable: true },
    { key: "order", label: "Order", sortable: true },
    {
      key: "isActive",
      label: "Status",
      type: "switch" as const,
      switchType: "status" as const,
    },
  ];

  const totalPages = Math.ceil(
    (materialContentsData?.meta?.total || 0) / limit,
  );

  const handleView = (row: any) => {
    setIsViewModalOpen(true);
  };

  const handleEdit = (row: any) => {
    setEditingMaterialContent({
      id: row.id,
      title: row.title,
      organizationId: row.organizationId,
      type: row.type,
      order: row.order,
      description: row.description,
      content: row.content,
      mediaUrl: row.mediaUrl,
      isPublished: row.isPublished,
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!MaterialContentToDelete) return;

    try {
      const response = await deleteMaterialContent(
        organizationId,
        MaterialContentToDelete.id,
      );
      if (response?.success) {
        toast.success(
          response.message || "MaterialContent deleted successfully",
        );
        refetch();
      } else {
        toast.error(response?.message || "Failed to delete MaterialContent");
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete MaterialContent");
    } finally {
      setIsDeleteDialogOpen(false);
      setMaterialContentToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setMaterialContentToDelete(null);
  };

  const actions = [
    {
      icon: "eye" as const,
      onClick: (row: any) => handleView(row),
      title: "View",
    },
    {
      icon: "edit" as const,
      onClick: (row: any) => handleEdit(row),
      title: "Edit",
    },
    {
      icon: "delete" as const,
      onClick: (row: any) => {
        setMaterialContentToDelete(row);
        setIsDeleteDialogOpen(true);
      },
      title: "Delete",
    },
  ];

  const onSubmit = async (data: MaterialContentFormData) => {
    setIsSubmitting(true);
    try {
      const organizationId = getOrganizationId();
      let isPublished = data.isPublished;
      if (typeof isPublished === "string") {
        isPublished = isPublished === "true";
      }
      let payload = { ...data, organizationId, isPublished };
      if (!isEditMode) {
        payload.order = (materialContentsData?.meta?.total || 0) + 1;
      }

      let response;
      if (isEditMode && editingMaterialContent) {
        response = await updateMaterialContent(
          organizationId,
          editingMaterialContent.id,
          payload,
        );
      } else {
        response = await createMaterialContent(organizationId, payload);
      }
      if (response?.success) {
        toast.success(
          response.message ||
            `Material Content ${isEditMode ? "updated" : "created"} successfully`,
        );
        refetch();
        handleCancel();
      } else {
        toast.error(response?.message || "Something went wrong");
      }
    } catch (error: any) {
      toast.error(
        error?.message ||
          `Failed to ${isEditMode ? "update" : "create"} Material Content. Please try again.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setIsEditMode(false);
      setEditingMaterialContent(null);
      form.reset({
        title: "",
        organizationId: getOrganizationId(),
        type: OrgContentType.STRATEGY,
        order: 0,
        description: "",
        content: "",
        mediaUrl: "",
        isPublished: false,
      });
    }, 300);
  };

  const handleAdd = () => {
    setIsEditMode(false);
    setEditingMaterialContent(null);
    form.reset({
      title: "",
      organizationId: getOrganizationId(),
      type: OrgContentType.STRATEGY,
      order: 0,
      description: "",
      content: "",
      mediaUrl: "",
      isPublished: false,
    });
    setIsModalOpen(true);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (term: string) => {
    if (term !== searchTerm) {
      setCurrentPage(1);
    }
    setSearchTerm(term);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setTimeout(() => {
      //   setSelectedMaterialContentSlug(null);
    }, 300);
  };

  const filters = (
    <>
      <select
        className="px-3 py-1 border border-[#0000002B] rounded-full text-sm"
        onChange={(e) => setStatusFilter(e.target.value)}
        value={statusFilter}
      >
        <option value="">Select Status</option>
        <option value="true">Active</option>
        <option value="false">Inactive</option>
      </select>
    </>
  );

  const handleToggleActive = async (id: string, currentActive: boolean) => {
    try {
      const newActive = !currentActive;
      const res = await axiosInstance.patch(
        `/org-content/org/${organizationId}/contents/${id}`,
        {
          isActive: newActive,
        },
      );

      if (res.data?.success === true) {
        toast.success(
          res?.data?.message ||
            `MaterialContent ${
              newActive ? "activated" : "deactivated"
            } successfully`,
        );
        await refetch();
      } else {
        toast.error(
          res?.data?.message ||
            `Failed to ${newActive ? "activate" : "deactivate"} MaterialContent`,
        );
      }
    } catch (error: any) {
      const errorMessage =
        error?.response?.data?.message ||
        `Failed to ${currentActive ? "activate" : "deactivate"} MaterialContent`;
      toast.error(errorMessage);
    }
  };

  // Transform API data to table format
  const data =
    materialContentsData?.data?.map((MaterialContent: any) => ({
      id: MaterialContent.id,
      title: MaterialContent.title,
      type: MaterialContent.type,
      order: MaterialContent.order,
      isPublished: MaterialContent.isPublished ? "Active" : "Inactive",
      description: MaterialContent.description,
      content: MaterialContent.content,
      mediaUrl: MaterialContent.mediaUrl,
      organizationId: MaterialContent.organizationId,
      onToggleActive: (id: string, currentActive: boolean) =>
        handleToggleActive(id, currentActive),
    })) || [];

  return (
    <>
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-[#000000] text-2xl font-semibold">
          Material Contents
        </h2>
        <span>
          <HistoryIcon />
        </span>
      </div>
      <CustomizeTable
        columns={columns}
        data={data}
        filters={filters}
        actions={actions}
        onAdd={handleAdd}
        isLoading={isLoading}
        currentPage={currentPage}
        onPageChange={handlePageChange}
        onSearchChange={handleSearchChange}
        totalPages={totalPages}
      />

      {/* Add/Edit MaterialContent Modal */}
      <CustomizeModal
        isOpen={isModalOpen}
        onClose={handleCancel}
        title={isEditMode ? "Edit MaterialContent" : "Add MaterialContent"}
      >
        <Form form={form} onSubmit={onSubmit}>
          <div className="px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <TextInput
                  name="title"
                  label="Material Content Title"
                  placeholder="Enter Material Content title"
                  required
                />
              </div>
              <SingleSelect
                name="type"
                label="Type"
                options={[
                  { label: "STRATEGY", value: "STRATEGY" },
                  { label: "TEMPLATE", value: "TEMPLATE" },
                  { label: "GRAMMAR", value: "GRAMMAR" },
                ]}
                placeholder="Select Type"
                required
              />
              <TextInput
                name="description"
                label="Description"
                placeholder="Enter Description"
                required
              />

              <TextInput
                name="mediaUrl"
                label="Media URL"
                placeholder="Enter Media URL"
                required
              />
              <div className=" w-full">
                <label className="block text-sm font-medium mb-1">Status</label>
                <Select
                  value={form.watch("isPublished") ? "true" : "false"}
                  onValueChange={(val) =>
                    form.setValue("isPublished", val === "true")
                  }
                  name="isPublished"
                  required
                >
                  <SelectTrigger className="w-full px-3 py-0.5 border border-[#0000002B] rounded-md text-sm">
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="true">Active</SelectItem>
                    <SelectItem value="false">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="sm:col-span-2">
                <RichTextEditor
                  value={form.watch("content")}
                  onChange={(val) => form.setValue("content", val)}
                  label="Content"
                  placeholder="Enter Content"
                  required
                />
              </div>
            </div>
          </div>

          <Separator className="my-3" />
          <div className="flex items-center justify-end gap-3 p-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="px-6 py-1.5 cursor-pointer rounded-full text-sm font-medium transition-colors bg-[#F6F6F6] border border-[#0000002B] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-1.5 cursor-pointer rounded-full text-sm font-medium transition-colors bg-[#1E2F96] text-white disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting
                ? isEditMode
                  ? "Updating..."
                  : "Adding..."
                : isEditMode
                  ? "Update MaterialContent"
                  : "Add MaterialContent"}
            </button>
          </div>
        </Form>
      </CustomizeModal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteDialogOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete MaterialContent"
        description={`Are you sure you want to delete MaterialContent "${MaterialContentToDelete?.name}"? This action cannot be undone.`}
      />
    </>
  );
};

export default MaterialContent;
