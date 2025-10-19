// components/ReviewNoteModal.jsx
"use client";
import { Dialog } from "@headlessui/react";

export default function ReviewNoteModal({ isOpen, onClose, note }) {
  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50">
      <div
        className="fixed inset-0 bg-black/50 "
        aria-hidden="true"
      />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="bg-white rounded p-6 max-w-md w-full">
          <Dialog.Title className="text-xl font-semibold mb-2">
            Review Note
          </Dialog.Title>
          <p className="text-gray-700 whitespace-pre-line">{note}</p>
          <div className="mt-4 text-right">
            <button
              onClick={onClose}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
}
