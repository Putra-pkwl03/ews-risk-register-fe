// components/FishboneModal.js
"use client";
import React from "react";

export default function FishboneModal({ isOpen, onClose, children }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="relative bg-white p-6 rounded-2xl shadow w-full max-w-2xl mx-4">
        <button
          onClick={onClose}
          className="absolute top-1 right-2 text-gray-500 hover:text-red-600"
        >
          X
        </button>
        {children}
      </div>
    </div>
  );
}
