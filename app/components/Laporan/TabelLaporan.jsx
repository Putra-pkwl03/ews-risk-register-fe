"use client";

import { ArrowDownTrayIcon, CalendarDaysIcon } from "@heroicons/react/24/solid";

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function ReportTable({ data, isArchive = false }) {
  return (
    <div className="overflow-x-auto border border-gray-200 rounded-lg shadow-sm">
      <table className="w-full text-sm sm:text-base border-collapse">
        <thead className="bg-gray-100 text-[#5932EA] text-left border-b">
          <tr>
            <th className="px-4 py-3 border-b">No</th>
            <th className="px-4 py-3 border-b">Judul Laporan</th>
            <th className="px-4 py-3 border-b">Periode Download</th>
            <th className="px-4 py-3 border-b">Terakhir Diperbarui</th>
            <th className="px-4 py-3 border-b text-center">Download</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-100 text-gray-800">
          {data.map((laporan, idx) => (
            <tr key={idx} className="hover:bg-gray-50 transition">
              <td className="px-4 py-3 text-center">{idx + 1}</td>
              <td className="px-4 py-3">{laporan.title}</td>
              <td className="px-4 py-3">{laporan.periode}</td>
              <td className="px-4 py-3 flex items-center gap-1 text-sm text-gray-700">
                <CalendarDaysIcon className="w-4 h-4 text-gray-500" />
                {formatDate(laporan.updatedAt)}
              </td>
              <td className="px-4 py-3 text-center">
                <a
                  href={laporan.file}
                  download
                  className={`inline-flex items-center gap-2 ${
                    isArchive
                      ? "bg-gray-500 hover:bg-gray-600"
                      : "bg-green-600 hover:bg-green-700"
                  } text-white px-4 py-2 rounded-lg transition`}
                >
                  <ArrowDownTrayIcon className="w-5 h-5" />
                  <span>Excel</span>
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
