/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import React, { useState, useMemo, useEffect } from "react";
import {
  ArchiveIcon,
  AssignIcon,
  DeleteIcon,
  EditIcon,
  EyeIcon,
  ProfileIcon,
  RestoreIcon,
} from "./SVG/TableIcon";
import { BsThreeDotsVertical } from "react-icons/bs";

import Image from "next/image";
import { Separator } from "@/components/ui/separator";
import Pagination from "../Pagination";
import { Search } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { PiStudentBold } from "react-icons/pi";
import Loader from "@/utils/Loader";

interface Column {
  key: string;
  label: string;
  sortable?: boolean;
  type?:
    | "underline"
    | "badge"
    | "status"
    | "default"
    | "image"
    | "switch"
    | "statusSelect"
    | "restore/archive"
    | "isPublished";

  switchType?: "status" | "feature" | "restore/archive";
}

interface ActionButton {
  icon: "delete" | "edit" | "profile" | "eye" | "assign" | "assign student";
  onClick: (row: any) => void;
  title?: string;
  disabled?: boolean;
}

interface CustomizeTableProps {
  columns: Column[];
  data: any[];
  onAdd?: () => void;
  searchPlaceholder?: string;
  filters?: React.ReactNode;
  actions?: ActionButton[] | ((row: any) => ActionButton[]);
  title?: string;
  currentPage?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  itemsPerPage?: number;
  onSearchChange?: (searchTerm: string) => void;
  isLoading?: boolean;
  onSort?: (columnKey: string, direction: "asc" | "desc") => void;
}

const CustomizeTable: React.FC<CustomizeTableProps> = ({
  columns,
  data,
  onAdd,
  searchPlaceholder = "Search student",
  filters,
  actions = [],
  title,
  itemsPerPage = 10,
  onSearchChange,
  isLoading = false,
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  onSort,
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [goToPageValue, setGoToPageValue] = useState("");

  // Debounce search
  useEffect(() => {
    if (onSearchChange) {
      const timer = setTimeout(() => {
        onSearchChange(searchTerm);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [searchTerm, onSearchChange]);

  const filteredData = useMemo(() => {
    if (onSearchChange) {
      return data;
    }

    if (!searchTerm) return data;

    return data.filter((row) =>
      columns.some((column) => {
        const value = row[column.key];
        return value
          ?.toString()
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      }),
    );
  }, [data, searchTerm, columns, onSearchChange]);

  const handleSort = (columnKey: string) => {
    const newDirection =
      sortColumn === columnKey && sortDirection === "asc" ? "desc" : "asc";

    setSortColumn(columnKey);
    setSortDirection(newDirection);

    // Call parent handler if provided (for API sorting)
    if (onSort) {
      onSort(columnKey, newDirection);
    }
  };

  const paginatedData = useMemo(() => {
    if (onSearchChange) {
      return filteredData;
    }

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, itemsPerPage, onSearchChange]);

  const handlePageChange = (page: number) => {
    if (onPageChange) {
      onPageChange(page);
    }
  };

  // Render cell based on type
  const renderCell = (column: Column, value: any, row?: any) => {
    switch (column.type) {
      case "image":
        return (
          <Image
            src={value}
            alt="thumbnail"
            className="w-12 h-12 rounded object-cover"
            width={48}
            height={48}
          />
        );
      case "underline":
        return <span className="underline font-medium">{value}</span>;

      case "badge":
        const badgeColors: { [key: string]: string } = {
          "90-days (Plan 2)": "bg-green-100 text-green-700",
          "30-days (Plan 1)": "bg-green-100 text-green-700",
          "60-days (Plan 1)": "bg-green-100 text-green-700",
          Free: "bg-red-100 text-red-700",
        };
        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              badgeColors[value] || "bg-gray-100 text-gray-700"
            }`}
          >
            {value}
          </span>
        );

      case "status":
        return (
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              value === "Active"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {value}
          </span>
        );
      case "statusSelect":
        const getStatusedColor = (status: string) => {
          switch (status) {
            case "ACTIVE":
              return "bg-green-100 text-green-700 border-green-300";
            case "INACTIVE":
              return "bg-gray-100 text-gray-700 border-gray-300";
            default:
              return "bg-gray-100 text-gray-700 border-gray-300";
          }
        };

        return (
          <select
            value={value}
            onChange={(e) => {
              if (row.onStatusChange) {
                row.onStatusChange(row.id, e.target.value);
              }
            }}
            className={`px-3 py-1 rounded-full text-xs font-medium border cursor-pointer transition-colors focus:outline-none  ${getStatusedColor(
              value,
            )}`}
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        );

      case "statusSelect":
        const getStatusColor = (status: string) => {
          switch (status) {
            case "PUBLISHED":
              return "bg-green-100 text-green-700 border-green-300";
            case "DRAFT":
              return "bg-yellow-100 text-yellow-700 border-yellow-300";
            case "ARCHIVED":
              return "bg-gray-100 text-gray-700 border-gray-300";
            default:
              return "bg-gray-100 text-gray-700 border-gray-300";
          }
        };

        return (
          <select
            value={value}
            onChange={(e) => {
              if (row.onStatusChange) {
                row.onStatusChange(row.id, e.target.value);
              }
            }}
            className={`px-3 py-0.5 rounded-full text-xs font-medium border cursor-pointer transition-colors focus:outline-none  ${getStatusColor(
              value,
            )}`}
            disabled={row.isDeleted}
          >
            <option value="DRAFT">Draft</option>
            <option value="PUBLISHED">Published</option>
            <option value="ARCHIVED">Archived</option>
          </select>
        );

      case "switch":
        // isActive switch
        if (column.key === "isActive") {
          return (
            <div className="flex cursor-pointer items-center gap-2">
              <Switch
                checked={row.isActive}
                onCheckedChange={() => {
                  if (row.onToggleActive) {
                    row.onToggleActive(row.id, row.isActive);
                  }
                }}
              />
              <span className="text-sm">
                {row.isActive ? "Active" : "In-Active"}
              </span>
            </div>
          );
        }

        // isDeleted switch
        if (column.key === "isDeleted") {
          return (
            <div className="flex cursor-pointer items-center gap-2">
              <Switch
                checked={!row.isDeleted}
                onCheckedChange={() => {
                  if (row.onToggleStatus) {
                    row.onToggleStatus(row.id, row.isDeleted);
                  }
                }}
              />
              <span className="text-sm">
                {row.isDeleted ? "Archived" : "Restore"}
              </span>
            </div>
          );
        }
        if (column.key === "isFree") {
          const isFreeSwitchDisabled = row.status === "DRAFT" || row.isDeleted;
          return (
            <div className="flex cursor-pointer items-center gap-2">
              <Switch
                checked={row.isFree}
                onCheckedChange={() => {
                  if (row.onIsFreeChange && !isFreeSwitchDisabled) {
                    row.onIsFreeChange(row.id, row.isFree);
                  }
                }}
                disabled={isFreeSwitchDisabled}
              />
              <span
                className={`text-sm ${
                  isFreeSwitchDisabled ? "text-gray-400" : ""
                }`}
              >
                {row.isFree ? "Free" : "Premium"}
              </span>
            </div>
          );
        }

        // Feature switch (optional, if you use it)
        if (column.switchType === "feature") {
          const isFeatureSwitchDisabled =
            row.status !== "PUBLISHED" || row.isDeleted;
          return (
            <div className="flex cursor-pointer items-center gap-2">
              <Switch
                checked={row.isFeatured}
                onCheckedChange={() => {
                  if (row.onFeatureToggle && !isFeatureSwitchDisabled) {
                    row.onFeatureToggle(row.id, row.isFeatured);
                  }
                }}
                disabled={isFeatureSwitchDisabled}
              />
              <span
                className={`text-sm ${
                  isFeatureSwitchDisabled ? "text-gray-400" : "text-gray-600"
                }`}
              >
                {row.isFeatured ? "Featured" : "Not Featured"}
              </span>
              {/* {isFeatureSwitchDisabled && (
                <span className="text-xs text-gray-400 ml-1">
                  (Only for published)
                </span>
              )} */}
            </div>
          );
        }
        // isPublished switch
        if (column.key === "isPublished") {
          return (
            <div className="flex cursor-pointer items-center gap-2">
              <Switch
                checked={row.isPublished}
                onCheckedChange={() => {
                  if (row.onTogglePublish) {
                    row.onTogglePublish(row.id, row.isPublished);
                  }
                }}
              />
              <span className="text-sm">
                {row.isPublished ? "Published" : "Draft"}
              </span>
            </div>
          );
        }

      default:
        return value;
    }
  };

  // Render action icon
  const renderActionIcon = (iconType: string) => {
    switch (iconType) {
      case "restore":
        return <RestoreIcon />;
      case "soft-delete":
        return <ArchiveIcon />;
      case "delete":
        return <DeleteIcon />;
      case "edit":
        return <EditIcon />;
      case "profile":
        return <ProfileIcon />;
      case "eye":
        return <EyeIcon />;
      case "assign":
        return <AssignIcon />;
      case "assign student":
        return <PiStudentBold className="text-lg" />;
      default:
        return null;
    }
  };

  const handleGoToPage = () => {
    const page = parseInt(goToPageValue);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      handlePageChange(page);
    }
    setGoToPageValue("");
  };

  return (
    <div className="bg-[#FFFFFF] border border-[#0000001A] rounded-xl p-3">
      {/* Header with Filters and Actions */}
      <div className="flex justify-between items-center gap-4 mb-6">
        {/* Left Side - Filters */}
        <div className="flex items-center gap-2">{filters}</div>

        {/* Right Side - Search and Add Button */}
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-64">
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-1.5 border border-[#0000002B] rounded-full text-sm focus:outline-none "
            />
          </div>

          {onAdd && (
            <button
              onClick={onAdd}
              className="bg-[#1E2F96] text-white px-6 py-1 cursor-pointer rounded-full text-sm font-medium hover:bg-[#162670] transition-colors flex items-center gap-2 whitespace-nowrap"
            >
              <span className="text-xl">+</span>
              Add {title || "Item"}
            </button>
          )}
          <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <BsThreeDotsVertical />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-4 sm:mx-0 hide-scrollbar">
        <div className="inline-block min-w-full align-middle">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  #SN
                </th>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                    onClick={() => column.sortable && handleSort(column.key)}
                  >
                    <div className="flex items-center gap-1">
                      {column.label}
                      {column.sortable && sortColumn === column.key && (
                        <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
                      )}
                    </div>
                  </th>
                ))}
                {actions.length > 0 && (
                  <th className="px-4  py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {paginatedData.length > 0 ? (
                paginatedData.map((row, index) => {
                  const rowActions =
                    typeof actions === "function" ? actions(row) : actions;

                  return (
                    <tr key={row.id || index} className="hover:bg-gray-50">
                      <td className="px-4 py-3 text-sm text-gray-900">
                        {row.questionNo ??
                          (currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      {columns.map((column) => (
                        <td
                          key={column.key}
                          className="px-4 py-3 text-sm text-gray-900"
                        >
                          {renderCell(column, row[column.key], row)}
                        </td>
                      ))}
                      {rowActions && rowActions.length > 0 && (
                        <td className="px-4 py-3 text-sm">
                          <div className="flex items-center gap-2">
                            {rowActions.map((action, actionIndex) => (
                              <div key={actionIndex} className="relative group">
                                <button
                                  onClick={() =>
                                    !action.disabled && action.onClick(row)
                                  }
                                  disabled={action.disabled}
                                  className={`p-1.5 rounded-lg transition-colors ${
                                    action.disabled
                                      ? "cursor-not-allowed opacity-40 bg-gray-100"
                                      : "cursor-pointer hover:bg-gray-100"
                                  }`}
                                >
                                  {renderActionIcon(action.icon)}
                                </button>
                                {action.title && (
                                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-gray-900 text-white text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none z-10">
                                    {action.title}
                                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1 border-4 border-transparent border-t-gray-900"></div>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </td>
                      )}
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan={
                      columns.length +
                      (typeof actions === "function" ||
                      (Array.isArray(actions) && actions.length > 0)
                        ? 2
                        : 1)
                    }
                    className="px-4 py-8 text-center text-sm text-gray-500"
                  >
                    {isLoading ? <Loader /> : "No data found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Separator className="-mb-2" />
      <div className="flex justify-between items-center  ">
        <div>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
        <div className="flex items-center justify-center gap-2 w-full md:w-auto">
          <input
            type="number"
            value={goToPageValue}
            onChange={(e) => setGoToPageValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGoToPage()}
            className="w-14 h-8 border rounded-md text-black text-center"
            min="1"
            max={totalPages}
            placeholder={`1-${totalPages}`}
          />
        </div>
      </div>
    </div>
  );
};

export default CustomizeTable;
