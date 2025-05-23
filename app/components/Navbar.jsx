"use client";

import { Bars3Icon, UserCircleIcon } from '@heroicons/react/24/outline';
import { useState, useRef, useEffect } from 'react';
import useCurrentUser from '../lib/useCurrentUser';

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
    <nav className="bg-white shadow px-2 py-1 flex items-center justify-between sticky top-0 z-40" style={{ minHeight: '40px' }}>
    <button onClick={toggleSidebar} className="text-gray-700 hover:text-black">
      <Bars3Icon className="h-8 w-8" />
    </button>
  
    <div className="relative flex flex-row-reverse items-center gap-2 " ref={dropdownRef}>
      {/* Icon User */}
      <UserCircleIcon
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="h-10 w-10 text-gray-700 hover:text-black cursor-pointer"
      />
  
      {/* Name dan Role */}
      <div className="text-right text-md sm:text-sm leading-tight text-gray-700 max-w-[120px] truncate">
        <div className="font-medium truncate">{user?.name || 'Memuat...'}</div>
        <div className="text-gray-500 truncate text-center">{user?.role || '-'}</div>
      </div>

      {dropdownOpen && (
  <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg z-50 animate-fadeIn">
    <ul className="py-1 px-2 text-sm text-gray-700 whitespace-nowrap">
      <li>
        <a
          href="/profile"
          className="block px-4 py-2 hover:bg-gray-100 hover:text-blue-600 rounded transition-colors"
        >
          Profile
        </a>
      </li>
      <li>
        <button
          className="w-full text-left px-4 py-2 hover:bg-gray-100 hover:text-red-600 rounded transition-colors"
          onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/login';
          }}
        >
          Logout
        </button>
      </li>
    </ul>
  </div>
)}

    </div>
  </nav>
  

  );
}
