"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getAllRiskAnalysis } from "../../lib/RiskAnalysis";
import LoadingSkeleton from "../loadings/LoadingSkeleton";
import FormAnalisis from "../../components/AnalisisRisiko/FormAnalisis";

export default function DetailRisiko() {
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
  const [isDetailMode, setIsDetailMode] = useState(false);
  const [showFormAnalisis, setShowFormAnalisis] = useState(false);
  const [analisisRisiko, setAnalisisRisiko] = useState([]);

  useEffect(() => {
    setLoading(true);
    getAllRiskAnalysis()
      .then((res) => {
        console.log("Data analisis risiko berhasil diambil:", res);
        setAnalisisRisiko(res);
      })
      .catch((err) => {
        console.error("Gagal mengambil data analisis risiko:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleEdit = (item) => {
    const encoded = btoa(item.id.toString());
    router.push(`/edit-risiko?id=${encoded}`);
  };

  const handleKategoriChange = (e) => {
    setKategoriFilter(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

  const openDeleteModal = (id) => {
    alert(`Yakin ingin menghapus risiko dengan ID: ${id}?`);
  };

  const generateRandomString = () =>
    Math.random().toString(36).substring(2, 10);

  const calculateScore = (severity, probability) => {
    return Number(severity) * Number(probability);
  };

  const getBandsRisiko = (skor) => {
    if (skor >= 15) return "Tinggi";
    if (skor >= 8) return "Sedang";
    return "Rendah";
  };

  const filteredData = analisisRisiko.filter((item) => {
    const matchSearch = item.risk?.name
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchKategori =
      kategoriFilter === "All" || item.risk?.category === kategoriFilter;

    return matchSearch && matchKategori;
  });
  

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortOrder === "Ascending") return a.score - b.score;
    if (sortOrder === "Descending") return b.score - a.score;
    return 0;
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


  return (
    <div className="bg-white rounded-sm shadow-gray-200 shadow-xl p-4 mb-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4 flex-wrap">
        <h5 className="text-[20px] text-black font-semibold">
          Analisis Risiko
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
              placeholder="Search Risiko..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="outline-none text-[12px] text-black w-full"
            />
          </div>

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
              <option value="Dampak">Dampak</option>
            </select>
            <img
              src="/icons/chevron-down.svg"
              alt="Filter Icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none"
            />
          </div>

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
        </div>
      </div>

      <table className="w-full text-sm sm:text-base table-auto border border-gray-200">
        <thead className="bg-gray-100 text-[#5932EA] text-left border-b">
          <tr>
            <th className="p-2">Klaster</th>
            <th className="p-2">Unit</th>
            <th className="p-2">Nama Risiko</th>
            <th className="p-2">Severity</th>
            <th className="p-2">Probability</th>
            <th className="p-2">Skor</th>
            <th className="p-2">Bands Risiko</th>
            <th className="p-2">Status</th>
            <th className="p-2 text-center">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {loading ? (
            <tr>
              <td colSpan={9} className="py-4 text-center">
                <LoadingSkeleton />
              </td>
            </tr>
          ) : sortedData.length === 0 ? (
            <tr>
              <td colSpan={9} className="text-center py-4 text-gray-400">
                Tidak ada data ditemukan.
              </td>
            </tr>
          ) : (
            sortedData.map((item, index) => (
              <tr
                key={item.id}
                className={`text-[12px] text-[#292D32] transition-colors border-b border-gray-200 ${
                  index % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                } hover:bg-gray-100`}
              >
                <td className="p-2">{item.risk?.cluster || "-"}</td>
                <td className="p-2">{item.risk?.unit || "-"}</td>
                <td className="p-2">{item.risk?.name || "-"}</td>
                <td className="p-2">{item.severity}</td>
                <td className="p-2">{item.probability}</td>
                <td className="p-2">{item.score}</td>
                <td className="p-2">
                  <span
                    className={`capitalize text-[12px] font-medium px-2 py-2 rounded-md border 
                    ${
                      item.grading?.toLowerCase() === "sangat tinggi"
                        ? "bg-red-800 text-white"
                        : item.grading?.toLowerCase() === "tinggi"
                        ? "bg-red-500 text-white"
                        : item.grading?.toLowerCase() === "sedang"
                        ? "bg-yellow-400 text-white"
                        : item.grading?.toLowerCase() === "rendah"
                        ? "bg-green-700 text-white"
                        : item.grading?.toLowerCase() === "sangat rendah"
                        ? "bg-green-400 text-white"
                        : "bg-gray-400 text-white"
                    }`}
                  >
                    {item.grading || "-"}
                  </span>
                </td>

                <td
                  className={`px-1 py-0.5 relative capitalize inline-flex items-center justify-center gap-1 mt-1.5 rounded-2xl text-white ${
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

                <td className="p-2 text-sm">
                  <div className="flex flex-row justify-center items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedRisk(item);
                        openFormAnalisis(item);
                        setIsDetailMode(true);
                        const randomRef = Math.random()
                          .toString(36)
                          .substring(2, 10);
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
                        className="h-5 w-5 hover:opacity-80 hover:cursor-pointer"
                      />
                    </button>
                    <button
                      onClick={() => openDeleteModal(item.id)}
                      title="Hapus"
                    >
                      <img
                        src="/icons/hapus.svg"
                        alt="Delete Icon"
                        className="h-5 w-5 hover:opacity-80 hover:cursor-pointer"
                      />
                    </button>
                    <button
                      onClick={() => handleSent(item)}
                      title="Sent to menris"
                    >
                      <img
                        src="/icons/sent.svg"
                        alt="Sent"
                        className="h-5 w-5 hover:opacity-80 hover:cursor-pointer"
                      />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showFormAnalisis && (
        <FormAnalisis
          data={selectedRisk}
          mode={isDetailMode ? "detail" : "edit"}
          onClose={() => {
            setShowFormAnalisis(false);
            setIsDetailMode(false);
          }}
          onSave={handleSaveAnalisis}
        />
      )}
    </div>
  );
}
