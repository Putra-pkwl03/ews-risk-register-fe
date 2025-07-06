"use client";

import { useState } from "react";
import {
  ArrowDownTrayIcon,
  CalendarDaysIcon,
  ArchiveBoxIcon,
} from "@heroicons/react/24/solid";

// Data laporan
const laporanList = [
  {
    title: "Identifikasi Risiko",
    file: "/laporan/identifikasi-risiko.xlsx",
    updatedAt: "2025-01-10",
    periode: "Setiap Januari & Juli (10/01 & 10/07)",
  },
  {
    title: "Analisis Risiko",
    file: "/laporan/analisis-risiko.xlsx",
    updatedAt: "2025-06-30",
    periode: "Setiap Januari & Juli (30/01 & 30/07)",
  },
  {
    title: "Penanganan Risiko",
    file: "/laporan/penanganan-risiko.xlsx",
    updatedAt: "2024-11-15",
    periode: "Setiap Februari & Agustus (28/02 & 30/08)",
  },
  {
    title: "Evaluasi Risiko",
    file: "/laporan/evaluasi-risiko.xlsx",
    updatedAt: "2025-06-01",
    periode: "Setiap Maret & September (31/03 & 30/09)",
  },
  {
    title: "Manajemen Risiko",
    file: "/laporan/manajemen-risiko.xlsx",
    updatedAt: "2024-10-01",
    periode: "Setiap April & Oktober (30/04 & 31/10)",
  },
];

// Helper
function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function isMoreThan6Months(dateString) {
  const now = new Date();
  const updated = new Date(dateString);
  const diffMonths =
    (now.getFullYear() - updated.getFullYear()) * 12 +
    (now.getMonth() - updated.getMonth());
  return diffMonths > 6;
}

export default function DownloadLaporan() {
  const [showArchive, setShowArchive] = useState(false);

  const activeReports = laporanList.filter(
    (lap) => !isMoreThan6Months(lap.updatedAt)
  );
  const archivedReports = laporanList.filter((lap) =>
    isMoreThan6Months(lap.updatedAt)
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-12">
      <section>
        <h1 className="text-[22px] sm:text-[24px] font-semibold text-black mb-4">
          📊 Laporan Risiko Aktif (Excel)
        </h1>
        {activeReports.length > 0 ? (
          <ReportTable data={activeReports} />
        ) : (
          <p className="text-gray-500">Tidak ada laporan aktif.</p>
        )}
      </section>

      <section className="space-y-4">
        <button
          onClick={() => setShowArchive(!showArchive)}
          className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-sm text-gray-700 px-4 py-2 rounded-md border"
        >
          <ArchiveBoxIcon className="w-5 h-5" />
          {showArchive ? "Sembunyikan Arsip" : "Tampilkan Arsip"}
        </button>

        {showArchive && (
          <>
            <h2 className="text-[20px] font-semibold text-gray-700">
              📁 Arsip Laporan Risiko
            </h2>
            {archivedReports.length > 0 ? (
              <ReportTable data={archivedReports} isArchive />
            ) : (
              <p className="text-gray-500">
                Belum ada laporan yang diarsipkan.
              </p>
            )}
          </>
        )}
      </section>
    </div>
  );
}

// Komponen Tabel
function ReportTable({ data, isArchive = false }) {
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
