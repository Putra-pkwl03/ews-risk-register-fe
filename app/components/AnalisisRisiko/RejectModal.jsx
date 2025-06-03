"use client";

import React, { useState } from "react";

export default function RejectModal({ isOpen, onClose, onSubmit }) {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleSubmit = () => {
    onSubmit(reason);
    setReason(""); 
  };

  return (
          <div className="fixed inset-0 bg-black/40 flex items-center text-gray-900 justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg relative max-h-[80vh] overflow-y-auto">
        <h3 className="text-lg font-semibold mb-3">Alasan Menolak Risiko</h3>
        <textarea
          className="w-full border border-gray-300 rounded-md p-2 mb-4 resize-none"
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Masukkan alasan penolakan..."
        />
        <div className="flex justify-end space-x-3">
          <button
            className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400"
            onClick={() => {
              setReason("");
              onClose();
            }}
          >
            Batal
          </button>
          <button
            className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"
            onClick={handleSubmit}
            disabled={!reason.trim()}
          >
            Kirim
          </button>
        </div>
      </div>
    </div>
  );
}
