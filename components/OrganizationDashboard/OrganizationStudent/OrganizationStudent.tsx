/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState } from "react";

import ViewStudentDetails from "./ViewStudentDetails";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Separator } from "@/components/ui/separator";
import {
  deleteUser,
  submitOrganization,
  toggleUserStatus,
  useGetAllUsersOrganization,
} from "@/service/userService/userService";
import toast from "react-hot-toast";
import Loader from "@/utils/Loader";
import { HistoryIcon } from "@/shared/CustomizeTable/SVG/TableIcon";
import CustomizeTable from "@/shared/CustomizeTable/CustomizeTable";
import CustomizeModal from "@/shared/CustomizeModal/CustomizeModal";
import Form from "../../Form/Form";
import { TextInput } from "../../Form/TextInput";
import AlertDialog from "@/shared/AlertDialog/AlertDialog";

// Define validation schema
const studentSchema = z.object({
  name: z.string().min(1, "Student name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  city: z.string().min(1, "City is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type StudentFormData = z.infer<typeof studentSchema>;

const OrganizationStudent = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState<any>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedStudentId, setSelectedStudentId] = useState<string | null>(
    null,
  );

  // Fetch students
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [limit] = useState(10);

  const { usersData, isLoading, refetch } = useGetAllUsersOrganization({
    searchTerm,
    page: currentPage,
    limit,
    status: statusFilter,
  });

  // Initialize form
  const form = useForm<StudentFormData>({
    resolver: zodResolver(studentSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      city: "",
      password: "",
    },
  });

  const columns = [
    { key: "userId", label: "User ID", sortable: true },
    {
      key: "name",
      label: "Name",
      sortable: true,
    },
    { key: "email", label: "Email", sortable: true },
    { key: "phone", label: "Phone" },
    { key: "city", label: "City", sortable: true },
    {
      key: "status",
      label: "Status",
      type: "statusSelect" as const,
    },
  ];
  // Add this handler function after confirmDelete
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const response = await toggleUserStatus(id, newStatus);

      if (response?.success) {
        toast.success(
          response.message ||
            `Student status updated to ${newStatus} successfully`,
        );
        await refetch();
      } else {
        toast.error(response?.message || "Failed to update student status");
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to update student status");
    }
  };

  // Transform API data to table format
  const data =
    usersData?.data?.map((student: any) => ({
      id: student.id,
      userId: student.id.slice(0, 10),
      name: student.name,
      email: student.email,
      phone: student.phone || "N/A",
      city: student.city || "N/A",
      status: student.status, // Use raw status value
      onStatusChange: handleStatusChange,
    })) || [];

  const totalPages = Math.ceil((usersData?.meta?.total || 0) / limit);

  const filters = (
    <>
      <select
        className="px-3 py-1 border border-[#0000002B] rounded-full text-sm"
        value={statusFilter}
        onChange={(e) => {
          setStatusFilter(e.target.value);
          setCurrentPage(1);
        }}
      >
        <option value="">All Status</option>
        <option value="ACTIVE">Active</option>
        <option value="PENDING">Pending</option>
        <option value="INACTIVE">Inactive</option>
        <option value="BLOCKED">Blocked</option>
      </select>
    </>
  );

  const handleView = (row: any) => {
    setSelectedStudentId(row.id);
    setIsViewModalOpen(true);
  };

  const handleDelete = (row: any) => {
    setStudentToDelete(row);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!studentToDelete) return;

    try {
      const response = await deleteUser(studentToDelete.id);
      if (response?.success) {
        toast.success(response.message || "Student deleted successfully");
        refetch();
      } else {
        toast.error(response?.message || "Failed to delete student");
      }
    } catch (error: any) {
      toast.error(error?.message || "Failed to delete student");
    } finally {
      setIsDeleteDialogOpen(false);
      setStudentToDelete(null);
    }
  };

  const cancelDelete = () => {
    setIsDeleteDialogOpen(false);
    setStudentToDelete(null);
  };

  const actions = [
    {
      icon: "eye" as const,
      onClick: (row: any) => handleView(row),
      title: "View",
    },
    {
      icon: "delete" as const,
      onClick: (row: any) => handleDelete(row),
      title: "Delete",
    },
  ];

  const onSubmit = async (data: StudentFormData) => {
    setIsSubmitting(true);
    try {
      const payload = {
        name: data.name,
        phone: data.phone,
        city: data.city,
        email: data.email,
        password: data.password,
      };

      const response = await submitOrganization(payload);

      if (response?.success) {
        toast.success(response.message || "Student created successfully");
        refetch();
        handleCancel();
      } else {
        toast.error(response?.message || "Something went wrong");
      }
    } catch (error: any) {
      console.error("Error submitting student:", error);
      toast.error(
        error?.message || "Failed to create student. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    setTimeout(() => {
      form.reset({
        name: "",
        email: "",
        phone: "",
        city: "",
        password: "",
      });
    }, 300);
  };

  const handleAdd = () => {
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
    // Clear selected student ID after animation completes
    setTimeout(() => {
      setSelectedStudentId(null);
    }, 300);
  };

  return (
    <>
      {isLoading ? (
        <div>
          <Loader />
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-[#000000] text-2xl font-semibold">Student</h2>
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

          {/* Add Student Modal */}
          <CustomizeModal
            isOpen={isModalOpen}
            onClose={handleCancel}
            title="Add Student"
          >
            <Form form={form} onSubmit={onSubmit}>
              <div className="px-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Width Field */}
                  <div className="sm:col-span-2">
                    <TextInput
                      name="name"
                      label="Student Name"
                      placeholder="Enter student name"
                    />
                  </div>

                  {/* Half Width Fields */}
                  <div>
                    <TextInput
                      name="email"
                      type="email"
                      label="Email"
                      placeholder="Enter email address"
                    />
                  </div>

                  <div>
                    <TextInput
                      name="phone"
                      label="Phone"
                      placeholder="Enter phone number"
                    />
                  </div>

                  <div>
                    <TextInput
                      name="city"
                      label="City"
                      placeholder="Enter city"
                    />
                  </div>

                  <div>
                    <TextInput
                      name="password"
                      type="password"
                      label="Password"
                      placeholder="Enter password"
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
                  {isSubmitting ? "Adding..." : "Add Student"}
                </button>
              </div>
            </Form>
          </CustomizeModal>

          {/* View Student Details Modal */}
          <CustomizeModal
            isOpen={isViewModalOpen}
            onClose={handleCloseViewModal}
            title="Student Details"
          >
            <ViewStudentDetails
              studentId={selectedStudentId}
              onClose={handleCloseViewModal}
            />
          </CustomizeModal>

          {/* Delete Confirmation Dialog */}
          <AlertDialog
            isOpen={isDeleteDialogOpen}
            onClose={cancelDelete}
            onConfirm={confirmDelete}
            title="Delete Student"
            description={`Are you sure you want to delete "${studentToDelete?.name}"? This action cannot be undone.`}
          />
        </>
      )}
    </>
  );
};

export default OrganizationStudent;
