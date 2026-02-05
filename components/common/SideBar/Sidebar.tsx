"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Home,
  User,
  Settings,
  LogOut,
  ArrowUpRight,
  Bell,
  ShoppingCart,
  HelpCircle,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import WebIcone from "../SVG/WebIcone";
import { FaWindowMaximize } from "react-icons/fa6";
import { SiBrandfolder } from "react-icons/si";
import { MdOutlineBrandingWatermark } from "react-icons/md";
import { useAuthStore } from "@/store/useAuthStore";
import { useBrandingStore } from "@/store/useBrandingStore";
import { Separator } from "../../ui/separator";

/* -------------------------------- Types -------------------------------- */
interface SubItem {
  label: string;
  href: string;
}
interface MenuItem {
  label: string;
  icon: React.ReactNode;
  href?: string;
  subItems?: SubItem[];
}

/* --------------------------- Organization Menu -------------------------- */
const organizationMenuItems: MenuItem[] = [
  { label: "Dashboard", icon: <Home size={18} />, href: "/dashboard" },
  { label: "Students", icon: <User size={18} />, href: "/students" },
  { label: "Branch", icon: <SiBrandfolder size={18} />, href: "/branch" },
  {
    label: "Branding",
    icon: <MdOutlineBrandingWatermark size={18} />,
    href: "/branding",
  },
  {
    label: "Material Content",
    icon: <FaWindowMaximize />,
    href: "/material",
  },
  { label: "Notification", icon: <Bell size={18} />, href: "#" },
  { label: "Settings", icon: <Settings size={18} />, href: "#" },
  { label: "Help Center", icon: <HelpCircle size={18} />, href: "#" },
  { label: "Buy", icon: <ShoppingCart size={18} />, href: "/buy" },
];

/* -------------------------------- Component -------------------------------- */

export default function Sidebar() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const { user, logout, loggingOut, initializeAuth, loading } = useAuthStore();
  const {
    branding,
    loading: brandingLoading,
    fetched,
    fetchBranding,
  } = useBrandingStore();

  useEffect(() => {
    if (user?.organizationId && !fetched) {
      fetchBranding(user.organizationId);
    }
  }, [user?.organizationId, fetched, fetchBranding]);

  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  const shouldWait = user && user.organizationId && brandingLoading && !fetched;

  //  FULL PAGE LOADER — ONLY ON FIRST LOAD
  if (loading || loggingOut || shouldWait) {
    return (
      <div className="fixed inset-0 bg-[#19235f] flex items-center justify-center z-9999">
        <div className="flex flex-col items-center gap-4">
          <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin" />
          <p className="text-white text-lg font-medium">Loading...</p>
        </div>
      </div>
    );
  }
  if (!user) return null;

  const sidebarColor =
    user.organizationId && branding?.data?.primaryColor
      ? branding.data.primaryColor
      : "#19235f";
  const sidebarLogo = branding?.data?.logoUrl;

  return (
    <aside
      className="w-72 shadow-lg flex flex-col text-white px-6 py-4"
      style={{ backgroundColor: sidebarColor }}
    >
      {/* Logo */}
      <div className="flex justify-center mb-4">
        <Image src="/Images/logo.png" alt="logo" width={110} height={100} />
      </div>

      {/* Dynamic branding/logo */}
      {user.organizationId && branding?.data?.logoUrl && (
        <Image src={sidebarLogo} alt="logo" width={110} height={100} />
      )}

      {/* Navigation */}
      <nav className="flex-1 px-2 py-6 space-y-1 text-sm overflow-y-auto">
        {organizationMenuItems.map((item, idx) => (
          <div key={idx}>
            {item.subItems ? (
              <>
                <button
                  onClick={() =>
                    setOpenDropdown(
                      openDropdown === item.label ? null : item.label,
                    )
                  }
                  className="flex items-center justify-between w-full p-2 rounded-md hover:bg-[#24317e]"
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>
                  {openDropdown === item.label ? (
                    <ChevronDown size={16} />
                  ) : (
                    <ChevronRight size={16} />
                  )}
                </button>

                {openDropdown === item.label && (
                  <ul className="ml-8 mt-1 space-y-1 text-gray-300">
                    {item.subItems.map((sub, i) => (
                      <li key={i}>
                        <Link
                          href={sub.href}
                          className="block py-1 hover:text-white"
                        >
                          {sub.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </>
            ) : (
              <Link
                href={item.href || "#"}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-[#24317e]"
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            )}
          </div>
        ))}

        <button
          onClick={logout}
          className="flex items-center gap-3 p-2 mt-4 w-full rounded-md hover:bg-[#24317e]"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </nav>
    </aside>
  );
}
