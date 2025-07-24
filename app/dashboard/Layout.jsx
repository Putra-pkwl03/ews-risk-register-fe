"use client";

import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import NotificationListener from "../components/notifications/NotificationListener";
import RiskValidationNotificationListener from "../components/notifications/RiskValidationNotificationListener";
import RiskHandlingNotificationListener from "../components/notifications/RiskHandlingNotificationListener";
import ReviewHandlingNotificationListener from "../components/notifications/ReviewHandlingNotificationListener";

export default function Layout({ children, role }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const [notifCountValidation, setNotifCountValidation] = useState(0);
  const [resetAtValidation, setResetAtValidation] = useState(null);

  const [notifCountReview, setNotifCountReview] = useState(0);
  const [resetAtReview, setResetAtReview] = useState(null);

  const [notifCountHandling, setNotifCountHandling] = useState(0);
  const [resetAtHandling, setResetAtHandling] = useState(null);

  const [notifCountMenris, setNotifCountMenris] = useState(0);
  const [resetAtMenris, setResetAtMenris] = useState(null);

  return (
    <div className="bg-white min-h-screen flex">
      {role === "koordinator_menris" && (
        <NotificationListener
          onCountUpdate={setNotifCountMenris}
          resetAt={resetAtMenris}
        />
      )}

      {["koordinator_unit", "koordinator_mutu"].includes(role) && (
        <>
          <RiskValidationNotificationListener
            onCountUpdate={setNotifCountValidation}
            resetAt={resetAtValidation}
          />
          <ReviewHandlingNotificationListener
            onCountUpdate={setNotifCountReview}
            resetAt={resetAtReview}
          />
        </>
      )}

      {role === "kepala_puskesmas" && (
        <RiskHandlingNotificationListener
          onCountUpdate={setNotifCountHandling}
          resetAt={resetAtHandling}
        />
      )}

      <Sidebar
        isOpen={isSidebarOpen}
        toggle={toggleSidebar}
        role={role}
        // Kirim masing-masing notifCount dan handler-nya
        notifCountMenris={notifCountMenris}
        onResetNotifMenris={() => {
          setResetAtMenris(Date.now());
          setNotifCountMenris(0);
        }}
        notifCountValidation={notifCountValidation}
        onResetNotifValidation={() => {
          setResetAtValidation(Date.now());
          setNotifCountValidation(0);
        }}
        notifCountReview={notifCountReview}
        onResetNotifReview={() => {
          setResetAtReview(Date.now());
          setNotifCountReview(0);
        }}
        notifCountHandling={notifCountHandling}
        onResetNotifHandling={() => {
          setResetAtHandling(Date.now());
          setNotifCountHandling(0);
        }}
      />

      <div
        className={`flex-1 flex flex-col transition-all duration-300 ease-in-out
    ${
      isSidebarOpen
        ? "ml-[160px] sm:ml-[192px] md:ml-[256px] overflow-x-hidden"
        : "ml-[64px] sm:ml-[72px] md:ml-[60px]"
    }`}
      >
        <Navbar toggleSidebar={toggleSidebar} />
        <main className="w-ful mt-18">{children}</main>
      </div>
    </div>
  );
}
