"use client";
import { CheckCircleIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useEffect } from "react";

export default function SuccessToast({
  message,
  isOpen,
  onClose,
  duration = 5000,
}) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isOpen, duration, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 flex items-center bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg w-full max-w-xs animate-fall">
      <CheckCircleIcon className="w-5 h-5 mr-2" />
      <span className="text-sm flex-1">{message}</span>
      <button onClick={onClose}>
        <XMarkIcon className="w-4 h-4 ml-2 hover:text-gray-200" />
      </button>
    </div>
  );
}
