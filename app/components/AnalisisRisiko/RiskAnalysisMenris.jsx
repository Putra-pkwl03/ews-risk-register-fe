"use client";

import { useEffect, useState } from "react";
import {
  getPendingAndApprovedRiskAnalysis,
  sendToMenris,
  validateRisk,
} from "../../lib/RiskAnalysis";
import LoadingSkeleton from "../loadings/LoadingSkeleton";
import RejectModal from "../../components/AnalisisRisiko/RejectModal";
import ConfirmApproveModal from "../../components/modalconfirmasi/ConfirmApproveModal";

export default function RiskActionMenris() {

  const [dataRisiko, setDataRisiko] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedRiskId, setSelectedRiskId] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);

  const [isRejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectId, setRejectId] = useState(null);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await getPendingAndApprovedRiskAnalysis();
      setDataRisiko(res);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleApprove = async () => {
    if (!selectedRiskId) return;
    try {
      await validateRisk(selectedRiskId, {
        is_approved: true,
        notes: null,
      });
      alert("Risiko berhasil divalidasi dan disetujui.");
      setShowApproveModal(false);
      setSelectedRiskId(null);
      fetchData();
    } catch (error) {
      console.error("Gagal memvalidasi risiko:", error);
      alert("Terjadi kesalahan saat menyetujui.");
    }
  };

  // Saat klik tolak, buka modal dan simpan id risiko yang ditolak
  const handleRejectClick = (id) => {
    setRejectId(id);
    setRejectModalOpen(true);
  };

  // Kirim alasan penolakan
  const handleRejectSubmit = async (reason) => {
    if (!rejectId) return;
    try {
      await validateRisk(rejectId, {
        is_approved: false,
        notes: reason,
      });
      alert(`Risiko ditolak dengan alasan:\n${reason}`);
      setRejectModalOpen(false);
      setRejectId(null);
      fetchData();
    } catch (error) {
      console.error("Gagal menolak risiko:", error);
      alert("Terjadi kesalahan saat menolak.");
    }
  };

  return (
    <div className="bg-white rounded-sm shadow-gray-200 shadow-xl p-4 mb-4">
      <h5 className="text-[20px] text-black font-semibold mb-6">
        Daftar Risiko Analisis
      </h5>
      {isLoading ? (
        <LoadingSkeleton rows={5} columns={4} /> // ? Tampilkan efek loading
      ) : (
        <table className="w-full text-sm sm:text-base table-auto border border-gray-200">
          <thead className="bg-gray-100 text-[#5932EA] text-left border-b">
            <tr>
              <th className="p-2">Nama Risiko</th>
              <th className="p-2">Unit</th>
              <th className="p-2">Cluster</th>
              <th className="p-2">Kategori</th>
              <th className="p-2">Severity</th>
              <th className="p-2">Probability</th>
              <th className="p-2">Score</th>
              <th className="p-2">Grading</th>
              <th className="p-2">Status</th>
              <th className="p-2 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={9} className="py-6 text-center text-gray-500">
                  Memuat data...
                </td>
              </tr>
            ) : dataRisiko.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-6 text-center text-gray-400">
                  Tidak ada data risiko tersedia.
                </td>
              </tr>
            ) : (
              dataRisiko.map((item, index) => (
                <tr
                  key={item.id}
                  className={`text-[12px] text-[#292D32] border-b border-gray-200 ${
                    index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                  } hover:bg-gray-100`}
                >
                  <td className="p-2 font-semibold">{item.name || "-"}</td>
                  <td className="p-2">{item.unit || "-"}</td>
                  <td className="p-2">{item.cluster || "-"}</td>
                  <td className="p-2">{item.category || "-"}</td>
                  <td className="p-2">{item.analysis?.severity || "-"}</td>
                  <td className="p-2">{item.analysis?.probability || "-"}</td>
                  <td className="p-2">{item.analysis?.score || "-"}</td>

                  <td className="p-2">
                    <span
                      className={`capitalize text-[12px] font-medium px-2 py-1 rounded-md border
                    ${
                      item.analysis?.grading?.toLowerCase() === "sangat tinggi"
                        ? "bg-red-800 text-white"
                        : item.analysis?.grading?.toLowerCase() === "tinggi"
                        ? "bg-red-500 text-white"
                        : item.analysis?.grading?.toLowerCase() === "sedang"
                        ? "bg-yellow-400 text-black"
                        : item.analysis?.grading?.toLowerCase() === "rendah"
                        ? "bg-green-700 text-white"
                        : item.analysis?.grading?.toLowerCase() ===
                          "sangat rendah"
                        ? "bg-green-400 text-black"
                        : "bg-gray-300 text-gray-700"
                    }`}
                    >
                      {item.analysis?.grading || "-"}
                    </span>
                  </td>

                  <td className="p-2">
                    <span
                      className={`capitalize text-[12px] font-medium px-2 py-1 rounded-md border
      ${
        item.status?.toLowerCase() === "pending"
          ? "bg-yellow-400 text-black"
          : item.status?.toLowerCase() === "approved"
          ? "bg-green-600 text-white"
          : item.status?.toLowerCase() === "rejected"
          ? "bg-red-500 text-white"
          : "bg-gray-300 text-gray-700"
      }`}
                    >
                      {item.status || "-"}
                    </span>
                  </td>

                  <td className="p-2 text-center space-x-2">
                    <button
                      onClick={() => {
                        setSelectedRiskId(item.id);
                        setShowApproveModal(true);
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-md text-xs font-medium"
                    >
                      Setuju
                    </button>
                    <button
                      onClick={() => handleRejectClick(item.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs font-medium"
                    >
                      Tolak
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}

      <ConfirmApproveModal
        isOpen={showApproveModal}
        onClose={() => setShowApproveModal(false)}
        onConfirm={handleApprove}
      />

      <RejectModal
        isOpen={isRejectModalOpen}
        onClose={() => setRejectModalOpen(false)}
        onSubmit={handleRejectSubmit}
      />
    </div>
  );
}
