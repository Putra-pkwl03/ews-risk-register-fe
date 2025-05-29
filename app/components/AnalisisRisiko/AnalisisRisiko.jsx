"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import RiskService from "../../lib/RiskService";
import LoadingSkeleton from "../loadings/LoadingSkeleton";

export default function DetailRisiko() {
  const searchParams = useSearchParams();
  const encodedId = searchParams.get("id");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!encodedId) return;

    try {
      const decodedId = atob(encodedId);
      RiskService.getById(decodedId)
        .then((res) => {
          setData(res);
        })
        .catch((err) => {
          console.error("Gagal ambil data risiko:", err);
        })
        .finally(() => setLoading(false));
    } catch (err) {
      console.error("Gagal decode ID:", err);
      setLoading(false);
    }
  }, [encodedId]);

  return (
    <div className="p-6 bg-white shadow-md rounded-xl max-w-5xl mx-auto mt-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Detail Risiko
      </h2>

      <div className="overflow-x-auto">
        {loading ? (
          <div className="p-4">
            <LoadingSkeleton rows={4} columns={2} />
          </div>
        ) : (
          <table className="w-full text-sm sm:text-base border border-gray-200">
            <thead className="bg-gray-100 text-[#5932EA] text-left border-b-[1px] border-gray-200">
              <tr>
                <th className="p-2 sm:p-3 text-[14px] sm:text-base">Klaster</th>
                <th className="p-2 sm:p-3 text-[14px] sm:text-base">Unit</th>
                <th className="p-2 sm:p-3 text-[14px] sm:text-base">Nama Risiko</th>
                <th className="p-2 sm:p-3 text-[14px] sm:text-base">Severity</th>
                <th className="p-2 sm:p-3 text-[14px] sm:text-base">Probabilty</th>
                <th className="p-2 sm:p-3 text-[14px] sm:text-base">Skor</th>
                <th className="p-2 sm:p-3 text-[14px] sm:text-base">Bands Risk</th>
                <th className="p-2 sm:p-3 text-[14px] sm:text-base">Status</th>
                <th className="p-2 sm:p-3 text-[14px] sm:text-base">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data ? (
                <>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <td className="p-2 sm:p-3">Kluster</td>
                    <td className="p-2 sm:p-3">{data.cluster}</td>
                  </tr>
                  <tr className="bg-gray-100 border-b border-gray-200">
                    <td className="p-2 sm:p-3">Unit</td>
                    <td className="p-2 sm:p-3">{data.unit}</td>
                  </tr>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <td className="p-2 sm:p-3">Nama Risiko</td>
                    <td className="p-2 sm:p-3">{data.name}</td>
                  </tr>
                  <tr className="bg-gray-100 border-b border-gray-200">
                    <td className="p-2 sm:p-3">Status</td>
                    <td className="p-2 sm:p-3">
                      <span
                        className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                          data.status === "Aktif"
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {data.status}
                      </span>
                    </td>
                  </tr>
                  {/* Tambah field lain sesuai kebutuhan */}
                </>
              ) : (
                <tr>
                  <td colSpan={2} className="text-center p-4 text-gray-500">
                    Data tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
