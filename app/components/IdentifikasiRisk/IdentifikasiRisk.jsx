"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FormRisiko from "./FormRisk";
import RiskService from "../../lib/RiskService";
import LoadingSkeleton from "../loadings/LoadingSkeleton";
import ConfirmDeleteModal from "../../components/modalconfirmasi/DeleteModal";
import ErrorToast from "../../components/modalconfirmasi/ErrorToast";
import SuccessToast from "../../components/modalconfirmasi/SuccessToast";
import DetailRisikoCard from "../../components/IdentifikasiRisk/DetailRisikoCard";
import Pagination from "../manage-users/Pagenations"; 
import DownloadExportButton from "./DownloadExportButton";
import { exportToExcel, exportToPDF } from "../../lib/IdenExcelUtils";



export default function IdentifikasiRisikoTable() {
  const [data, setData] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [isSortingEnabled, setIsSortingEnabled] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isDetailMode, setIsDetailMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const itemsPerPage = 5; 

  const handleCancel = () => {
    setShowForm(false);
    setSelectedRisk(null);
    setIsEditMode(false);
    setIsDetailMode(false);
  };

  useEffect(() => {
  const fetchData = async () => {
    try {
      const risks = await RiskService.getAll();
      setData(risks);
    } catch (error) {
      console.error("ERROR MENGAMBIL RISIKO:", error);
    }
  };

  fetchData();
}, []);

  const openDeleteModal = (id) => {
    setSelectedId(id);
    setIsModalOpen(true);
  };

  // STARTDOWNLOAD FUNCTION
  const handleExport = (type, range) => {
    let filtered = [...data];

    if (range === "last6") {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      filtered = filtered.filter(item => new Date(item.created_at) >= sixMonthsAgo);
    }

    if (type === "pdf") {
      exportToPDF(filtered);
    } else if (type === "excel") {
      exportToExcel(filtered);
    }
  };
  // ENDDOWNLOAD FUNCTION

  const generateRandomString = (length = 10) => {
    const chars =
      "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, kategoriFilter, sortOrder]);

  const handleSave = async (newItem) => {
    try {
      if (isEditMode) {
        await RiskService.update(newItem.id, newItem);
      } else {
        await RiskService.create(newItem);
      }

      // Setelah create/update, fetch ulang semua data dari server
      const risks = await RiskService.getAll();
      setData(risks);

      setShowForm(false);
      setSelectedRisk(null);
      setIsEditMode(false);

      setSuccessMessage("Data risiko berhasil disimpan.");
      setShowSuccess(true);

      return true;
    } catch (error) {
      console.error("Gagal menyimpan data:", error);
      setErrorMessage("Gagal menyimpan data risiko.");
      setShowError(true);
      return false;
    }
  };

  const handleKategoriChange = (e) => {
    const value = e.target.value;
    setKategoriFilter(value);
    setIsSortingEnabled(value === "Dampak");
    if (value !== "Dampak") setSortOrder("");
  };

  const handleSortChange = (e) => {
    if (isSortingEnabled) setSortOrder(e.target.value);
  };

  const handleAdd = () => {
    setSelectedRisk(null);
    setIsEditMode(false);
    setIsDetailMode(false);
    setShowForm(true);
  };

  const handleEdit = (item) => {
    setSelectedRisk(item);
    setIsEditMode(true);
    setIsDetailMode(false);
    setShowForm(true);
  };

  const handleConfirmDelete = async () => {
    try {
      await RiskService.delete(selectedId);
      setData(data.filter((d) => d.id !== selectedId));
      setIsModalOpen(false);
      setSuccessMessage("Risiko berhasil dihapus.");
      setShowSuccess(true);
    } catch (error) {
      console.error("Gagal menghapus data:", error);
      setErrorMessage("Gagal menghapus risiko. Silakan coba lagi.");
      setShowError(true);
    }
  };

  const filteredData = data.filter((item) => {
    const matchesSearch = item.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter =
      kategoriFilter && kategoriFilter !== "All"
        ? item.status === kategoriFilter.toLowerCase()
        : true;
    return matchesSearch && matchesFilter;
  });

  let displayedData = [...filteredData];
  if (isSortingEnabled) {
    if (sortOrder === "Ascending") {
      displayedData.sort((a, b) => a.impact - b.impact);
    } else if (sortOrder === "Descending") {
      displayedData.sort((a, b) => b.impact - a.impact);
    }
  }

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const totalItems = displayedData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Data yang akan ditampilkan di halaman ini
  const paginatedData = displayedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <>
      <ConfirmDeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmDelete}
      />

      <SuccessToast
        message={successMessage}
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
      />

      <ErrorToast
        message={errorMessage}
        isOpen={showError}
        onClose={() => setShowError(false)}
      />

      {showForm ? (
        <FormRisiko
          selectedRisk={selectedRisk}
          riskToEdit={selectedRisk}
          onSave={handleSave}
          onCancel={handleCancel}
          isEditMode={isEditMode}
        />
      ) : isDetailMode && selectedRisk ? (
        <DetailRisikoCard
          risk={selectedRisk}
          onClose={() => {
            setSelectedRisk(null);
            setIsDetailMode(false);
          }}
        />
      ) : (
        <div className="bg-white rounded-sm shadow-gray-200 shadow-xl p-4 mb-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
            <h5 className="text-[20px] text-black font-semibold">
              Identifikasi Risiko
            </h5>
            <div className="flex flex-col sm:flex-row items-center gap-4">
               <DownloadExportButton onExport={handleExport} />
              <div className="flex items-center border border-gray-300 rounded-md px-3 py-1.5 bg-white">
                <img
                  src="/icons/search.svg"
                  alt="Search Icon"
                  className="h-4 w-4 mr-2 opacity-60"
                />
                <input
                  type="text"
                  placeholder="Search Risiko..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="outline-none text-[12px] text-black w-full"
                />
              </div>

              {/* Filter Kategori */}
              <div className="relative inline-flex items-center gap-1 text-sm text-gray-400">
                <span>Filter by:</span>
                <select
                  value={kategoriFilter}
                  onChange={handleKategoriChange}
                  className="border border-gray-300 bg-white rounded-md px-2 py-1 text-[12px] text-center text-black hover:cursor-pointer appearance-none focus:outline-none pr-6 pl-0"
                >
                  <option value="All">All</option>
                  <option value="Draft">Draft</option>
                  <option value="Pending">Pending</option>
                  <option value="Approved">Approved</option>
                  <option value="Rejected">Rejected</option>
                  <option value="Dampak">UC/C</option>
                </select>
                <img
                  src="/icons/chevron-down.svg"
                  alt="Filter Icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none"
                />
              </div>

              {/* Sorting */}
              <div className="relative inline-flex items-center gap-1 text-sm text-gray-400">
                <span>Sorting by:</span>
                <select
                  value={sortOrder}
                  onChange={handleSortChange}
                  disabled={!isSortingEnabled}
                  className={`border border-gray-300 bg-white rounded-md px-2 py-1 text-[12px] text-center text-black hover:cursor-pointer appearance-none focus:outline-none pr-6 pl-0 ${
                    !isSortingEnabled ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <option value="">All</option>
                  <option value="Ascending">Ascending</option>
                  <option value="Descending">Descending</option>
                </select>
                <img
                  src="/icons/chevron-down.svg"
                  alt="Filter Icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none"
                />
              </div>

              <button
                onClick={handleAdd}
                className="flex items-center gap-1 text-sm border border-green-500 text-green-500 hover:bg-green-100 hover:cursor-pointer px-3 py-1.5 rounded-md"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Add Risk
              </button>
            </div>
          </div>

          <table className="w-full text-sm sm:text-base">
            <thead className="bg-gray-100 text-[#5932EA] text-left border-b">
              <tr>
                <th className="p-2">Klaster</th>
                <th className="p-2">Unit</th>
                <th className="p-2">Nama Risiko</th>
                <th className="p-2">Kategori</th>
                <th className="p-2">Deskripsi</th>
                <th className="p-2">Penyebab</th>
                <th className="p-2">Dampak</th>
                <th className="p-2">UC/C</th>
                <th className="p-2 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="py-4 text-center">
                    <LoadingSkeleton />
                  </td>
                </tr>
              ) : displayedData.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-4 text-gray-400">
                    Tidak ada data ditemukan.
                  </td>
                </tr>
              ) : (
                paginatedData.map((item, idx) => (
                  <tr
                    key={item.id}
                    className={`text-[12px] text-[#292D32] transition-colors border-b border-gray-200 ${
                      idx % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                    } hover:bg-gray-100`}
                  >
                    <td className="p-2">{item.cluster}</td>
                    <td className="p-2">{item.unit}</td>
                    <td className="p-2">{item.name}</td>
                    <td className="p-2">{item.category}</td>
                    <td className="p-2 max-w-[100px]">
                      <div className="truncate max-w-[200px]">
                        {item.description}
                      </div>
                    </td>
                    <td className="p-2 text-xs max-w-[250px]">
                      {item.causes?.map((cause) => (
                        <div key={cause.id} className="mb-2">
                          {/* Kategori tetap tampil */}
                          <p>
                            <strong>Kategori :</strong>{" "}
                            {cause.category || "Man"}
                          </p>

                          {/* Utama satu baris dengan ... jika panjang */}
                          <p
                            className="truncate whitespace-nowrap overflow-hidden text-ellipsis"
                            title={cause.main_cause}
                          >
                            <strong>Utama :</strong> {cause.main_cause}
                          </p>

                          {/* Sub selalu tampil penuh */}
                          <p
                            className="truncate whitespace-nowrap overflow-hidden text-ellipsis"
                            title={cause.sub_causes
                              ?.map((sub) => sub.sub_cause)
                              .join(", ")}
                          >
                            <strong>Sub :</strong>{" "}
                            {cause.sub_causes
                              ?.map((sub) => sub.sub_cause)
                              .join(", ")}
                          </p>
                        </div>
                      ))}
                    </td>
                    <td className="p-2">{item.impact}</td>
                    <td className="p-2 text-center">
                      {item.uc_c === 1
                        ? "C"
                        : item.uc_c === 0
                        ? "UC"
                        : item.uc_c}
                    </td>
                    <td className="p-2 text-sm m:p-3">
                      <div className="flex flex-row justify-center items-center gap-2">
                        <button
                          onClick={() => {
                            setSelectedRisk(item);
                            setIsDetailMode(true);

                            const randomRef = generateRandomString();

                            // Update URL tanpa reload
                            const params = new URLSearchParams(
                              window.location.search
                            );
                            params.set("ref", randomRef);
                            const newUrl = `${
                              window.location.pathname
                            }?${params.toString()}`;
                            window.history.pushState({}, "", newUrl);
                          }}
                          title="Detail"
                        >
                          <img
                            src="/icons/detail.svg"
                            alt="Detail Icon"
                            className="h-5 w-5 min-w-[20px] min-h-[20px] hover:opacity-80 hover:cursor-pointer"
                          />
                        </button>

                        <button onClick={() => handleEdit(item)} title="Edit">
                          <img
                            src="/icons/edit.svg"
                            alt="Edit Icon"
                            className="h-5 w-5 min-w-[20px] min-h-[20px] hover:opacity-80 hover:cursor-pointer"
                          />
                        </button>
                        <button
                          onClick={() => openDeleteModal(item.id)}
                          title="Delete"
                        >
                          <img
                            src="/icons/hapus.svg"
                            alt="Delete Icon"
                            className="h-5 w-5 min-w-[20px] min-h-[20px] hover:opacity-80 hover:cursor-pointer"
                          />
                        </button>
                        <button
                          onClick={() => {
                            const params = new URLSearchParams();
                            params.set("page", "form-analisis");
                            params.set("mode", "add");
                            params.set("riskId", item.id); // <- hanya kirim riskId
                            router.push(`/dashboard?${params.toString()}`);
                          }}
                          title="Add"
                          className="flex items-center gap-1 text-sm border border-green-500 text-green-500 hover:bg-green-100 hover:cursor-pointer px-3 py-1.5 rounded-md"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth={2}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
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