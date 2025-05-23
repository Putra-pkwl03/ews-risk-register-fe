"use client";

import {  useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const [role, setRole] = useState('');

  useEffect(() => {
    const savedRole = localStorage.getItem('role');
    setRole(savedRole);
  }, []);

  return (
    <div className={`bg-gray-200 min-h-screen flex`}>
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggle={toggleSidebar} role={role} />

      {/* Konten Utama */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-40 sm:ml-48 md:ml-64" : "ml-16"
        }`}
      >
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="p-4 ">{children}</main>
      </div>
    </div>
  );
}
