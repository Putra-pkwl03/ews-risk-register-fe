"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import NotificationListener from "../components/notifications/NotificationListener";
import RiskValidationNotificationListener from "../components/notifications/RiskValidationNotificationListener";

export default function Layout({
  children,
  role,
  notifCount,
  setNotifCount,
  resetAt,
  setResetAt,
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  // Reset notif saat user klik menu
  const handleResetNotif = () => {
    setResetAt(Date.now()); 
    setNotifCount(0);
  };

  return (
    <div className="bg-[#f8f8f8] min-h-screen flex">
      {role === "koordinator_menris" && (
        <NotificationListener onCountUpdate={setNotifCount} resetAt={resetAt} />
      )}

      {["koordinator_unit", "koordinator_mutu"].includes(role) && (
        <RiskValidationNotificationListener
          onCountUpdate={setNotifCount}
          resetAt={resetAt}
        />
      )}

      <Sidebar
        isOpen={isSidebarOpen}
        toggle={toggleSidebar}
        role={role}
        notifCount={notifCount}
        onResetNotif={handleResetNotif}
        setResetAt={setResetAt}
      />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out ${
          isSidebarOpen ? "ml-40 sm:ml-48 md:ml-64" : "ml-16"
        }`}
      >
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="p-4 w-full ">{children}</main>
      </div>
    </div>
  );
}
