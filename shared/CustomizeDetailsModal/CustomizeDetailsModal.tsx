/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import { X } from "lucide-react";

interface CustomizeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  profileUpload?: React.ReactNode;
  width?: string;
}

const CustomizeDetailsModal: React.FC<CustomizeDetailsModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  profileUpload,
  width = "max-w-2xl",
}) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    } else {
      const timer = setTimeout(() => setIsAnimating(false), 300);
      // Restore body scroll when modal closes
      document.body.style.overflow = "unset";
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!isOpen && !isAnimating) return null;

  return (
    <>
      {/* Backdrop with fade animation */}
      <div
        className={`fixed inset-0 bg-black/10 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Modal with scale and fade animation */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className={`bg-white rounded-2xl shadow-xl ${width} w-full max-h-[90vh] overflow-hidden transition-all duration-300 ${
            isOpen
              ? "opacity-100 scale-100 translate-y-0"
              : "opacity-0 scale-95 -translate-y-4"
          }`}
        >
          {/* Header - Fixed */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white sticky top-0 z-10">
            <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 cursor-pointer rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>

          {/* Body - Scrollable */}
          <div className="overflow-y-auto hide-scrollbar max-h-[calc(90vh-80px)]">
            {/* Profile Upload Section */}
            {profileUpload && (
              <div className="mb-6 px-6 pt-6">{profileUpload}</div>
            )}

            {/* Form Fields */}
            {children}
          </div>
        </div>
      </div>
    </>
  );
};

export default CustomizeDetailsModal;
