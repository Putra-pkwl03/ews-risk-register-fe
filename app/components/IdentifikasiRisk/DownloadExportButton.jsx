import { useState } from "react";

export default function DownloadExportButton({ onExport }) {
  const [showTypeDropdown, setShowTypeDropdown] = useState(false);
  const [showRangeDropdown, setShowRangeDropdown] = useState(false);
  const [selectedType, setSelectedType] = useState(null);

  const handleTypeSelect = (type) => {
    setSelectedType(type);
    setShowRangeDropdown(true);
  };

  const handleRangeSelect = (range) => {
    setShowRangeDropdown(false);
    setShowTypeDropdown(false);
    onExport?.(selectedType, range);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        onClick={() => setShowTypeDropdown((prev) => !prev)}
        className="flex items-center gap-2 px-3 py-1.5 border border-blue-500 text-blue-500 hover:bg-blue-100 rounded-md text-sm"
      >
        Download
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-4 w-4"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 11.292l3.71-4.06a.75.75 0 111.1 1.02l-4.25 4.66a.75.75 0 01-1.1 0L5.21 8.27a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {showTypeDropdown && (
        <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-300 rounded-md shadow-lg z-10">
          <button
            onClick={() => handleTypeSelect("pdf")}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            PDF
          </button>
          <button
            onClick={() => handleTypeSelect("excel")}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            Excel
          </button>
        </div>
      )}

      {showRangeDropdown && (
        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-300 rounded-md shadow-lg z-20">
          <button
            onClick={() => handleRangeSelect("all")}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            Semua Data
          </button>
          <button
            onClick={() => handleRangeSelect("last6")}
            className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
          >
            6 Bulan Terakhir
          </button>
        </div>
      )}
    </div>
  );
}
