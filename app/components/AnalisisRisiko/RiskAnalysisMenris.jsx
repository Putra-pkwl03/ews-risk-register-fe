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
  const [searchTerm, setSearchTerm] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("");
  const [isSortingEnabled, setIsSortingEnabled] = useState(true);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const res = await getPendingAndApprovedRiskAnalysis();
      setDataRisiko(res);
    } catch (error) {
  console.error("Failed to fetch data:", error);
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

  // Map normalized grading keys to English display labels
  const gradingLabelMap = {
    "very high": "Very High",
    "high": "High",
    "medium": "Medium",
    "low": "Low",
    "very low": "Very Low",
    // include Indonesian keys to ensure mapping works if gradingKey is Indonesian
    "sangat tinggi": "Very High",
    "tinggi": "High",
    "sedang": "Medium",
    "rendah": "Low",
    "sangat rendah": "Very Low",
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
  setSuccessMessage("Risk successfully validated and approved.");
      setShowSuccessToast(true);
      setShowApproveModal(false);
      setSelectedRiskId(null);
      fetchData();
    } catch (error) {
  console.error("Failed to validate risk:", error);
      setErrorMessage("Terjadi kesalahan saat menyetujui.");
      setShowErrorToast(true);
    }
  };

  // When clicking reject, open modal and store the rejected risk id
  const handleRejectClick = (id) => {
    setRejectId(id);
    setRejectModalOpen(true);
  };

  // Submit rejection reason
  const handleRejectSubmit = async (reason) => {
    if (!rejectId) return;
    try {
      await validateRisk(rejectId, {
        is_approved: false,
        notes: reason,
      });

  setSuccessMessage(`Risk rejected with reason: ${reason}`);
      setShowSuccessToast(true);

      setRejectModalOpen(false);
      setRejectId(null);
      fetchData();
    } catch (error) {
  console.error("Failed to reject risk:", error);
      setErrorMessage("Terjadi kesalahan saat menolak.");
      setShowErrorToast(true);
    }
  };

  const filteredData = dataRisiko.filter((item) => {
    const matchSearch = [
      item.name,
      item.unit,
      item.cluster,
      item.category,
    ].some((field) => field?.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchKategori =
      kategoriFilter === "All" || item.status === kategoriFilter;

    return matchSearch && matchKategori;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    const aScore = a.analysis?.score || 0;
    const bScore = b.analysis?.score || 0;

    if (sortOrder === "Ascending") return aScore - bScore;
    if (sortOrder === "Descending") return bScore - aScore;

    return new Date(b.created_at) - new Date(a.created_at);
  });

  const totalPages = Math.ceil(dataRisiko.length / itemsPerPage);
  const paginatedRisiko = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white rounded-sm shadow-gray-200 shadow-xl p-4 mb-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <h5 className="text-[20px] text-black font-semibold">
          Risk Analysis List
        </h5>
        <div className="flex flex-col sm:flex-row sm:flex-wrap items-center gap-4">
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-1.5 bg-white min-w-[200px]">
            <img
              src="/icons/search.svg"
              alt="Search Icon"
              className="h-4 w-4 mr-2 opacity-60"
            />
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="outline-none text-[12px] text-black w-full"
            />
          </div>

          <div className="relative inline-flex items-center gap-1 text-sm text-gray-400">
            <span>Status:</span>
            <select
              value={kategoriFilter}
              onChange={(e) => setKategoriFilter(e.target.value)}
              className="border border-gray-300 bg-white rounded-md px-2 py-1 text-[12px] text-center text-black hover:cursor-pointer appearance-none focus:outline-none pr-6 pl-0"
            >
              <option value="All">All</option>
              <option value="draft">Draft</option>
              <option value="pending">Pending</option>
              <option value="validated_approved">Approved</option>
              <option value="validated_rejected">Rejected</option>
            </select>

            <img
              src="/icons/chevron-down.svg"
              alt="Filter Icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none"
            />
          </div>

          <div className="relative inline-flex items-center gap-1 text-sm text-gray-400">
            <span>Sort Score:</span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              disabled={!isSortingEnabled}
              className={`border border-gray-300 bg-white rounded-md px-2 py-1 text-[12px] text-center text-black hover:cursor-pointer appearance-none focus:outline-none pr-6 pl-0 ${
                !isSortingEnabled ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <option value="">All</option>
              <option value="Ascending">Low</option>
              <option value="Descending">High</option>
            </select>
            <img
              src="/icons/chevron-down.svg"
              alt="Filter Icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none"
            />
          </div>

          <button
            onClick={() => {
              setSearchTerm("");
              setKategoriFilter("All");
              setSortOrder("");
            }}
            className="text-sm px-3 py-1 border border-red-500 rounded-md text-red-500 hover:bg-red-100 cursor-pointer"
          >
            Reset Filter
          </button>
        </div>
      </div>
      <table className="w-full text-sm sm:text-base table-auto border border-gray-200">
        <thead className="bg-gray-100 text-[#5932EA] text-left border-b">
          <tr>
            <th className="p-2 text-center">No</th>
            <th className="p-2">Risk Name</th>
            <th className="p-2">Unit</th>
            <th className="p-2">Cluster</th>
            <th className="p-2">Category</th>
            <th className="p-2 text-center">Severity</th>
            <th className="p-2 text-center">Probability</th>
            <th className="p-2 text-center">Score</th>
            <th className="p-2 text-center">Grading</th>
            <th className="p-2 text-center">Status</th>
            <th className="p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            Array.from({ length: 6 }).map((_, rowIndex) => (
              <tr key={rowIndex} className="animate-pulse">
                {Array.from({ length: 11 }).map((_, colIndex) => (
                  <td key={colIndex} className="p-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </td>
                ))}
              </tr>
            ))
          ) : paginatedRisiko.length === 0 ? (
            <tr>
              <td colSpan={9} className="py-6 text-center text-gray-400">
                No risk data available.
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
                <td className="p-2 text-center">
                  {(currentPage - 1) * itemsPerPage + index + 1}
                </td>
                <td className="p-2">{item.name || "-"}</td>
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
                  {(() => {
                    const rawGrading = item.analysis?.grading || "";
                    const gradingKey = String(rawGrading).toLowerCase().trim();

                    // Determine color class for both English and Indonesian values
                    let colorClass = "bg-gray-400 text-white";
                    if (gradingKey === "very high" || gradingKey === "sangat tinggi") {
                      colorClass = "bg-red-600 text-white";
                    } else if (gradingKey === "high" || gradingKey === "tinggi") {
                      colorClass = "bg-orange-500 text-white";
                    } else if (gradingKey === "medium" || gradingKey === "sedang") {
                      colorClass = "bg-yellow-400 text-black";
                    } else if (gradingKey === "low" || gradingKey === "rendah") {
                      colorClass = "bg-blue-500 text-white";
                    } else if (gradingKey === "very low" || gradingKey === "sangat rendah") {
                      colorClass = "bg-green-500 text-white";
                    }

                    // Compute display label: prefer mapped English label, otherwise title-case the raw value
                    const mapped = gradingLabelMap[gradingKey];
                    const toTitleCase = (s) =>
                      String(s)
                        .toLowerCase()
                        .split(" ")
                        .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : ""))
                        .join(" ");
                    const displayLabel = mapped || (rawGrading ? toTitleCase(rawGrading) : "-");

                    return (
                      <span
                        className={`text-[12px] font-medium px-2 py-2 flex justify-center items-center rounded-md border ${colorClass}`}
                      >
                        {displayLabel}
                      </span>
                    );
                  })()}
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
                      Approve
                    </button>
                    <button
                      onClick={() => handleRejectClick(item.id)}
                      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-xs font-medium"
                    >
                      Reject
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
