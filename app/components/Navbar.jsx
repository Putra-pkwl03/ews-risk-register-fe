"use client";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import useCurrentUser from "../lib/useCurrentUser";
import { User2, LogOut } from "lucide-react";

export default function Navbar({ toggleSidebar, isSidebarOpen }) {
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
      className="bg-[#f8f8f8] py-4 flex items-center justify-between fixed top-0 z-40 shadow-sm transition-all duration-300 -ml-4 w-full"
      style={{
        minHeight: "40px",
        paddingLeft: isSidebarOpen ? "256px" : "75px",
        paddingRight: "4px",
      }}
    >
      <h2 className="text-base sm:text-lg font-semibold text-gray-800 -ml-11">
        Welcome {user?.name} 👋
      </h2>

  {/* Right: Avatar + Dropdown */}
      <div className="flex items-center gap-2 fixed right-4" ref={dropdownRef}>
        <div
          className="flex items-center gap-2 hover:cursor-pointer"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <img
            src={
              user?.avatar || "https://randomuser.me/api/portraits/men/1.jpg"
            }
            alt="User"
            className="w-8 h-8 rounded-full object-cover"
          />
          <div className="text-sm">
            <div className="font-semibold text-black truncate max-w-[120px]">
              {user?.name || "Loading..."}
            </div>
              <div className="text-gray-600 text-xs truncate max-w-[120px]">
              {user?.role
                ? user.role === "risk_management_coordinator"
                  ? "Risk Management Coordinator"
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

        {/* Dropdown Menu */}
        {dropdownOpen && (
          <div className="absolute right-0 top-13 w-40 bg-white rounded-lg shadow-lg border-gray-200 border-2 text-sm z-50">
            <Link
              href="/dashboard?page=profile"
              className="flex justify-between items-center px-4 py-2 hover:bg-[#eeeeff] text-gray-800 font-semibold"
              onClick={() => setDropdownOpen(false)}
            >
              <span>Profile</span>
              <User2 size={18} className="text-gray-600" />
            </Link>

            <button
              type="button"
              className="flex justify-between items-center px-4 py-2 text-red-600 font-semibold w-full cursor-pointer hover:bg-[#eeeeff]"
              onClick={() => {
                localStorage.removeItem("token");
                localStorage.removeItem("userId");
                window.location.href = "/login";
              }}
            >
              <span>Logout</span>
              <LogOut size={18} className="text-red-600" />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}
