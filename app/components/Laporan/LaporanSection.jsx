"use client";

import React from "react";
import { ArrowDownTrayIcon, CalendarDaysIcon } from "@heroicons/react/24/solid";
import { downloadExcel } from "../../utils/laporanUtils";

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const LaporanSection = ({ title, data, filename }) => (
  <section className="space-y-4">
    <div className="flex justify-between items-center">
      <h2 className="text-lg font-semibold">{title}</h2>
      <button
        onClick={() => downloadExcel(data, filename)}
        className="flex items-center gap-2 text-white bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg disabled:bg-gray-400"
        disabled={data.length === 0}
      >
        <ArrowDownTrayIcon className="w-5 h-5" />
        Download Excel
      </button>
    </div>

    {data.length > 0 ? (
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {data.map((item, idx) => (
          <div
            key={idx}
            className="border border-gray-200 shadow-sm rounded-xl p-4 bg-white hover:shadow-md transition"
          >
            <div className="text-sm text-gray-500 mb-1">
              <span className="font-semibold">#{idx + 1}</span>
            </div>

            <div className="text-base font-medium text-gray-800 mb-2">
              {item.name ||
                item.nama_risiko ||
                item.description ||
                item.judul ||
                item.nama ||
                item.rencana_mitigasi ||
                "-"}
            </div>

            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CalendarDaysIcon className="w-4 h-4 text-gray-400" />
              {item.updatedAt
                ? formatDate(item.updatedAt)
                : item.createdAt
                ? formatDate(item.createdAt)
                : "-"}
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-gray-500 italic">Tidak ada data</div>
    )}
  </section>
);

export default LaporanSection;
