"use client";

export default function LineLoader() {
  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50 bg-gray-200 overflow-hidden">
      <div className="absolute top-0 left-0 w-1/3 h-full bg-blue-500 animate-slide" />
    </div>
  );
}
