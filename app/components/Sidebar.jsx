'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import {
  HomeIcon,
  ExclamationTriangleIcon,
  UsersIcon,
  Cog6ToothIcon,
  XMarkIcon,
  Bars3Icon, 
} from '@heroicons/react/24/outline';

export default function Sidebar({ isOpen, toggle, role }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get('page');

  const handleNavigate = (targetPage) => {
    router.push(`/dashboard${targetPage ? `?page=${targetPage}` : ''}`);
  };

  return (
    <div
      className={`fixed top-0 left-0 h-full bg-gray-900 text-white shadow-lg 
    transition-all duration-300 ease-in-out
    ${isOpen ? "w-40 sm:w-48 md:w-64" : "w-16"}
  `}
    >
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        {isOpen && <h2 className="text-lg font-semibold">Menu</h2>}
        <button onClick={toggle} className="text-gray-400 hover:text-white">
          {isOpen ? (
            <XMarkIcon className="h-6 w-6" />
          ) : (
            <Bars3Icon className="h-6 w-6" />
          )}
        </button>
      </div>

      <ul className="p-4 space-y-3 flex flex-col h-[calc(100%-80px)]">
        <div className="flex-grow space-y-3">
          {/* Dashboard */}
          <li
            onClick={() => handleNavigate("")}
            className={`flex items-center gap-3 p-2 rounded cursor-pointer ${
              !page ? "bg-gray-800" : "hover:bg-gray-800"
            }`}
          >
            <HomeIcon className="h-5 w-5 flex-shrink-0" />
            <span
              className={`text-sm transition-all duration-200 ${
                !isOpen && "hidden"
              }`}
            >
              Dashboard
            </span>
          </li>

          {/* Identifikasi Risiko (Koordinator Unit) */}
          {role === "koordinator_unit" && (
            <li
              onClick={() => handleNavigate("identifikasi-risiko")}
              className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-all ${
                page === "identifikasi-risiko"
                  ? "bg-gray-800 border-l-4 border-blue-500 text-white pl-2"
                  : "hover:bg-gray-800 pl-2"
              }`}
            >
              <ExclamationTriangleIcon className="h-5 w-5 flex-shrink-0" />
              <span
                className={`text-sm transition-all duration-200 ${
                  !isOpen && "hidden"
                }`}
              >
                Indentifikasi Risiko
              </span>
            </li>
          )}

          {/* Manage Users (Admin) */}
          {role === "admin" && (
            <li
              onClick={() => handleNavigate("manage-users")}
              className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-all ${
                page === "manage-users"
                  ? "bg-gray-800 border-l-4 border-blue-500 text-white pl-2"
                  : "hover:bg-gray-800 pl-2"
              }`}
            >
              <UsersIcon className="h-5 w-5 flex-shrink-0" />
              <span
                className={`text-sm transition-all duration-200 ${
                  !isOpen && "hidden"
                }`}
              >
                Manage Users
              </span>
            </li>
          )}
        </div>

        {/* Settings */}
        <div>
          <li
            onClick={() => handleNavigate("settings")}
            className={`flex items-center gap-3 p-2 rounded cursor-pointer ${
              page === "settings"
                ? "bg-gray-800 border-l-4 border-blue-500 text-white pl-2"
                : "hover:bg-gray-800 pl-2"
            }`}
          >
            <Cog6ToothIcon className="h-5 w-5 flex-shrink-0" />
            <span
              className={`text-sm transition-all duration-200 ${
                !isOpen && "hidden"
              }`}
            >
              Setings
            </span>
          </li>
        </div>
      </ul>
    </div>
  );
}
