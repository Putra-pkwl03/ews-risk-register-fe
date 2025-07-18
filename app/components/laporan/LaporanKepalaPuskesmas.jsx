"use client";

import { useEffect, useState } from "react";
import { fetchRiskHandlings } from "../../lib/pnrisiko";
import DownloadPDFDropdown from "../../components/laporan/DownloadPDFDropdown";
import { generateLaporanPDF } from "../../lib/pdfUtils";
import { generateExcel } from "../../lib/ExcelUtils"; 

export default function LaporanKepalaPuskesmas() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchRiskHandlings()
      .then((res) => {
        console.log("[DEBUG] Data response:", res.data);
        const filtered = res.data.filter(
          (item) => item.is_sent && item.is_approved === 1
        );
        setData(filtered);
      })
      .catch((err) => {
        console.error("[ERROR] Gagal fetch:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  }, []);

const handleDownload = (type) => {
  let filtered = [...data];

  if (type.endsWith("6months")) {
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    filtered = data.filter((item) => new Date(item.created_at) >= sixMonthsAgo);
  }

  if (type.startsWith("pdf")) {
    generateLaporanPDF(filtered);
  } else if (type.startsWith("excel")) {
    generateExcel(filtered); // buat fungsi sendiri jika belum
  }
};

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold text-gray-800 mb-4">
        Halaman Laporan Kepala Puskesmas
      </h1>

      <DownloadPDFDropdown onDownload={handleDownload} />

      {loading ? (
        <p className="text-gray-600">Memuat data laporan...</p>
      ) : error ? (
        <p className="text-red-500">Gagal memuat data: {error}</p>
      ) : data.length === 0 ? (
        <p className="text-gray-500">Tidak ada laporan yang disetujui.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300 rounded shadow-sm">
            <thead>
              <tr className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
                <th className="py-2 px-4 border-b">#</th>
                <th className="py-2 px-4 border-b">Nama Risiko</th>
                <th className="py-2 px-4 border-b">Unit</th>
                <th className="py-2 px-4 border-b">Kategori</th>
                <th className="py-2 px-4 border-b">Efektivitas</th>
                <th className="py-2 px-4 border-b">Tanggal</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item, index) => (
                <tr key={item.id} className="text-sm text-gray-800">
                  <td className="py-2 px-4 border-b">{index + 1}</td>
                  <td className="py-2 px-4 border-b">{item.risk?.name || '-'}</td>
                  <td className="py-2 px-4 border-b">{item.risk?.unit || '-'}</td>
                  <td className="py-2 px-4 border-b">{item.risk?.category || '-'}</td>
                  <td className="py-2 px-4 border-b">{item.effectiveness || '-'}</td>
                  <td className="py-2 px-4 border-b">
                    {item.created_at?.split("T")[0] || '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
