"use client";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  itemsPerPage,
  totalItems,
}) {
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const goToPrevious = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const goToNext = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const startEntry = (currentPage - 1) * itemsPerPage + 1;
  const endEntry = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="flex justify-between items-center mt-6">
      <div className="text-[14px] text-[#B5B7C0]">
        Showing data {startEntry} to {endEntry} of {totalItems} entries
      </div>

      {/* Tombol Pagination */}
      <div className="flex items-center gap-2 text-sm">
        <button
          onClick={goToPrevious}
          disabled={currentPage === 1}
          className="py-1 px-1 border rounded-md bg-white text-gray-700 border-gray-300 hover:bg-gray-100 disabled:opacity-50 hover:cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronLeftIcon className="h-5 w-5" />
        </button>

        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 hover:cursor-pointer border rounded-md ${
              currentPage === page
                ? "bg-[#5932EA] text-white"
                : "bg-white text-gray-700 border-gray-300"
            } hover:bg-[#5955EA] hover:text-white transition`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={goToNext}
          disabled={currentPage === totalPages}
          className="px-1 py-1 border rounded-md bg-white text-gray-700 border-gray-300 hover:bg-gray-100 disabled:opacity-50 hover:cursor-pointer disabled:cursor-not-allowed"
        >
          <ChevronRightIcon className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
