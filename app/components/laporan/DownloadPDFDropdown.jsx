"use client";
import { useRef, useState, useEffect } from "react";
import { Download } from "lucide-react";

export default function DownloadPDFDropdown({ onDownload }) {
  const wrapperRef = useRef(null);
  const [exportType, setExportType] = useState(null); // "open" | "pdf" | "excel"
  const [rangeType, setRangeType] = useState(null); // "select" | "all" | "6months"

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setExportType(null);
        setRangeType(null);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleExport = () => {
    if (exportType && rangeType) {
      const key = `${exportType}-${rangeType === "6months" ? "6months" : "all"}`;
      onDownload(key);
      // Reset after export
      setExportType(null);
      setRangeType(null);
    }
  };

  return (
    <div ref={wrapperRef} className="relative inline-block text-left">
      {/* Main button */}
      <button
        onClick={() => setExportType(exportType === "open" ? null : "open")}
        className="flex items-center justify-center w-30 gap-2 px-3 py-1.5 border border-blue-500 text-blue-500 hover:bg-blue-100 cursor-pointer rounded-md text-sm"
      >
        Download
        <Download className="h-4 w-4" />
      </button>

      {/* Dropdown: choose file type */}
      {exportType === "open" && (
        <div className="absolute right-0 mt-2 w-30 bg-white border border-gray-300 rounded-md shadow-lg z-10 space-y-1 p-2">
          <button
            onClick={() => {
              setExportType("pdf");
              setTimeout(() => setRangeType("select"), 100);
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition hover:cursor-pointer"
          >
            <img src="/icons/pdf.png" alt="PDF" className="w-4 h-4" />
            PDF
          </button>
          <button
            onClick={() => {
              setExportType("excel");
              setTimeout(() => setRangeType("select"), 100);
            }}
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-sm text-green-600 border border-green-300 rounded-md hover:bg-green-50 transition hover:cursor-pointer"
          >
            <img src="/icons/excel.png" alt="Excel" className="w-4 h-4" />
            Excel
          </button>
        </div>
      )}

      {/* Dropdown: choose date range */}
      {rangeType === "select" && (
        <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
          <button
            onClick={() => {
              setRangeType("all");
              setTimeout(handleExport, 300);
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition hover:cursor-pointer"
          >
            📅 <span className="font-medium">All Data</span>
          </button>
          <button
            onClick={() => {
              setRangeType("6months");
              setTimeout(handleExport, 300);
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition hover:cursor-pointer"
          >
            ⏱️ <span className="font-medium">Last 6 Months</span>
          </button>
        </div>
      )}
    </div>
  );
}
