"use client";
import { useState } from "react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import MiniSpinner from "../loadings/MiniSpinner";

export default function ConfirmSendModal({ isOpen, onClose, onConfirm }) {
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error("Gagal mengirim:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="relative bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
        {/* Tombol Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 hover:cursor-pointer"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>

        {/* Konten */}
        <h2 className="text-md font-semibold mb-2 text-center text-gray-800">
          Kirim ke Kepala Puskesmas?
        </h2>
        <p className="text-sm text-center text-gray-600 mb-6">
          Apakah Anda yakin ingin mengirim data ini ke Kepala Puskesmas?
        </p>

        {/* Tombol Aksi */}
        <div className="flex justify-center w-full gap-2">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 text-sm rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition hover:cursor-pointer disabled:opacity-50"
          >
            Batal
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition flex items-center justify-center gap-2 disabled:opacity-50 hover:cursor-pointer"
          >
            {loading && <MiniSpinner />}
            {loading ? "Mengirim..." : "Kirim"}
          </button>
        </div>
      </div>
    </div>
  );
}
