/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React from "react";
import { Loader2 } from "lucide-react";
import { useGetSingleUser } from "@/service/userService/userService";

interface ViewStudentDetailsProps {
  studentId: string | null;
  onClose?: () => void;
}

const ViewStudentDetails: React.FC<ViewStudentDetailsProps> = ({
  studentId,
  onClose,
}) => {
  const { userData, isLoading, isError, error } = useGetSingleUser(studentId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#1E2F96]" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-600">
          {(error as any)?.message || "Failed to load student details"}
        </p>
      </div>
    );
  }

  const student = userData?.data;

  if (!student) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-600">No student data found</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="space-y-6">
        {/* Basic Information */}
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Basic Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">Name</label>
              <p className="text-base text-gray-900 mt-1">{student.name}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Email</label>
              <p className="text-base text-gray-900 mt-1">{student.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Phone</label>
              <p className="text-base text-gray-900 mt-1">{student.phone}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">City</label>
              <p className="text-base text-gray-900 mt-1">
                {student.city || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                User ID
              </label>
              <p className="text-gray-900 mt-1 font-mono text-xs break-all">
                {student.id}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Status
              </label>
              <p className="mt-1">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    student.status === "ACTIVE"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {student.status}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Account Information
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium text-gray-600">
                User Role
              </label>
              <p className="text-base text-gray-900 mt-1">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                  {student.userRole}
                </span>
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Email Verified
              </label>
              <p className="mt-1">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    student.emailVerified
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {student.emailVerified ? "Verified" : "Not Verified"}
                </span>
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Phone Verified
              </label>
              <p className="mt-1">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    student.phoneVerified
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {student.phoneVerified ? "Verified" : "Not Verified"}
                </span>
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Organization
              </label>
              <p className="text-base text-gray-900 mt-1">
                {student.organization?.name || "N/A"}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Profile Picture
              </label>
              <p className="text-base text-gray-900 mt-1">
                {student.picture ? (
                  <img
                    src={student.picture}
                    alt={student.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <span className="text-gray-500">No picture</span>
                )}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">
                Account Status
              </label>
              <p className="mt-1">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                    !student.isDeleted
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {student.isDeleted ? "Deleted" : "Active"}
                </span>
              </p>
            </div>
          </div>
        </div>

        {/* Organization Information */}
        {student.organizationId && (
          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Organization Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Organization ID
                </label>
                <p className="text-base text-gray-900 mt-1 font-mono break-all">
                  {student.organizationId}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ViewStudentDetails;
