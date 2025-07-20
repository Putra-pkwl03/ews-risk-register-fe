"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FormRisiko from "./FormRisk";
import RiskService from "../../lib/RiskService";
import RisikoTable from "../IdentifikasiRisk/RisikoTable";
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
  const [sortOrder, setSortOrder] = useState("Newest");
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
  const [addedRiskIds, setAddedRiskIds] = useState([]);
  const router = useRouter();
  const itemsPerPage = 5;
  const [filterByCluster, setFilterByCluster] = useState("");
  const [filterByUC, setFilterByUC] = useState("");

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

  // const generateRandomString = (length = 10) => {
  //   const chars =
  //     "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  //   let result = "";
  //   for (let i = 0; i < length; i++) {
  //     result += chars.charAt(Math.floor(Math.random() * chars.length));
  //   }
  //   return result;
  // };

  // STARTDOWNLOAD FUNCTION
  const handleExport = (type, range) => {
    let filtered = [...data];

    if (range === "last6") {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      filtered = filtered.filter(
        (item) => new Date(item.created_at) >= sixMonthsAgo
      );
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

  const handleSave = async (newItem, id = null) => {
    try {
      if (isEditMode && id) {
        await RiskService.update(id, newItem);
      } else {
        await RiskService.create(newItem);
      }

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

  const handleClusterChange = (e) => {
    setFilterByCluster(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
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
    const matchesSearch = [
      item.name,
      item.cluster,
      item.unit,
      item.category,
    ].some((field) => field?.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCluster = filterByCluster
      ? item.cluster === filterByCluster
      : true;
    const matchesUC = filterByUC ? item.uc_c === filterByUC : true;
    return matchesSearch && matchesCluster && matchesUC;
  });

  let displayedData = [...filteredData];

  if (sortOrder === "Ascending") {
    displayedData.sort((a, b) => a.impact - b.impact);
  } else if (sortOrder === "Descending") {
    displayedData.sort((a, b) => b.impact - a.impact);
  } else if (sortOrder === "Newest") {
    displayedData.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );
  } else if (sortOrder === "Oldest") {
    displayedData.sort(
      (a, b) => new Date(a.created_at) - new Date(b.created_at)
    );
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
              {/* Tombol Export */}
              <DownloadExportButton onExport={handleExport} />

              {/* Search */}
              <div className="flex items-center border border-gray-300 rounded-md px-3 py-1.5 bg-white">
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
                  className="outline-none text-[12px] text-black w-19"
                />
              </div>

              {/* Filter Cluster */}
              <div className="relative inline-flex items-center gap-1 text-sm text-gray-400">
                <span>Klaster:</span>
                <select
                  value={filterByCluster}
                  onChange={handleClusterChange}
                  className="border border-gray-300 bg-white rounded-md px-2 py-1 text-[12px] text-black text-center hover:cursor-pointer appearance-none pr-6"
                >
                  <option value="">Semua</option>
                  <option value="Management">Management</option>
                  <option value="Ibu & Anak">Ibu & Anak</option>
                  <option value="Usia Dewasa & Lansia">
                    Usia Dewasa & Lansia
                  </option>
                  <option value="Penanggulangan Penyakit Menular">
                    Penanggulangan Penyakit Menular
                  </option>
                  <option value="Lintas Kluster">Lintas Kluster</option>
                </select>
                <img
                  src="/icons/chevron-down.svg"
                  alt="Dropdown Icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 pointer-events-none"
                />
              </div>

              {/* Sorting */}
              <div className="flex justify-center items-center relative gap-1 text-sm text-gray-400">
                <span>Urutkan:</span>
                <select
                  value={sortOrder}
                  onChange={handleSortChange}
                  className="text-center border border-gray-300 bg-white rounded-md px-2 py-1 text-[12px] text-black hover:cursor-pointer appearance-none focus:outline-none pr-6 pl-0"
                >
                  <option value="Newest">Terbaru</option>
                  <option value="Oldest">Terlama</option>
                </select>
                <img
                  src="/icons/chevron-down.svg"
                  alt="Dropdown Icon"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 w-3 h-3 pointer-events-none"
                />
              </div>
              <button
                onClick={() => {
                  setSearchTerm("");
                  setKategoriFilter("");
                  setSortOrder("Newest");
                  setCurrentPage(1);
                  setFilterByCluster("");
                  setFilterByUC("");
                }}
                className="text-sm px-3 py-1 border border-red-500 rounded-md text-red-500 hover:bg-red-100 cursor-pointer"
              >
                Reset Filter
              </button>
              {/* Tombol Tambah */}
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

          {/* Table */}
          <RisikoTable
            isLoading={isLoading}
            displayedData={displayedData}
            paginatedData={paginatedData}
            setSelectedRisk={setSelectedRisk}
            setIsDetailMode={setIsDetailMode}
            handleEdit={handleEdit}
            openDeleteModal={openDeleteModal}
            addedRiskIds={addedRiskIds}
            setAddedRiskIds={setAddedRiskIds}
            currentPage={currentPage}
            itemsPerPage={itemsPerPage}
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
