"use client";

import React, { useState, useRef } from "react";
import { reviewRiskHandling } from "../../lib/RisikokepalaPuskesmas";
import SignaturePad from "react-signature-canvas";
import MiniSpinner from "../loadings/MiniSpinner";
import SuccessToast from "../modalconfirmasi/SuccessToast";
import ErrorToast from "../modalconfirmasi/ErrorToast"; // pastikan path sesuai

export default function ReviewModal({ isOpen, onClose, item }) {
  const [status, setStatus] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const sigPadRef = useRef(null);

  // Toast states
  const [successToast, setSuccessToast] = useState({
    isOpen: false,
    message: "",
  });
  const [errorToast, setErrorToast] = useState({ isOpen: false, message: "" });

  if (!isOpen) return null;

  const isSignatureEmpty = status === "true" && sigPadRef.current?.isEmpty?.();
  const isNoteInvalid = status === "false" && notes.trim() === "";
  const isSaveDisabled =
    loading ||
    !status ||
    (status === "true" && isSignatureEmpty) ||
    isNoteInvalid;

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

      setSuccessToast({
        isOpen: true,
        message: "Risk handling saved successfully.",
      });

      setTimeout(() => {
        onClose();
      }, 2000);

      onClose();
    } catch (err) {
      setErrorToast({
        isOpen: true,
        message: err.message || "Failed to save.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Toast Components */}
      <SuccessToast
        message={successToast.message}
        isOpen={successToast.isOpen}
        onClose={() => setSuccessToast({ ...successToast, isOpen: false })}
      />
      <ErrorToast
        message={errorToast.message}
        isOpen={errorToast.isOpen}
        onClose={() => setErrorToast({ ...errorToast, isOpen: false })}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center">
        <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
          <h2 className="text-lg font-semibold mb-4 text-black">
            Risk Review
          </h2>
          <p className="mb-2 text-sm text-gray-600">
            Risk: {item?.risk?.name}
          </p>

          <select
            className="w-full border rounded px-3 py-2 mb-4 text-gray-600 hover:cursor-pointer"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">-- Select --</option>
            <option value="true">Approve</option>
            <option value="false">Reject</option>
          </select>

          {status === "true" && (
            <div className="mb-4">
              <label className="block text-sm mb-2 text-black">
                Signature (image)
              </label>
              <SignaturePad
                ref={sigPadRef}
                canvasProps={{ className: "border rounded w-full h-32" }}
              />
              <button
                type="button"
                className="mt-2 text-blue-600 text-sm hover:cursor-pointer"
                onClick={() => sigPadRef.current.clear()}
              >
                Clear Signature
              </button>
            </div>
          )}

          {status === "false" && (
            <div className="mb-4">
              <label className="block text-sm mb-2 text-black">Notes</label>
              <textarea
                className="w-full border rounded px-3 py-2 text-gray-500"
                rows={3}
                placeholder="Enter reason for rejection"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              ></textarea>
            </div>
          )}

          <div className="flex justify-end space-x-2">
            <button
              onClick={onClose}
              className="w-[90px] h-[42px] text-sm text-red-600 border border-red-400 rounded-lg hover:bg-red-100 transition hover:cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSaveDisabled}
              className={`w-[100px] h-[42px] text-sm border rounded-lg transition flex items-center justify-center ${
                isSaveDisabled
                  ? "bg-blue-200 text-white cursor-not-allowed"
                  : "text-blue-600 border-blue-500 hover:bg-blue-100 hover:text-blue-700 hover:cursor-pointer"
              }`}
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
