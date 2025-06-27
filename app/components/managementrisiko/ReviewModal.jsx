"use client";

import React, { useState, useRef } from "react";
import { reviewRiskHandling } from "../../lib/RisikokepalaPuskesmas";
import SignaturePad from "react-signature-canvas";

export default function ReviewModal({ isOpen, onClose, item }) {
  const [status, setStatus] = useState(""); 
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const sigPadRef = useRef(null);

  if (!isOpen) return null; // hindari render saat modal tidak aktif

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const signatureDataUrl =
        status === "true"
          ? sigPadRef.current.getTrimmedCanvas().toDataURL("image/png")
          : null;

      await reviewRiskHandling(item.id, {
        is_approved: status === "true",
        notes: status === "false" ? notes : null,
        approval_signature: signatureDataUrl,
      });

      alert("Berhasil menindaklanjuti risiko.");
      onClose();
    } catch (err) {
      alert(err.message || "Gagal menyimpan.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">Tindak Lanjut Risiko</h2>
        <p className="mb-2 text-sm text-gray-600">Risiko: {item?.risk?.name}</p>

        <select
          className="w-full border rounded px-3 py-2 mb-4"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">-- Pilih --</option>
          <option value="true">Setuju</option>
          <option value="false">Tidak Setuju</option>
        </select>

        {status === "true" && (
          <div className="mb-4">
            <label className="block text-sm mb-2">Tanda Tangan (gambar)</label>
            <SignaturePad
              ref={sigPadRef}
              canvasProps={{ className: "border rounded w-full h-32" }}
            />
            <button
              type="button"
              className="mt-2 text-blue-600 text-sm"
              onClick={() => sigPadRef.current.clear()}
            >
              Hapus Tanda Tangan
            </button>
          </div>
        )}

        {status === "false" && (
          <div className="mb-4">
            <label className="block text-sm mb-2">Catatan</label>
            <textarea
              className="w-full border rounded px-3 py-2"
              rows={3}
              placeholder="Masukkan alasan tidak menyetujui"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            ></textarea>
          </div>
        )}

        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !status}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Menyimpan..." : "Kirim"}
          </button>
        </div>
      </div>
    </div>
  );
}
