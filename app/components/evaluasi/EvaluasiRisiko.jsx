"use client";

import { useEffect, useState } from "react";
import { getValidatedRisks } from "../../lib/RiskAnalysis";
import {
  getAllRiskMitigations,
  deleteRiskMitigation,
} from "../../lib/RiskMitigations";
import { useRouter } from "next/navigation";
import { ShieldPlus } from "lucide-react";
import Pagination from "../manage-users/Pagenations";
import DeleteModal from "../modalconfirmasi/DeleteModal";
import SuccessToast from "../modalconfirmasi/SuccessToast";
import ErrorToast from "../modalconfirmasi/ErrorToast";

export default function EvaluasiRisiko() {
  const [risks, setRisks] = useState([]);
  const [mitigations, setMitigations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [selectedMitigationId, setSelectedMitigationId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("");

  // Filter berdasarkan search dan kategori
  const filteredRisks = risks.filter((risk) => {
    const nameMatch =
      risk.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      risk.unit?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      risk.cluster?.toLowerCase().includes(searchTerm.toLowerCase());

    const categoryMatch =
      kategoriFilter === "All" ||
      risk.risk_appetite?.decision === kategoriFilter;

    return nameMatch && categoryMatch;
  });

  // Sorting berdasarkan ranking (nilai terbesar–terkecil)
  const sortedRisks = [...filteredRisks].sort((a, b) => {
    if (sortOrder === "Ascending") {
      const rankA = a.risk_appetite?.scoring ?? 0;
      const rankB = b.risk_appetite?.scoring ?? 0;
      return rankA - rankB;
    }

    if (sortOrder === "Descending") {
      const rankA = a.risk_appetite?.scoring ?? 0;
      const rankB = b.risk_appetite?.scoring ?? 0;
      return rankB - rankA;
    }

    // Default: urut berdasarkan tanggal terbaru (descending)
    const dateA = new Date(a.created_at || a.risk_appetite?.created_at || 0);
    const dateB = new Date(b.created_at || b.risk_appetite?.created_at || 0);
    return dateB - dateA;
  });

  // Pagination
  const totalItems = sortedRisks.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const currentRisks = sortedRisks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const onDetailClick = (risk) => {
    router.push(`/dashboard?page=evaluasi-risiko/${risk.id}/detail`);
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const risksData = await getValidatedRisks();
      const mitigationsData = await getAllRiskMitigations();
      setRisks(risksData);
      setMitigations(mitigationsData);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const findMitigationByRiskId = (riskId) =>
    mitigations.filter((m) => m.risk_id === riskId);

  const shortDesc = (text) => {
    if (!text) return "-";
    const words = text.split(" ");
    return words.length > 2 ? words.slice(0, 3).join(" ") + "..." : text;
  };

  // INFO START
  const today = new Date();
  const mitigasiTindakLanjut = [];
  useEffect(() => {
    if (mitigations.length > 0) {
      // console.log("Mitigations:", mitigations);
      // console.log("Risks:", risks);
    }
  }, [mitigations, risks]);

  const [showInfoDeadline, setShowInfoDeadline] = useState(false);

  const getDeadlineStatus = () => {
    const hasil = [];

    mitigations.forEach((m) => {
      if (!m.deadline || !m.risk_id) return;

      const deadline = new Date(m.deadline);
      const diffTime = deadline - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) return;
      if (diffDays <= 7) {
        const relatedRisk = risks.find((r) => r.id === m.risk_id);
        if (relatedRisk && relatedRisk.name) {
          hasil.push({
            riskName: relatedRisk.name,
            deadline: m.deadline,
            warna: diffDays <= 3 ? "red" : "blue",
          });
        }
      }
    });

    return hasil;
  };

  const dataDeadline = getDeadlineStatus();
  // INFO END

  const handleDeleteMitigation = async (id) => {
    try {
      await deleteRiskMitigation(id);
      setShowSuccess(true);
      fetchData(); // REFRESH data setelah berhasil hapus
    } catch (err) {
      console.error("Gagal hapus:", err.message);
      setShowError(true);
    } finally {
      setShowDeleteModal(false);
      setSelectedMitigationId(null);
    }
  };

  return (
    <div className="bg-white rounded-sm shadow-gray-200 shadow-xl p-4 mb-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4 flex-wrap">
        <h5 className="text-[20px] text-black font-semibold">Risk Evaluation</h5>
        <div className="flex flex-wrap gap-4 mb-4">
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-1.5 bg-white min-w-[200px]">
            <img
              src="/icons/search.svg"
              alt="Search Icon"
              className="h-4 w-4 mr-2 opacity-60"
            />
            <input
              type="text"
              placeholder="Search risk name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="outline-none text-[12px] text-black w-full"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Decision:</span>
            <select
              value={kategoriFilter}
              onChange={(e) => setKategoriFilter(e.target.value)}
              className="border border-gray-300 bg-white rounded-md px-2 py-1 text-[12px] text-black"
            >
              <option value="All">All</option>
              <option value="accepted">Accepted</option>
              <option value="mitigated">Mitigated</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort Ranking:</span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="border border-gray-300 bg-white rounded-md px-2 py-1 text-[12px] text-black"
            >
              <option value="">Default</option>
              <option value="Ascending">Low</option>
              <option value="Descending">High</option>
            </select>
          </div>

          <button
            onClick={() => {
              setSearchTerm("");
              setKategoriFilter("All");
              setSortOrder("");
            }}
            className="text-sm px-3 py-1 border border-red-500 rounded-md text-red-500 hover:bg-red-100"
          >
            Reset
          </button>
        </div>
      </div>
      {/* INFO START */}
      <div className="mb-6">
        <button
          onClick={() => setShowInfoDeadline(!showInfoDeadline)}
          className="text-md font-medium mb-4 text-red-700 flex items-center gap-2 focus:outline-none hover:underline cursor-pointer"
        >
          <span className="relative flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500">
              <svg
                className="text-white w-3.5 h-3.5 m-auto"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 2a6 6 0 00-6 6v2a3 3 0 01-.879 2.121L2 14h16l-1.121-1.879A3 3 0 0116 10V8a6 6 0 00-6-6zm0 16a2 2 0 002-2H8a2 2 0 002 2z" />
              </svg>
            </span>
          </span>
          {dataDeadline.length} mitigations require immediate follow-up
        </button>

        {showInfoDeadline && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-3">
              {dataDeadline
                .filter((item) => item.warna === "red")
                .map((item, idx) => (
                  <div
                    key={`red-${idx}`}
                    className="flex items-center justify-between bg-white border-l-4 border-red-500/60 rounded-lg px-5 py-3 hover:shadow-md transition"
                  >
                    <div>
                      <div className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                        <svg
                          className="w-4 h-4 text-red-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9 2a7 7 0 100 14A7 7 0 009 2zm0 12a5 5 0 110-10 5 5 0 010 10zm-.25-8a.75.75 0 011.5 0v3.25a.75.75 0 01-1.5 0V6zm.25 6a.75.75 0 100 1.5.75.75 0 000-1.5z" />
                        </svg>
                        {item.riskName}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Deadline:{" "}
                        <span className="font-semibold text-red-600">
                          {item.deadline}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-red-100 text-red-700">
                      Immediate Action Needed
                    </span>
                  </div>
                ))}
            </div>

            <div className="space-y-3">
              {dataDeadline
                .filter((item) => item.warna === "blue")
                .map((item, idx) => (
                  <div
                    key={`blue-${idx}`}
                    className="flex items-center justify-between bg-white border-l-4 border-blue-500/60 rounded-lg px-5 py-3 hover:shadow-md transition"
                  >
                    <div>
                      <div className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                        <svg
                          className="w-4 h-4 text-blue-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9 2a7 7 0 100 14A7 7 0 009 2zm0 12a5 5 0 110-10 5 5 0 010 10zm-.25-8a.75.75 0 011.5 0v3.25a.75.75 0 01-1.5 0V6zm.25 6a.75.75 0 100 1.5.75.75 0 000-1.5z" />
                        </svg>
                        {item.riskName}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Deadline:{" "}
                        <span className="font-semibold text-blue-600">
                          {item.deadline}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                      Needs Attention
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
      {/* INFO END */}
      <div className="overflow-auto">
        <table className="w-full text-sm sm:text-base shadow-gray-200 shadow-md">
          <thead className="bg-gray-100 text-[#5932EA] text-left border-b border-gray-200">
            <tr>
              <th className="p-2  text-left text-[14px] sm:p-3 sm:text-base">
                No
              </th>
              <th className="p-2  text-left text-[14px] sm:p-3 sm:text-base">
                Cluster
              </th>
              <th className="p-2  text-left text-[14px] sm:p-3 sm:text-bas">
                Unit
              </th>
              <th className="p-2  text-left text-[14px] sm:p-3 sm:text-bas">
                Risk Name
              </th>
              <th className="p-2 text-left text-[14px] sm:p-3 sm:text-bas">
                Mitigation
              </th>
              <th className="p-2  text-center text-[14px] sm:p-3 sm:text-bas">
                Controllability
              </th>
              <th className="p-2  text-center text-[14px] sm:p-3 sm:text-bas">
                Scoring
              </th>
              <th className="p-2  text-center text-[14px] sm:p-3 sm:text-bas">
                Decision
              </th>
              <th className="p-2 text-center text-[14px] sm:p-3 sm:text-bas">
                Actions
              </th>
            </tr>
          </thead>

          <tbody className="text-[#292D32]">
            {isLoading ? (
              Array.from({ length: 5 }).map((_, rowIndex) => (
                <tr key={rowIndex} className="animate-pulse">
                  {Array.from({ length: 9 }).map((_, colIndex) => (
                    <td key={colIndex} className="p-2">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : currentRisks.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="text-center text-[12px] sm:text-base py-6 text-gray-500"
                >
                  No validated risk data.
                </td>
              </tr>
            ) : (
              currentRisks.map((risk, idx) => {
                const mitigationsForRisk = findMitigationByRiskId(risk.id);
                return (
                  <tr
                    key={risk.id}
                    className={`${
                      idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } hover:bg-gray-100 transition-colors`}
                  >
                    <td className="p-2 w-[5%]  text-[12px] text-center">
                      {(currentPage - 1) * itemsPerPage + idx + 1}
                    </td>
                    <td className="p-2 w-[20%] text-[12px]">{risk.cluster}</td>
                    <td className="p-2 w-[10%] text-[12px]">{risk.unit}</td>
                    <td className="p-2 w-[20%] text-[12px]">{risk.name}</td>
                    <td className="p-2 w-[25%] text-[12px]">
                      {mitigationsForRisk.length > 0
                        ? mitigationsForRisk.map((m) => (
                            <div key={m.id} className="mb-2">
                              <strong>{m.mitigation_type}</strong> <br />
                              {m.descriptions.length > 0
                                ? shortDesc(m.descriptions[0].description)
                                : "-"}
                            </div>
                          ))
                        : "-"}
                    </td>
                    <td className="p-2 w-[5%] text-center text-[12px]">
                      {risk.risk_appetite?.controllability ?? "-"}
                    </td>
                    <td className="p-2 w-[5%] text-center text-[12px]">
                      {risk.risk_appetite?.scoring ?? "-"}
                    </td>
                    <td className="p-2 w-[10%] text-center capitalize text-[12px]">
                      {risk.risk_appetite?.decision ?? "-"}
                    </td>
                    <td className="p-2 w-[5%] text-center">
                      <div className="flex justify-center items-center gap-2">
                        {/* Tombol Detail */}
                        <button
                          onClick={() => onDetailClick(risk)}
                          className="p-1 rounded transition"
                          title="Details"
                        >
                          <img
                            src="/icons/detail.svg"
                            alt="Detail Icon"
                            className="h-5 w-5 min-w-[20px] min-h-[20px] hover:opacity-80 hover:cursor-pointer"
                          />
                        </button>

                        {/* Tombol Tambah/Edit Mitigasi */}
                        <button
                          onClick={() =>
                            router.push(
                              mitigationsForRisk.length > 0
                                ? `/dashboard?page=evaluasi-risiko/${risk.id}/edit-mitigations/${mitigationsForRisk[0].id}`
                                : `/dashboard?page=evaluasi-risiko/${risk.id}/add-mitigations`
                            )
                          }
                          title={
                            mitigationsForRisk.length > 0
                              ? "Edit Mitigation"
                              : "Add Mitigation"
                          }
                          disabled={
                            !risk.risk_appetite?.controllability ||
                            risk.risk_appetite?.decision === "accepted"
                          }
                          className={`p-1 rounded transition ${
                            !risk.risk_appetite?.controllability ||
                            risk.risk_appetite?.decision === "accepted"
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:bg-gray-100 hover:cursor-pointer"
                          }`}
                        >
                          {mitigationsForRisk.length > 0 ? (
                            <img
                              src="/icons/edit.svg"
                              alt="Edit Icon"
                              className="h-5 w-5 min-w-[20px] min-h-[20px] hover:opacity-80"
                            />
                          ) : (
                            <ShieldPlus
                              className="h-5 w-5 text-blue-600"
                              aria-hidden="true"
                            />
                          )}
                        </button>

                        {/* Tombol Delete Mitigasi */}
                        {mitigationsForRisk.length > 0 && (
                          <button
                            onClick={() => {
                              setSelectedMitigationId(mitigationsForRisk[0].id);
                              setShowDeleteModal(true);
                            }}
                            title="Delete Mitigation"
                            className="p-1 rounded hover:bg-gray-100 cursor-pointer"
                          >
                            <img
                              src="/icons/hapus.svg"
                              alt="Delete Icon"
                              className="h-5 w-5 min-w-[20px] min-h-[20px] hover:opacity-80"
                            />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={async () => {
          if (selectedMitigationId) {
            await handleDeleteMitigation(selectedMitigationId);
          }
        }}
      />

      <SuccessToast
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
        message="Mitigation deleted successfully."
      />

      <ErrorToast
        isOpen={showError}
        onClose={() => setShowError(false)}
        message="Failed to delete mitigation. Try again."
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
