"use client";
import { XMarkIcon } from "@heroicons/react/24/outline";

export default function ConfirmDeleteModal({ isOpen, onClose, onConfirm }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
        {/* Close Icon */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:cursor-pointer hover:text-red-500"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        {/* Content */}
        <h2 className="text-md font-semibold mb-2 text-center text-gray-800">
          Hapus Data?
        </h2>
        <p className="text-sm text-center text-gray-600 mb-6">
          Apakah Anda yakin ingin menghapus data ini? Tindakan ini tidak dapat
          dipulihkan
        </p>

        {/* Buttons */}
        <div className="flex justify-center w-full gap-2">
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-sm rounded-lg bg-red-600 text-white hover:bg-red-700 transition hover:cursor-pointer"
          >
            Hapus
          </button>
        </div>
      </div>
    </div>
  );
}
