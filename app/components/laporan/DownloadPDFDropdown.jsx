"use client";

import { useState, useRef, useEffect } from "react";

export default function DownloadDropdown({ onDownload }) {
  const [open, setOpen] = useState(false);
  const [format, setFormat] = useState(null);
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
        setFormat(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (type) => {
    onDownload(type);
    setOpen(false);
    setFormat(null);
  };

  return (
    <div className="relative inline-block text-left mb-4" ref={dropdownRef}>
      <button
        onClick={() => setOpen(!open)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
      >
        Download
      </button>

      {open && (
        <div className="absolute z-10 mt-2 w-56 bg-white border rounded shadow-lg">
          {!format ? (
            <>
              <button
                onClick={() => setFormat("pdf")}
                className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
              >
                PDF
              </button>
              <button
                onClick={() => setFormat("excel")}
                className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
              >
                Excel
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => handleSelect(`${format}-all`)}
                className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
              >
                Semua Data
              </button>
              <button
                onClick={() => handleSelect(`${format}-6months`)}
                className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
              >
                Data 6 Bulan Terakhir
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
