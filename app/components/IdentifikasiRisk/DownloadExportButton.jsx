"use client";

import { useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";

export default function DownloadExportButton({ onExport }) {
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showRangeDropdown, setShowRangeDropdown] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setShowTypeDropdown(false);
        setShowRangeDropdown(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setShowTypeDropdown(false);
    setShowRangeDropdown(true);
  };

  const handleRangeSelect = (range) => {
    setShowRangeDropdown(false);
    setShowTypeDropdown(false);
    onExport?.(selectedType, range);
  };

  return (
    <div ref={wrapperRef} className="relative inline-block text-left">
      <button
        onClick={() => setShowTypeDropdown((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-1.5 border border-blue-500 text-blue-500 hover:bg-blue-100 cursor-pointer rounded-md text-sm"
      >
        Download
        <Download className="h-4 w-4" />
      </button>

      {showTypeDropdown && (
        <div className="absolute mt-2 w-28 text-black bg-white border border-gray-300 rounded-md shadow-lg z-10 space-y-1 p-2">
          <button
            onClick={() => handleTypeSelect("pdf")}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition cursor-pointer"
          >
            <img src="/icons/pdf.png" alt="PDF" className="w-4 h-4" />
            <span>PDF</span>
          </button>
          <button
            onClick={() => handleTypeSelect("excel")}
            className="w-full flex items-center gap-2 px-3 py-2 text-sm text-green-600 border border-green-300 rounded-md hover:bg-green-50 transition cursor-pointer"
          >
            <img src="/icons/excel.png" alt="Excel" className="w-4 h-4" />
            <span>Excel</span>
          </button>
        </div>
      )}

      {showRangeDropdown && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
          <button
            onClick={() => handleRangeSelect("all")}
            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3M16 7V3M3 11h18M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span className="font-medium">Semua Data</span>
          </button>
          <button
            onClick={() => handleRangeSelect("last6")}
            className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3M16 7V3M3 11h18M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span className="font-medium">6 Bulan Terakhir</span>
          </button>
        </div>
      )}
    </div>
  );
}
