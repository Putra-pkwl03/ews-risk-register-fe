"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  getAllRiskAnalysis,
  fetchRiskAnalysis,
  deleteRiskAnalysis,
  sendToMenris,
} from "../../lib/RiskAnalysis";
import LoadingSkeleton from "../loadings/LoadingSkeleton";
import FormAnalisis from "../AnalisisRisiko/FormAnalisis";
import DetailAnalisisRisiko from "../AnalisisRisiko/DetailAnalisisRisiko";
import ConfirmDeleteModal from "../modalconfirmasi/DeleteModal";
import SuccessToast from "../modalconfirmasi/SuccessToast";
import Pagination from "../manage-users/Pagenations";
import MiniSpinner from "../loadings/MiniSpinner";
import ConfirmModal from "../modalconfirmasi/ConfirmModal";
import ErrorToast from "../modalconfirmasi/ErrorToast";

export default function AnalisisRisiko() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const encodedId = searchParams.get("id");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("");
  const [isSortingEnabled, setIsSortingEnabled] = useState(true);
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [editingRisk, setEditingRisk] = useState(null);
  const [showFormAnalisis, setShowFormAnalisis] = useState(false);
  const [analisisRisiko, setAnalisisRisiko] = useState([]);
  const [showDetail, setShowDetail] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [riskToDelete, setRiskToDelete] = useState(null);
  const [risks, setRisks] = useState([]);
  const [toastMessage, setToastMessage] = useState("");
  const [toastOpen, setToastOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loadingId, setLoadingId] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [errorToastOpen, setErrorToastOpen] = useState(false);
  const [errorToastMessage, setErrorToastMessage] = useState("");

  const itemsPerPage = 7;

  //   useEffect(() => {
  //     if (typeof setNotifCount === "function") {
  //       // setNotifCount(0);
  //     }
  //   }, [setNotifCount]);

  useEffect(() => {
    setLoading(true);
    getAllRiskAnalysis()
      .then((res) => {
        console.log("Risk analysis data fetched successfully:", res);
        setAnalisisRisiko(res);
      })
      .catch((err) => {
        console.error("Failed to fetch risk analysis data:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleEdit = (risk) => {
    setEditingRisk(risk);
    setShowFormAnalisis(true);
  };

  // Update handler after successful save from form
  const handleUpdate = (updatedRisk) => {
    setAnalisisRisiko((prevRisks) => {
      const index = prevRisks.findIndex((r) => r.id === updatedRisk.id);
      if (index === -1) {
        return [...prevRisks, updatedRisk];
      } else {
        const newRisks = [...prevRisks];
        newRisks[index] = updatedRisk;
        return newRisks;
      }
    });

    setShowFormAnalisis(false);
    setEditingRisk(null);

    // Show success toast
    setToastMessage("Data updated successfully");
    setToastOpen(true);

    // Optional: refresh data from API to sync with server
    setLoading(true);
    getAllRiskAnalysis()
      .then((res) => setAnalisisRisiko(res))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  const handleCloseForm = () => {
    setShowFormAnalisis(false);
    setEditingRisk(null);
  };

  const handleKategoriChange = (e) => {
    setKategoriFilter(e.target.value);
  };

  const handleDetailClick = (risk) => {
    // console.log("Risk yang diklik:", risk);
    setSelectedRisk(risk);
    setShowDetail(true);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const openDeleteModal = (id) => {
    setRiskToDelete(id);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setRiskToDelete(null);
  };

  const handleToastClose = () => setToastOpen(false);

  const handleDelete = async () => {
    if (!riskToDelete) return;

    try {
      await deleteRiskAnalysis(riskToDelete);

      // Update state after successful delete
      setAnalisisRisiko((prev) =>
        prev.filter((item) => item.id !== riskToDelete)
      );

      // Close delete modal
      closeDeleteModal();

      // Show success toast
      setToastMessage("Data deleted successfully");
      setToastOpen(true);
    } catch (error) {
      console.error("Error deleting:", error);
      alert(`Failed to delete data: ${error.message}`);
    }
  };

  const generateRandomString = () =>
    Math.random().toString(36).substring(2, 10);

  const calculateScore = (severity, probability) => {
    return Number(severity) * Number(probability);
  };

  const getBandsRisiko = (skor) => {
    if (skor >= 15) return "High";
    if (skor >= 8) return "Medium";
    return "Low";
  };

  const filteredData = analisisRisiko.filter((item) => {
    const matchSearch = [
      item.risk?.name,
      item.risk?.cluster,
      item.risk?.unit,
      item.risk?.category,
    ].some((field) => field?.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchKategori =
      kategoriFilter === "All" ||
      (kategoriFilter === "validated" &&
        ["validated_approved", "validated_rejected"].includes(
          item.risk?.status
        )) ||
      item.risk?.status === kategoriFilter;

    return matchSearch && matchKategori;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortOrder === "Ascending") return a.score - b.score;
    if (sortOrder === "Descending") return b.score - a.score;

    // Default: urutkan berdasarkan ID terbaru di atas
    return new Date(b.created_at) - new Date(a.created_at);
  });

  const openFormAnalisis = (risk) => {
    setSelectedRisk(risk);
    setShowFormAnalisis(true);
  };

  const handleSaveAnalisis = (analisisData) => {
    const id = analisisData.id || generateRandomString();
    const skor = calculateScore(
      analisisData.severity,
      analisisData.probability
    );
    const bandsrisiko = getBandsRisiko(skor);

    const updatedData = {
      ...analisisData,
      id,
      skor,
      bandsrisiko,
    };

    setAnalisisRisiko((prev) => {
      const index = prev.findIndex((item) => item.id === updatedData.id);
      if (index !== -1) {
        const updated = [...prev];
        updated[index] = updatedData;
        return updated;
      }
      return [...prev, updatedData];
    });

    setShowFormAnalisis(false);
  };

  const statusIcons = {
    draft: "/icons/draft.svg",
    pending: "/icons/pending.svg",
    validated_approved: "/icons/approved.svg",
    validated_rejected: "/icons/rejected.svg",
  };

  const displayedData = sortedData;
  const totalItems = displayedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Data yang akan ditampilkan di halaman ini
  const paginatedData = displayedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSend = async (id) => {
    setLoadingId(id);

    try {
      const response = await sendToMenris(id);

      setToastMessage(
        "Risk successfully sent to the Risk Management Coordinator"
      );
      setToastOpen(true);

      const updated = await getAllRiskAnalysis();
      setAnalisisRisiko(updated);

      setShowModal(false);
    } catch (error) {
      setErrorToastMessage(
        error.message || "An error occurred while sending the risk"
      );
      setErrorToastOpen(true);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <>
      <SuccessToast
        open={toastOpen}
        onClose={handleToastClose}
        message={toastMessage}
      />

      {showDetail && selectedRisk && (
        <DetailAnalisisRisiko
          data={selectedRisk}
          onClose={() => setShowDetail(false)}
        />
      )}
      {!showDetail && (
        <div className="bg-white rounded-sm shadow-gray-200 shadow-xl p-4 mb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4 flex-wrap">
            <h5 className="text-[20px] text-black font-semibold">Risk Analysis</h5>

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
                  onChange={handleKategoriChange}
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
                <span>Sort by Score:</span>
                <select
                  value={sortOrder}
                  onChange={handleSortChange}
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
                Reset Filters
              </button>
            </div>
          </div>

          <table className="w-full text-sm sm:text-base table-auto border shadow-gray-200 shadow-md border-gray-200">
            <thead className="bg-gray-100 text-[#5932EA] text-left border-b">
              <tr>
                <th className="p-2 text-[14px] sm:p-3 sm:text-base">No</th>
                <th className="p-2 text-[14px] sm:p-3 sm:text-base">Cluster</th>
                <th className="p-2 text-[14px] sm:p-3 sm:text-base">Unit</th>
                <th className="p-2 text-[14px] sm:p-3 sm:text-base">
                  Risk Name
                </th>
                <th className="p-2 text-[14px] sm:p-3 sm:text-base text-center">
                  Severity
                </th>
                <th className="p-2 text-[14px] sm:p-3 sm:text-base text-center">
                  Probability
                </th>
                <th className="p-2 text-[14px] sm:p-3 sm:text-base text-center">
                  Score
                </th>
                <th className="p-2 text-[14px] sm:p-3 sm:text-base text-center">
                  Grading
                </th>
                <th className="p-2 text-[14px] sm:p-3 sm:text-base text-center">
                  Status
                </th>
                <th className="p-2 text-[14px] sm:p-3 sm:text-base text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={10} className="py-4 text-center">
                    <LoadingSkeleton />
                  </td>
                </tr>
              ) : paginatedData.length === 0 ? (
                <tr>
                  <td colSpan={10} className="text-center py-4 text-gray-400">
                    No data found.
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, index) => {
                  const status = item.risk?.status;
                  const isDisabled =
                    status === "pending" || status === "validated_approved";

                  return (
                    <tr
                      key={item.id}
                      className={`text-[12px] text-[#292D32] transition-colors border-b border-gray-200 ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                      } hover:bg-gray-100`}
                    >
                      <td className="p-2">
                        {(currentPage - 1) * itemsPerPage + index + 1}
                      </td>
                      <td className="p-2 text-[12px] ">
                        {item.risk?.cluster || "-"}
                      </td>
                      <td className="p-2">{item.risk?.unit || "-"}</td>
                      <td className="p-2">{item.risk?.name || "-"}</td>
                      <td className="p-2 text-center">{item.severity}</td>
                      <td className="p-2 text-center">{item.probability}</td>
                      <td className="p-2 text-center">{item.score}</td>
                      <td className="p-2 text-center">
                        {(() => {
                          const g = (item.grading || "").toLowerCase();
                          const isVeryHigh = ["sangat tinggi", "very high"].includes(g);
                          const isHigh = ["tinggi", "high"].includes(g);
                          const isMedium = ["sedang", "medium"].includes(g);
                          const isLow = ["rendah", "low"].includes(g);
                          const isVeryLow = ["sangat rendah", "very low"].includes(g);
                          const cls = isVeryHigh
                            ? "bg-red-600 text-white"
                            : isHigh
                            ? "bg-orange-500 text-white"
                            : isMedium
                            ? "bg-yellow-400 text-black"
                            : isLow
                            ? "bg-blue-500 text-white"
                            : isVeryLow
                            ? "bg-green-500 text-white"
                            : "bg-gray-400 text-white";
                          const display = (() => {
                            if (g === "sangat tinggi") return "Very High";
                            if (g === "tinggi") return "High";
                            if (g === "sedang") return "Medium";
                            if (g === "rendah") return "Low";
                            if (g === "sangat rendah") return "Very Low";
                            return item.grading || "-";
                          })();
                          return (
                            <span className={`capitalize text-[12px] font-medium px-2 py-2 flex justify-center items-center rounded-md border ${cls}`}>
                              {display}
                            </span>
                          );
                        })()}
                      </td>

                      <td
                        className={`px-1 py-0.5 relative capitalize flex items-center justify-center gap-1 mt-3.5 rounded-2xl text-white text-center ${
                          item.risk?.status === "draft"
                            ? "bg-gray-400"
                            : item.risk?.status === "pending"
                            ? "bg-yellow-500"
                            : item.risk?.status === "validated_approved"
                            ? "bg-green-500"
                            : item.risk?.status === "validated_rejected"
                            ? "bg-red-500"
                            : ""
                        }`}
                        style={{ verticalAlign: "middle" }}
                      >
                        {item.risk?.status && (
                          <img
                            src={statusIcons[item.risk.status]}
                            alt={`${item.risk.status} icon`}
                            className="w-3 h-3"
                          />
                        )}
                        {item.risk?.status || "-"}
                      </td>
                      <td className="p-2 text-sm w-30">
                        <div className="flex flex-wrap justify-center sm:justify-start items-center gap-1.5">
                          <button onClick={() => handleDetailClick(item)}>
                            <img
                              src="/icons/detail.svg"
                              alt="Detail Icon"
                              className="h-5 w-5 hover:opacity-80 hover:cursor-pointer"
                            />
                          </button>
                          <button
                            onClick={() => handleEdit(item)}
                            title={
                              isDisabled
                                ? "This risk cannot be edited because it has already been sent or approved"
                                : "Edit"
                            }
                            disabled={isDisabled}
                            className={`${
                              isDisabled ? "cursor-not-allowed opacity-40" : ""
                            }`}
                          >
                            <img
                              src="/icons/edit.svg"
                              alt="Edit Icon"
                              className="h-5 w-5 hover:opacity-80 hover:cursor-pointer"
                            />
                          </button>
                          <button
                            onClick={() => openDeleteModal(item.id)}
                            title={
                              isDisabled
                                ? "This risk cannot be deleted because it has already been sent or approved"
                                : "Delete"
                            }
                            disabled={isDisabled}
                            className={`${
                              isDisabled ? "cursor-not-allowed opacity-40" : ""
                            }`}
                          >
                            <img
                              src="/icons/hapus.svg"
                              alt="Delete Icon"
                              className="h-5 w-5 hover:opacity-80 hover:cursor-pointer"
                            />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (isDisabled) return;
                              setSelectedId(item.id);
                              setShowModal(true);
                            }}
                            title={
                              isDisabled
                                ? "This risk has already been sent or approved"
                                : "Send to Risk Management"
                            }
                            disabled={isDisabled || loadingId === item.id}
                            className={`${
                              isDisabled || loadingId === item.id
                                ? "cursor-not-allowed opacity-50"
                                : ""
                            }`}
                          >
                            {loadingId === item.id ? (
                              <MiniSpinner />
                            ) : (
                              <img
                                src="/icons/sent.svg"
                                alt="Sent"
                                className="h-4 w-4 hover:opacity-80 hover:cursor-pointer"
                              />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          {showFormAnalisis && (
            <FormAnalisis
              id={editingRisk?.id}
              riskId={editingRisk?.risk_id}
              risk={selectedRisk}
              onSave={handleUpdate}
              defaultSeverity={editingRisk?.severity?.toString() || ""}
              defaultProbability={editingRisk?.probability?.toString() || ""}
              onClose={() => {
                setShowFormAnalisis(false);
                setEditingRisk(null);
              }}
            />
          )}
          <ConfirmModal
            isOpen={showModal}
            message="Are you sure you want to send to Risk Management?"
            onConfirm={() => {
              setShowModal(false);
              handleSend(selectedId);
            }}
            onCancel={() => setShowModal(false)}
          />
          <ConfirmDeleteModal
            isOpen={deleteModalOpen}
            onClose={closeDeleteModal}
            onConfirm={handleDelete}
          />
          {/* Modal toast sukses */}
          <SuccessToast
            message={toastMessage}
            isOpen={toastOpen}
            onClose={() => setToastOpen(false)}
          />
          <ErrorToast
            message={errorToastMessage}
            isOpen={errorToastOpen}
            onClose={() => setErrorToastOpen(false)}
          />
          <div className="text-sm text-gray-600 ml-4">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={totalItems}
            />
          </div>
        </div>
      )}
    </>
  );
}
