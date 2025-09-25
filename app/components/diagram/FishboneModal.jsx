// components/FishboneModal.js
"use client";
import React from "react";

export default function FishboneModal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-50 animate-fadeIn">
      <div className="relative bg-white p-8 rounded-3xl shadow-lg w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto animate-scaleIn">
        {/* Header */}
        <div className="flex justify-between items-center mb-6 border-b pb-3">
          <h2 className="text-xl font-semibold text-gray-800">
            Tree Diagram
          </h2>
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="text-gray-600 hover:text-red-600 hover:cursor-pointer transition-colors duration-300 text-2xl font-bold leading-none"
          >
            &times;
          </button>
        </div>

        {/* Konten */}

        <div className="text-gray-700">{children}</div>
      </div>
    </div>
  );
  
}
