"use client";

import { useEffect, useState } from "react";
import { fetchRiskHandlings } from "../../lib/pnrisiko";
import DownloadPDFDropdown from "./DownloadPDFDropdown";
import { generateLaporanPDF } from "../../lib/pdfUtils";
import { generateExcel } from "../../lib/ExcelUtils";
import Pagination from "../manage-users/Pagenations";

export default function LaporanKepalaPuskesmas() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEfektivitas, setFilterEfektivitas] = useState("All");
  const [sortByDateDesc, setSortByDateDesc] = useState(true);

  useEffect(() => {
    fetchRiskHandlings()
      .then((res) => {
        const filtered = res.data.filter(
          (item) => item.is_sent && item.is_approved === 1
        );
        setData(filtered);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const filteredData = data.filter((item) => {
    const name = item.risk?.name?.toLowerCase() || "";
    const unit = item.risk?.unit?.toLowerCase() || "";
    const cluster = item.risk?.cluster?.toLowerCase() || "";
    const handler = item.handler?.name?.toLowerCase() || "";
    const reviewer = item.reviewer?.name?.toLowerCase() || "";
    const effectiveness = item.effectiveness?.toLowerCase() || "";
    const category = item.risk?.category?.toLowerCase() || "";

    const keyword = searchTerm.toLowerCase();

    const searchMatch =
      name.includes(keyword) ||
      unit.includes(keyword) ||
      cluster.includes(keyword) ||
      handler.includes(keyword) ||
      reviewer.includes(keyword) ||
      category.includes(keyword);

    const matchEfektivitas =
      filterEfektivitas === "All" ||
      effectiveness === filterEfektivitas.toLowerCase();

    return searchMatch && matchEfektivitas;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return sortByDateDesc ? dateB - dateA : dateA - dateB;
  });

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = sortedData.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleDownload = (type) => {
    let filtered = [...sortedData];

    if (type.endsWith("6months")) {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      filtered = sortedData.filter(
        (item) => new Date(item.created_at) >= sixMonthsAgo
      );
    }

    if (type.startsWith("pdf")) {
      generateLaporanPDF(filtered);
    } else if (type.startsWith("excel")) {
      generateExcel(filtered);
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <h1 className="text-2xl font-semibold text-gray-800 mb-4">Risk Report</h1>

        <div className="flex flex-wrap gap-2 items-center">
          {/* Search Input */}
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-1.5 bg-white min-w-[180px]">
            <img
              src="/icons/search.svg"
              alt="Search Icon"
              className="h-4 w-4 mr-2 opacity-60"
            />
            <input
              type="text"
              placeholder="Search"
              className="outline-none text-[12px] text-black w-full"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>

          {/* Sort by Date */}
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort Date:</span>
            <select
              value={sortByDateDesc ? "Desc" : "Asc"}
              onChange={(e) => {
                setSortByDateDesc(e.target.value === "Desc");
                setCurrentPage(1);
              }}
              className="border border-gray-300 bg-white rounded-md px-2 py-1 text-[12px] text-black"
            >
              <option value="Desc">Newest</option>
              <option value="Asc">Oldest</option>
            </select>
          </div>

          {/* Reset Button */}
          <button
            onClick={() => {
              setSearchTerm("");
              setFilterEfektivitas("All");
              setSortByDateDesc(true);
              setCurrentPage(1);
            }}
            className="text-sm px-3 py-2 border border-red-500 rounded-md text-red-500 hover:bg-red-100"
          >
            Reset Filter
          </button>

          <DownloadPDFDropdown onDownload={handleDownload} />
        </div>
      </div>

      {error ? (
        <p className="text-red-500">Failed to load data: {error}</p>
      ) : sortedData.length === 0 && !loading ? (
        <p className="text-gray-500">No approved reports found.</p>
      ) : (
        <div className="overflow-x-auto max-h-[75vh] shadow-md rounded mt-4">
          <table className="w-full text-sm text-left bg-white rounded">
            <thead className="bg-gray-100 text-[#5932EA] border-b">
              <tr>
                <th className="p-2 text-center">No</th>
                <th className="py-2">Cluster</th>
                <th className="py-2">Unit</th>
                <th className="py-2">Risk Name</th>
                <th className="py-2">Category</th>
                <th className="p-2 whitespace-nowrap text-center">Signature</th>
                <th className="p-2">Handled By</th>
                <th className="py-2 text-center">Date</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse bg-gray-50">
                    {Array.from({ length: 8 }).map((_, j) => (
                      <td key={j} className="p-2 text-center">
                        <div className="h-4 bg-gray-200 rounded w-4/5 mx-auto" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                paginatedData.map((item, index) => (
                  <tr
                    key={item.id}
                    className={`text-[12px] text-[#292D32] border-b border-gray-200 ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    }`}
                  >
                    <td className="py-2 text-center">{startIndex + index + 1}</td>
                    <td className="py-2">{item.risk?.cluster || "-"}</td>
                    <td className="py-2">{item.risk?.unit || "-"}</td>
                    <td className="py-2">{item.risk?.name || "-"}</td>
                    <td className="py-2">{item.risk?.category || "-"}</td>
                    <td className="p-2 text-center">
                      {item.approval_signature ? (
                        <img
                          src={item.approval_signature}
                          alt="Signature"
                          className="h-4 object-contain mx-auto"
                        />
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="p-2">{item.handler?.name || "-"}</td>
                    <td className="py-2 text-center">{item.created_at?.split("T")[0] || "-"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="m-3">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              itemsPerPage={itemsPerPage}
              totalItems={sortedData.length}
              loading={loading}
            />
          </div>
        </div>
      )}
    </div>
  );
}
