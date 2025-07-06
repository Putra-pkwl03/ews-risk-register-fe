"use client";

import { useEffect, useState } from "react";
import {
  getPendingAndApprovedRiskAnalysis,
  sendToMenris,
  validateRisk,
} from "../../lib/RiskAnalysis";
import RejectModal from "../../components/AnalisisRisiko/RejectModal";
import ConfirmApproveModal from "../../components/modalconfirmasi/ConfirmApproveModal";
import Pagination from "../manage-users/Pagenations";
import SuccessToast from "../modalconfirmasi/SuccessToast";
import ErrorToast from "../modalconfirmasi/ErrorToast";

export default function RiskActionMenris() {
  const [dataRisiko, setDataRisiko] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRiskId, setSelectedRiskId] = useState(null);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showErrorToast, setShowErrorToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isRejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectId, setRejectId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  const statusIcons = {
    draft: "/icons/draft.svg",
    pending: "/icons/pending.svg",
    validated_approved: "/icons/approved.svg",
    validated_rejected: "/icons/rejected.svg",
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
      setSuccessMessage("Risiko berhasil divalidasi dan disetujui.");
      setShowSuccessToast(true);
      setShowApproveModal(false);
      setSelectedRiskId(null);
      fetchData();
    } catch (error) {
      console.error("Gagal memvalidasi risiko:", error);
      setErrorMessage("Terjadi kesalahan saat menyetujui.");
      setShowErrorToast(true);
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

      setSuccessMessage(`Risiko ditolak dengan alasan: ${reason}`);
      setShowSuccessToast(true);

      setRejectModalOpen(false);
      setRejectId(null);
      fetchData();
    } catch (error) {
      console.error("Gagal menolak risiko:", error);
      setErrorMessage("Terjadi kesalahan saat menolak.");
      setShowErrorToast(true);
    }
  };

  const totalPages = Math.ceil(dataRisiko.length / itemsPerPage);
  const paginatedRisiko = dataRisiko.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white rounded-sm shadow-gray-200 shadow-xl p-4 mb-4">
      <h5 className="text-[20px] text-black font-semibold mb-6">
        Daftar Risiko Analisis
      </h5>

      <table className="w-full text-sm sm:text-base table-auto border border-gray-200">
        <thead className="bg-gray-100 text-[#5932EA] text-left border-b">
          <tr>
            <th className="p-2">Nama Risiko</th>
            <th className="p-2">Unit</th>
            <th className="p-2">Cluster</th>
            <th className="p-2">Kategori</th>
            <th className="p-2 text-center">Severity</th>
            <th className="p-2 text-center">Probability</th>
            <th className="p-2 text-center">Score</th>
            <th className="p-2 text-center">Grading</th>
            <th className="p-2 text-center">Status</th>
            <th className="p-2 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: 5 }).map((_, rowIndex) => (
              <tr key={rowIndex} className="animate-pulse">
                {Array.from({ length: 10 }).map((_, colIndex) => (
                  <td key={colIndex} className="p-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </td>
                ))}
              </tr>
            ))
          ) : paginatedRisiko.length === 0 ? (
            <tr>
              <td colSpan={9} className="py-6 text-center text-gray-400">
                Tidak ada data risiko tersedia.
              </td>
            </tr>
          ) : (
            paginatedRisiko.map((item, index) => (
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
                <td className="p-2 text-center">
                  {item.analysis?.severity || "-"}
                </td>
                <td className="p-2 text-center">
                  {item.analysis?.probability || "-"}
                </td>
                <td className="p-2 text-center">
                  {item.analysis?.score || "-"}
                </td>
                <td className="p-2 text-center">
                  <span
                    className={`capitalize text-[12px] font-medium px-2 py-2 flex justify-center items-center rounded-md border 
                    ${
                      item.analysis?.grading?.toLowerCase() === "sangat tinggi"
                        ? "bg-red-800 text-white"
                        : item.analysis?.grading?.toLowerCase() === "tinggi"
                        ? "bg-red-500 text-white"
                        : item.analysis?.grading?.toLowerCase() === "sedang"
                        ? "bg-yellow-400 text-white"
                        : item.analysis?.grading?.toLowerCase() === "rendah"
                        ? "bg-green-700 text-white"
                        : item.analysis?.grading?.toLowerCase() ===
                          "sangat rendah"
                        ? "bg-green-400 text-white"
                        : "bg-gray-400 text-white"
                    }`}
                  >
                    {item.analysis?.grading || "-"}
                  </span>
                </td>

                <td
                  className={`px-1 py-0.5 relative capitalize flex items-center justify-center gap-1 mt-3.5 rounded-2xl text-white text-center 
                  ${
                    item.status === "draft"
                      ? "bg-gray-400"
                      : item.status === "pending"
                      ? "bg-yellow-500"
                      : item.status === "validated_approved"
                      ? "bg-green-500"
                      : item.status === "validated_rejected"
                      ? "bg-red-500"
                      : "bg-gray-300"
                  }`}
                  style={{ verticalAlign: "middle" }}
                >
                  {item.status && statusIcons[item.status] && (
                    <img
                      src={statusIcons[item.status]}
                      alt={`${item.status} icon`}
                      className="w-3 h-3 shrink-0"
                    />
                  )}
                  <span className="truncate max-w-[100px]">
                    {item.status?.replaceAll("_", " ") || "-"}
                  </span>
                </td>
                <td className="p-2 text-center">
                  <div className="flex justify-center items-center gap-1.5">
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
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        totalItems={dataRisiko.length}
      />
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
      <SuccessToast
        isOpen={showSuccessToast}
        message={successMessage}
        onClose={() => setShowSuccessToast(false)}
      />
      <ErrorToast
        isOpen={showErrorToast}
        message={errorMessage}
        onClose={() => setShowErrorToast(false)}
      />
    </div>
  );
}
