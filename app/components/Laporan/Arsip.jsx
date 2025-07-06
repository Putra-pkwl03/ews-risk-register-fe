"use client";

import ReportTable from "../components/ReportTable";
import { isMoreThan6Months } from "../utils/helpers";
import laporanList from "../data/laporanList";

export default function ArsipLaporan() {
  const archivedReports = laporanList.filter((lap) =>
    isMoreThan6Months(lap.updatedAt)
  );

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-6">
      <h1 className="text-[24px] font-semibold text-gray-700 mb-2">
        📁 Arsip Laporan Risiko
      </h1>
      {archivedReports.length > 0 ? (
        <ReportTable data={archivedReports} isArchive />
      ) : (
        <p className="text-gray-500">Belum ada laporan yang diarsipkan.</p>
      )}
    </div>
  );
}
