"use client";
import { XMarkIcon } from "@heroicons/react/24/outline";
import React from "react";

const ConfirmModal = ({ isOpen, message, onConfirm, onCancel }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
        {/* Tombol Close */}
        <button
          onClick={onCancel}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 hover:cursor-pointer"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        {/* Konten */}
        <h2 className="text-md font-semibold mb-2 text-center text-gray-800">
          Send to Menris?
        </h2>
        <p className="text-sm text-center text-gray-600 mb-6">
          {message || "Are you sure you want to send this data to Menris?"}
        </p>

        {/* Tombol Aksi */}
        <div className="flex justify-center w-full gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition hover:cursor-pointer"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition hover:cursor-pointer"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
