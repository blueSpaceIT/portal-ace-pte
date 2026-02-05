"use client";

import { useAuthStore } from "@/store/useAuthStore";
import { Bell } from "lucide-react";
import Image from "next/image";

const NavBar = () => {
  const { user } = useAuthStore();
  console.log(user);
  return (
    <div className="flex items-center justify-end p-4 border-b border-gray-200 shadow-md px-2 bg-white">
      <div className="flex gap-5 items-center">
        <div className="border p-2 rounded-2xl">
          <Bell />
        </div>
        <div className="flex gap-2 items-center">
          <Image
            src={user?.picture || "/Images/Ellipse 2823.png"}
            alt="Logo"
            width={30}
            height={30}
            className="rounded-full"
          />
          <h2>{user?.name}</h2>
        </div>
      </div>
    </div>
  );
};
export default NavBar;
