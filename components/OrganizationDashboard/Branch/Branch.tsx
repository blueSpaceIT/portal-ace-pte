/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Separator } from "@/components/ui/separator";

import toast from "react-hot-toast";
import {
  createBranch,
  deleteBranch,
  updateBranch,
  useGetAllBranch,
} from "@/service/branch/branchService";
import CustomizeTable from "@/shared/CustomizeTable/CustomizeTable";
import CustomizeModal from "@/shared/CustomizeModal/CustomizeModal";
import AlertDialog from "@/shared/AlertDialog/AlertDialog";
import { TextInput } from "../../Form/TextInput";
import { SingleSelect } from "../../Form/SingleSelect";
import Form from "../../Form/Form";
import { HistoryIcon } from "@/shared/CustomizeTable/SVG/TableIcon";

// Define validation schema for Branch
const BranchSchema = z.object({
  name: z.string().min(1, "Branch name is required"),
  code: z.string().min(1, "Branch code is required"),
  address: z.string().min(1, "Branch address is required"),
  isActive: z.boolean(),
});
type BranchFormData = z.infer<typeof BranchSchema>;

const Branch = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [BranchToDelete, setBranchToDelete] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("");
  const [editingBranch, setEditingBranch] = useState<any>(null);
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

  // Pass correct isActive value to API
  const { BranchData, isLoading, refetch } = useGetAllBranch({
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

  // Initialize form for Branch
  const form = useForm<BranchFormData>({
    resolver: zodResolver(BranchSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      code: "",
      address: "",
      isActive: true,
    },
  });

  // Populate form when editing
  useEffect(() => {
    if (isEditMode && editingBranch) {
      setTimeout(() => {
        form.reset({
          name: editingBranch.name || "",
          code: editingBranch.code || "",
          address: editingBranch.address || "",
          isActive: editingBranch.isActive,
        });
      }, 0);
    }
  }, [editingBranch, isEditMode, form]);

  const columns = [
    { key: "name", label: "Branch Name", sortable: true },
    { key: "code", label: "Code", sortable: true },
    { key: "address", label: "Address", sortable: true },
    {
      key: "isActive",
      label: "Status",
      type: "switch" as const,
      switchType: "status" as const,
    },
  ];

  const totalPages = Math.ceil((BranchData?.meta?.total || 0) / limit);

  const handleView = (row: any) => {
    setIsViewModalOpen(true);
  };

  const handleEdit = (row: any) => {
    setEditingBranch({
      id: row.id,
      name: row.name,
      code: row.code,
      address: row.address,
      isActive: row.isActive,
    });
    setIsEditMode(true);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!BranchToDelete) return;

    try {
      const response = await deleteBranch(BranchToDelete.id);
      if (response?.success) {
        toast.success(response.message || "Branch deleted successfully");
        refetch();
      } else {
        toast.error(response?.message || "Failed to delete Branch");
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete Branch");
    } finally {
      setIsDeleteDialogOpen(false);
      setBranchToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setBranchToDelete(null);
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
  ];

  const onSubmit = async (data: BranchFormData) => {
    setIsSubmitting(true);
    try {
      const organizationId = getOrganizationId();
      let response;
      if (isEditMode && editingBranch) {
        response = await updateBranch(editingBranch.id, {
          ...data,
          organizationId,
        });
      } else {
        response = await createBranch({
          ...data,
          organizationId,
        });
      }
      if (response?.success) {
        toast.success(
          response.message ||
            `Branch ${isEditMode ? "updated" : "created"} successfully`,
        );
        refetch();
        handleCancel();
      } else {
        toast.error(response?.message || "Something went wrong");
      }
    } catch (error: any) {
      toast.error(
        error?.message ||
          `Failed to ${isEditMode ? "update" : "create"} Branch. Please try again.`,
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      setIsEditMode(false);
      setEditingBranch(null);
      form.reset({
        name: "",
        code: "",
        address: "",
        isActive: true,
      });
    }, 300);
  };

  const handleAdd = () => {
    setIsEditMode(false);
    setEditingBranch(null);
    form.reset({
      name: "",
      code: "",
      address: "",
      isActive: true,
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
      //   setSelectedBranchSlug(null);
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

  // Transform API data to table format
  const data =
    BranchData?.data?.map((Branch: any) => ({
      id: Branch.id,
      name: Branch.name,
      code: Branch.code,
      address: Branch.address,
      isActive: Branch.isActive,
    })) || [];

  return (
    <>
      <div className="flex items-center gap-2 mb-2">
        <h2 className="text-[#000000] text-2xl font-semibold">Branches</h2>
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

      {/* Add/Edit Branch Modal */}
      <CustomizeModal
        isOpen={isModalOpen}
        onClose={handleCancel}
        title={isEditMode ? "Edit Branch" : "Add Branch"}
      >
        <Form form={form} onSubmit={onSubmit}>
          <div className="px-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <TextInput
                  name="name"
                  label="Branch Name"
                  placeholder="Enter Branch name"
                  required
                />
              </div>
              <TextInput
                name="code"
                label="Branch Code"
                placeholder="Write Branch Code"
                required
              />
              <TextInput
                name="address"
                label="Address"
                placeholder="Enter Branch Address"
                required
              />
              <div className="sm:col-span-2">
                <SingleSelect
                  name="isActive"
                  label="Status"
                  options={[
                    { label: "Active", value: "true" },
                    { label: "Inactive", value: "false" },
                  ]}
                  placeholder="Select Status"
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
                  ? "Update Branch"
                  : "Add Branch"}
            </button>
          </div>
        </Form>
      </CustomizeModal>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        isOpen={isDeleteDialogOpen}
        onClose={cancelDelete}
        onConfirm={confirmDelete}
        title="Delete Branch"
        description={`Are you sure you want to delete Branch "${BranchToDelete?.name}"? This action cannot be undone.`}
      />
    </>
  );
};

export default Branch;
