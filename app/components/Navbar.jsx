"use client";

import { Bars3Icon } from "@heroicons/react/24/outline";
import { useState, useRef, useEffect } from "react";
import useCurrentUser from "../lib/useCurrentUser";

export default function Navbar({ toggleSidebar }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const user = useCurrentUser();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav
      className="bg-[#f8f8f8] px-4 py-2 flex items-center justify-between sticky top-0 z-40"
      style={{ minHeight: "40px" }}
    >
      {/* Kiri: Sambutan */}
      <h2 className="text-base sm:text-lg font-semibold text-gray-800">
        Selamat Datang {user?.name} 👋
      </h2>

      {/* Kanan: Avatar + Nama + Role + Dropdown */}
      <div
        className="flex items-center gap-2 relative hover:cursor-pointer"
        ref={dropdownRef}
        onClick={() => setDropdownOpen(!dropdownOpen)}
      >
        <img
          src={user?.avatar || "https://randomuser.me/api/portraits/men/1.jpg"}
          alt="User"
          className="w-8 h-8 rounded-full object-cover"
        />
        <div className="text-sm">
          <div className="font-semibold text-black truncate max-w-[120px]">
            {user?.name || "Memuat..."}
          </div>
          <div className="text-gray-600 text-xs truncate max-w-[120px]">
  {user?.role
    ? user.role === "koordinator_menris"
      ? "koordinator manrisk"
      : user.role.replace(/_/g, " ")
    : ""}
</div>

        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4 text-gray-500"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.292l3.71-4.06a.75.75 0 011.08 1.04l-4.25 4.65a.75.75 0 01-1.08 0l-4.25-4.65a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </div>
    </nav>
  );
}
