"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Bars3Icon,
  ExclamationTriangleIcon,
  UsersIcon,
  XMarkIcon,
  ShieldCheckIcon,
} from "@heroicons/react/24/outline";
import {
  LayoutDashboardIcon,
  LogOutIcon,
  ChartBarIcon,
  ClipboardList,
  DocumentCheckIcon,
  ClipboardDocumentListIcon,
} from "lucide-react";


export default function Sidebar({
  isOpen,
  toggle,
  role,
  notifCount,
  onResetNotif,
  setResetAt,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get("page");

  const handleNavigate = (targetPage) => {
    router.push(`/dashboard${targetPage ? `?page=${targetPage}` : ""}`);
    if (["analisis-risiko", "analisis-risiko-menris"].includes(targetPage)) {
    }
  };

  // console.log("notifCount sidebar:", notifCount);

  const containerVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    show: { opacity: 1, x: 0 },
  };

  return (
    <>
      <motion.div
        initial={{ width: isOpen ? 64 : 256 }}
        animate={{ width: isOpen ? 256 : 64 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="fixed top-0 left-0 h-full bg-white shadow-lg z-50 overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b h-16 relative">
          <AnimatePresence initial={false} mode="wait">
            {isOpen && (
              <motion.div
                key="logo-header"
                initial={{ opacity: 0, x: -12, scale: 0.95 }}
                animate={{
                  opacity: 1,
                  x: 0,
                  scale: 1,
                  transition: {
                    duration: 0.4,
                    delay: 0.2,
                    ease: [0.25, 0.8, 0.25, 1],
                  },
                }}
                exit={{
                  opacity: 0,
                  x: 33,
                  scale: 0.95,
                  transition: {
                    duration: 0.3,
                    ease: [0.25, 0.8, 0.25, 1],
                  },
                }}
                className="flex items-center gap-2"
              >
                <img src="/icons/logo.svg" alt="Logo" className="h-6 w-6" />
                <motion.h2
                  initial={{ opacity: 0, y: 5 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.3,
                      delay: 0.35,
                    },
                  }}
                  exit={{
                    opacity: 0,
                    y: 5,
                    transition: {
                      duration: 0.2,
                      ease: "easeInOut",
                    },
                  }}
                  className="text-lg text-black font-semibold"
                >
                  Risk Management
                </motion.h2>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={toggle}
            className="text-gray-400 ml-1 hover:text-black hover:cursor-pointer"
          >
            {isOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Menu */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="flex flex-col h-[calc(100%-64px)] justify-between"
        >
          <ul className="space-y-2 p-2">
            {/* Dashboard */}
            <motion.li
              variants={itemVariants}
              onClick={() => handleNavigate("")}
              className={`flex items-center transition-all duration-200 cursor-pointer rounded
              ${isOpen ? "gap-3 px-4 py-2" : "justify-center py-2"}
              ${
                !page
                  ? "bg-[#5932EA] text-white"
                  : "text-gray-800 hover:bg-[#eeeeff] hover:text-black"
              }
              w-full
            `}
            >
              <LayoutDashboardIcon
                className={`h-6 w-6 flex-shrink-0 ${
                  !page ? "text-white" : "text-[#9197B3]"
                }`}
              />
              {isOpen && <span className="text-sm">Dashboard</span>}
            </motion.li>
            {/* Identifikasi Risiko */}
            {role === "koordinator_unit" && (
              <motion.li
                variants={itemVariants}
                onClick={() => {
                  handleNavigate("identifikasi-risiko");
                }}
                className={`relative flex items-center transition-all duration-200 cursor-pointer rounded-md
      ${isOpen ? "gap-3 px-4 py-2" : "justify-center py-3"}
      ${
        page === "identifikasi-risiko"
          ? "bg-[#5932EA] text-white"
          : "text-gray-800 hover:bg-[#eeeeff] hover:text-black"
      }
      w-full
    `}
              >
                <ExclamationTriangleIcon
                  className={`h-6 w-6 flex-shrink-0 ${
                    page === "identifikasi-risiko"
                      ? "text-white"
                      : "text-[#9197B3]"
                  }`}
                />
                {isOpen && <span className="text-sm">Identifikasi Risiko</span>}
              </motion.li>
            )}
            {/* Analisis Risiko untuk Koordinator Unit */}
            {role === "koordinator_unit" && (
              <motion.li
                variants={itemVariants}
                onClick={() => {
                  handleNavigate("analisis-risiko");
                  if (notifCount > 0) {
                    setResetAt(Date.now());
                  }
                }}
                className={`relative flex items-center transition-all duration-200 cursor-pointer rounded-md
      ${isOpen ? "gap-3 px-4 py-2" : "justify-center py-3"}
      ${
        page === "analisis-risiko"
          ? "bg-[#5932EA] text-white"
          : "text-gray-800 hover:bg-[#eeeeff] hover:text-black"
      }
      w-full
    `}
              >
                <ChartBarIcon
                  className={`h-6 w-6 flex-shrink-0 ${
                    page === "analisis-risiko" ? "text-white" : "text-[#9197B3]"
                  }`}
                />
                {isOpen && <span className="text-sm">Analisis Risiko</span>}

                {notifCount > 0 && (
                  <span className="ml-auto inline-flex items-center justify-center text-xs font-bold text-white bg-red-500 rounded-full w-5 h-5">
                    {notifCount}
                  </span>
                )}
              </motion.li>
            )}
            {/* Menu Analisis Risiko untuk Koordinator Menris (tidak berubah) */}
            {role === "koordinator_menris" && (
              <motion.li
                variants={itemVariants}
                onClick={() => {
                  handleNavigate("analisis-risiko-menris");
                  if (notifCount > 0 && onResetNotif) {
                    onResetNotif();
                  }
                }}
                className={`relative flex items-center transition-all duration-200 cursor-pointer rounded-md
      ${isOpen ? "gap-3 px-4 py-2" : "justify-center py-3"}
      ${
        page === "analisis-risiko-menris"
          ? "bg-[#5932EA] text-white"
          : "text-gray-800 hover:bg-[#eeeeff] hover:text-black"
      }
      w-full
    `}
              >
                <ChartBarIcon
                  className={`h-6 w-6 flex-shrink-0 ${
                    page === "analisis-risiko-menris"
                      ? "text-white"
                      : "text-[#9197B3]"
                  }`}
                />
                {isOpen && <span className="text-sm">Analisis Risiko</span>}

                {notifCount > 0 && (
                  <span className="ml-auto inline-flex items-center justify-center text-xs font-bold text-white bg-red-500 rounded-full w-5 h-5">
                    {notifCount}
                  </span>
                )}
              </motion.li>
            )}

            {/* Penanganan Risiko - Khusus Koordinator Mutu */}
            {role === "koordinator_mutu" && (
              <>
                <motion.li
                  variants={itemVariants}
                  onClick={() => {
                    handleNavigate("penanganan-risiko");
                    if (notifCount > 0 && onResetNotif) {
                      onResetNotif();
                    }
                  }}
                  className={`relative flex items-center transition-all duration-200 cursor-pointer rounded
                    ${isOpen ? "gap-3 px-4 py-2" : "justify-center py-3"}
                    ${
                      page === "penanganan-risiko"
                        ? "bg-[#5932EA] text-white"
                        : "text-gray-800 hover:bg-[#eeeeff] hover:text-black"
                    }
                    w-full
                  `}
                >
                  <ShieldCheckIcon
                    className={`h-6 w-6 flex-shrink-0 ${
                      page === "penanganan-risiko"
                        ? "text-white"
                        : "text-[#9197B3]"
                    }`}
                  />

                  {isOpen && <span className="text-sm">Analisys Risiko</span>}

                  {notifCount > 0 && (
                    <span className="ml-auto inline-flex items-center justify-center text-xs font-bold text-white bg-red-500 rounded-full w-5 h-5">
                      {notifCount}
                    </span>
                  )}
                </motion.li>

                {/* Menu baru Evaluasi Risiko tanpa notif */}
                <motion.li
                  variants={itemVariants}
                  onClick={() => handleNavigate("evaluasi-risiko")}
                  className={`flex items-center transition-all duration-200 cursor-pointer rounded
                    ${isOpen ? "gap-3 px-4 py-2" : "justify-center py-3"}
                    ${
                      page === "evaluasi-risiko"
                        ? "bg-[#5932EA] text-white"
                        : "text-gray-800 hover:bg-[#eeeeff] hover:text-black"
                    }
                    w-full
                  `}
                >
                  <ClipboardList
                    className={`h-6 w-6 flex-shrink-0 ${
                      page === "evaluasi-risiko"
                        ? "text-white"
                        : "text-[#9197B3]"
                    }`}
                  />
                  {isOpen && <span className="text-sm">Evaluasi Risiko</span>}
                </motion.li>
              </>
            )}
            {/* Menu Penanganan Risiko - Koordinator Mutu & Koordinator Unit */}
            {(role === "koordinator_mutu" || role === "koordinator_unit") && (
              <motion.li
                variants={itemVariants}
                onClick={() => handleNavigate("menu-penanganan-risiko")}
                className={`flex items-center transition-all duration-200 cursor-pointer rounded
                ${isOpen ? "gap-3 px-4 py-2" : "justify-center py-3"}
                ${
                  page === "menu-penanganan-risiko"
                    ? "bg-[#5932EA] text-white"
                    : "text-gray-800 hover:bg-[#eeeeff] hover:text-black"
                }
                w-full
              `}
              >
                <ShieldCheckIcon
                  className={`h-6 w-6 flex-shrink-0 ${
                    page === "menu-penanganan-risiko"
                      ? "text-white"
                      : "text-[#9197B3]"
                  }`}
                />
                {isOpen && <span className="text-sm">Penanganan Risiko</span>}
              </motion.li>
            )}

            {role === "kepala_puskesmas" && (
              <motion.li
                variants={itemVariants}
                onClick={() => handleNavigate("manajemen-risiko")}
                className={`flex items-center transition-all duration-200 cursor-pointer rounded
                ${isOpen ? "gap-3 px-4 py-2" : "justify-center py-3"}
                ${
                  page === "manajemen-risiko"
                    ? "bg-[#5932EA] text-white"
                    : "text-gray-800 hover:bg-[#eeeeff] hover:text-black"
                }
                w-full
              `}
              >
                < ClipboardDocumentListIcon
                  className={`h-6 w-6 flex-shrink-0 ${
                    page === "manajemen-risiko"
                      ? "text-white"
                      : "text-[#9197B3]"
                  }`}
                />
                {isOpen && <span className="text-sm">Manajemen Risiko</span>}
              </motion.li>
            )}

            {/* Manage Users */}
            {role === "admin" && (
              <motion.li
                variants={itemVariants}
                onClick={() => handleNavigate("manage-users")}
                className={`flex items-center transition-all duration-200 cursor-pointer rounded w-full 
                  ${isOpen ? "gap-3 px-4 py-2" : "justify-center py-3"} 
                  ${
                    page === "manage-users"
                      ? "bg-[#5932EA] text-white"
                      : "text-gray-800 hover:bg-[#eeeeff] hover:text-black"
                  }`}
              >
                <UsersIcon
                  className={`h-6 w-6 flex-shrink-0 ${
                    page === "manage-users" ? "text-white" : "text-[#9197B3]"
                  }`}
                />
                {isOpen && <span className="text-sm">Manage Users</span>}
              </motion.li>
            )}
          </ul>

          {/* Logout */}
          <motion.div variants={itemVariants} className="p-2">
            <button
              className={`flex items-center  bg-red-500 hover:bg-red-400 text-white font-semibold rounded-md transition-colors duration-200 hover:cursor-pointer
              ${isOpen ? "gap-2 px-4 py-2" : "py-2 justify-center"}
              w-full
            `}
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
              }}
            >
              <LogOutIcon className="w-5 h-5" />
              {isOpen && <span>Logout</span>}
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </>
  );
}
