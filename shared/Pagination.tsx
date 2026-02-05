/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { MdArrowBackIos } from "react-icons/md";
import { MdOutlineArrowForwardIos } from "react-icons/md";

type PaginationProps = {
  currentPage?: number;
  totalPages?: number;
  onPageChange: (page: number) => void;
};

const Pagination: React.FC<PaginationProps> = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
}) => {
  const [pageNumbers, setPageNumbers] = useState<(number | string)[]>([]);

  useEffect(() => {
    // Generat
    const generatePageNumbers = () => {
      const maxPagesToShow = 5;
      let pages = [];

      if (totalPages <= maxPagesToShow) {
        // Show all pages if total is small
        pages = Array.from({ length: totalPages }, (_, i) => i + 1);
      } else {
        // Always include first and last page
        if (currentPage <= 3) {
          // Near the start
          pages = [1, 2, 3, 4, 5, "...", totalPages];
        } else if (currentPage >= totalPages - 2) {
          // Near the end
          pages = [
            1,
            "...",
            totalPages - 4,
            totalPages - 3,
            totalPages - 2,
            totalPages - 1,
            totalPages,
          ];
        } else {
          // Somewhere in the middle
          pages = [
            1,
            "...",
            currentPage - 1,
            currentPage,
            currentPage + 1,
            "...",
            totalPages,
          ];
        }
      }

      setPageNumbers(pages);
    };

    generatePageNumbers();
  }, [currentPage, totalPages]);

  return (
    <div className="flex  items-center space-x-1 my-8">
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`px-3 py-1 rounded-md ${
          currentPage === 1
            ? "text-[#4B5563] cursor-not-allowed"
            : "text-[#4B5563] hover:bg-bg_green duration-200"
        }`}
      >
        <MdArrowBackIos className="text-xl" />
      </button>

      {/* Page numbers */}
      {pageNumbers.map((page, index) => (
        <button
          key={index}
          onClick={() => (typeof page === "number" ? onPageChange(page) : null)}
          disabled={page === "..."}
          className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${
            page === currentPage
              ? "bg-[#111] text-white" // Active page
              : page === "..."
              ? "text-gray-500" // Ellipsis
              : "bg-[#f0f0f0] text-gray-700 hover:bg-gray-200" // Normal pages
          }`}
        >
          {page}
        </button>
      ))}

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`px-3 py-1 rounded-md ${
          currentPage === totalPages
            ? "text-black cursor-not-allowed"
            : "text-black hover:bg-bg_green duration-200"
        }`}
      >
        <MdOutlineArrowForwardIos className="text-xl" />
      </button>
    </div>
  );
};

export default Pagination;
