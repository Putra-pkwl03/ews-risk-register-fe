"use client";

import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} />

      {/* Konten Utama */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out
          ${isSidebarOpen ? 'ml-40 sm:ml-48 md:ml-64' : 'ml-0'}`}
      >
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
