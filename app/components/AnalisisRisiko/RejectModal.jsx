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
  <h3 className="text-lg font-semibold mb-3">Reason for Rejecting Risk</h3>
        <textarea
          className="w-full border border-gray-300 rounded-md p-2 mb-4 resize-none"
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter the reason for rejection..."
        />
        <div className="flex justify-end space-x-3">
          <button
            className="w-[90px] h-[42px] text-sm text-red-600 border border-red-400 rounded-lg hover:bg-red-100 transition duration-300 ease-in-out hover:cursor-pointer"
            onClick={() => {
              setReason("");
              onClose();
            }}
          >
            Cancel
          </button>
          <button
            className="w-[90px] h-[42px] text-sm text-blue-600 bg-transparent border border-blue-500 rounded-lg transition duration-300 ease-in-out hover:text-blue hover:bg-blue-100 hover:cursor-pointer"
            onClick={handleSubmit}
            disabled={!reason.trim()}
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
}
