"use client";

import { useEffect, useState } from "react";
import { fetchRiskHandlings } from "../../lib/pnrisiko";
import DetailRiskHandling from "../pnrisiko/DetailRiskHandling";
import ReviewModal from "../managementrisiko/ReviewModal";
import ReviewNoteModal from "../managementrisiko/RiviewNoteModal";
import {
  CheckCircleIcon,
  // DocumentArrowDownIcon,
} from "@heroicons/react/24/outline";
import Pagination from "../manage-users/Pagenations";
import SuccessToast from "../modalconfirmasi/SuccessToast";
import ErrorToast from "../modalconfirmasi/ErrorToast";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Risikokepalapuskesmas() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedReviewItem, setSelectedReviewItem] = useState(null);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEfektivitas, setFilterEfektivitas] = useState("All");
  const [sortByDateDesc, setSortByDateDesc] = useState(true);

  // Toast states
  const [successToast, setSuccessToast] = useState({
    isOpen: false,
    message: "",
  });
  const [errorToast, setErrorToast] = useState({ isOpen: false, message: "" });

  useEffect(() => {
    fetchRiskHandlings()
      .then((res) => {
        const filtered = res.data.filter((item) => item.is_sent);
        setData(filtered);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const startIndex = (currentPage - 1) * itemsPerPage;

  const filteredData = data.filter((item) => {
    const name = item.risk?.name?.toLowerCase() || "";
    const unit = item.risk?.unit?.toLowerCase() || "";
    const cluster = item.risk?.cluster?.toLowerCase() || "";
    const handler = item.handler?.name?.toLowerCase() || "";
    const reviewer = item.reviewer?.name?.toLowerCase() || "";
    const effectiveness = item.effectiveness?.toLowerCase() || "";

    const keyword = searchTerm.toLowerCase();

    const searchMatch =
      name.includes(keyword) ||
      unit.includes(keyword) ||
      cluster.includes(keyword) ||
      handler.includes(keyword) ||
      reviewer.includes(keyword);

    const matchEfektivitas =
      filterEfektivitas === "All" ||
      item.effectiveness?.toLowerCase() === filterEfektivitas.toLowerCase();

    return searchMatch && matchEfektivitas;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    const dateA = new Date(a.created_at);
    const dateB = new Date(b.created_at);
    return sortByDateDesc ? dateB - dateA : dateA - dateB;
  });

  const totalItems = filteredData.length;
  const paginatedData = loading
    ? []
    : sortedData.slice(startIndex, startIndex + itemsPerPage);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  if (selectedItem) {
    return (
      <DetailRiskHandling
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    );
  }

  const exportToExcel = (item) => {
    const {
      risk,
      effectiveness,
      approval_signature,
      handler,
      reviewer,
      review_notes,
      created_at,
    } = item;

    const riskAppetite = risk?.risk_appetite || {};

    const data = [
      [
        "Risk Name",
        "Unit",
        "Cluster",
        "Category",
        "Impact",
        "Risk Description",
        "Scoring",
        "Ranking",
        "Decision",
        "Effectiveness",
        "Signature",
        "Handled By",
        "Reviewer",
        "Handling Date",
        "Notes",
      ],
      [
        risk?.name,
        risk?.unit,
        risk?.cluster,
        risk?.category,
        risk?.impact,
        risk?.description,
        riskAppetite.scoring,
        riskAppetite.ranking,
        riskAppetite.decision,
        effectiveness,
        approval_signature,
        handler?.name,
        reviewer?.name,
        new Date(created_at).toLocaleString(),
        review_notes,
      ],
    ];

    const ws = XLSX.utils.aoa_to_sheet(data);

    // Tambah styling warna header (baris pertama)
    const headerRange = XLSX.utils.decode_range(ws["!ref"]);
    for (let C = headerRange.s.c; C <= headerRange.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!ws[cellAddress]) continue;
      ws[cellAddress].s = {
        fill: {
          fgColor: { rgb: "D9E1F2" }, // warna biru muda
        },
        font: {
          bold: true,
        },
      };
    }

    const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Risk Detail");

    // Aktifkan style agar bisa dibaca Excel
    const excelBuffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
      cellStyles: true,
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

  saveAs(blob, `risk_handling_${risk?.name || "export"}.xlsx`);
  };

  return (
    <div className="bg-white rounded-sm shadow-gray-200 shadow-xl p-4 mb-4">
      <SuccessToast
        message={successToast.message}
        isOpen={successToast.isOpen}
        onClose={() => setSuccessToast({ ...successToast, isOpen: false })}
      />
      <ErrorToast
        message={errorToast.message}
        isOpen={errorToast.isOpen}
        onClose={() => setErrorToast({ ...errorToast, isOpen: false })}
      />
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-[20px] text-black font-semibold">Risk Management</h1>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center border border-gray-300 rounded-md px-3 py-1.5 bg-white min-w-[80px]">
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
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="relative inline-flex items-center gap-1 text-sm text-black">
            <span>Effectiveness:</span>
            <select
              value={filterEfektivitas}
              onChange={(e) => setFilterEfektivitas(e.target.value)}
              className="border border-gray-300 bg-white rounded-md px-2 py-1 text-[12px] text-black text-center appearance-none focus:outline-none pr-6"
            >
              <option value="All">All</option>
              <option value="E">Effective</option>
              <option value="KE">Less Effective</option>
              <option value="TE">Not Effective</option>
            </select>
            <img
              src="/icons/chevron-down.svg"
              alt="Filter Icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Sort Date:</span>
            <select
              value={sortByDateDesc ? "Desc" : "Asc"}
              onChange={(e) => setSortByDateDesc(e.target.value === "Desc")}
              className="border border-gray-300 bg-white rounded-md px-2 py-1 text-[12px] text-black"
            >
              <option value="Desc">Newest</option>
              <option value="Asc">Oldest</option>
            </select>
          </div>
          <div>
            <button
              onClick={() => {
                setSearchTerm("");
                setFilterEfektivitas("All");
                setSortByDateDesc(true);
              }}
              className="text-sm px-3 py-2 border border-red-500 rounded-md text-red-500 hover:bg-red-100 cursor-pointer"
            >
              Reset Filter
            </button>
          </div>
        </div>
      </div>
      .....
      {error && <p className="text-red-500">{error}</p>}
      {data.length === 0 && !loading && (
        <p className="text-gray-500">No risk handling data yet.</p>
      )}
      {!loading && filteredData.length === 0 && (
        <p className="flex justify-center items-center text-gray-500 italic">
          No data matches the search/filter.
        </p>
      )}
      <table className="w-full text-sm sm:text-base shadow-gray-200 shadow-md ">
        <thead className="bg-gray-100 text-[#5932EA] text-left border-b">
          <tr>
            <th className="px-2 py-2">No</th>
            <th className="px-2 py-2 text-left">Risk</th>
            <th className="px-2 py-2 text-left">Unit</th>
            <th className="px-2 py-2">Effectiveness</th>
            <th className="px-2 py-2">Signature</th>
            <th className="px-2 py-2">Handled By</th>
            <th className="px-2 py-2">Reviewer</th>
            <th className="px-2 py-2">Notes</th>
            <th className="px-2 py-2 text-center">Date</th>
            <th className="px-2 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loading
            ? [...Array(itemsPerPage)].map((_, index) => (
                <tr key={index} className="text-black">
                  {[...Array(10)].map((__, i) => (
                    <td key={i} className="px-2 py-2">
                      <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                    </td>
                  ))}
                </tr>
              ))
            : paginatedData.map((item, i) => (
                <tr key={item.id} className="hover:bg-gray-50 text-black">
                  <td className="px-2 py-2 text-center">
                    {startIndex + i + 1}
                  </td>
                  <td className="px-2 py-2">{item.risk?.name}</td>
                  <td className="px-2 py-2">{item.risk?.unit}</td>
                  <td className="px-2 py-2 text-center">
                    {item.effectiveness}
                  </td>
                  <td className="px-2 py-2 text-center">
                    {item.approval_signature ? (
                      <img
                        src={item.approval_signature}
                        alt="Signature"
                        className="h-6 object-contain"
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-2 py-2 text-center">
                    {item.handler?.name || "-"}
                  </td>
                  <td className="px-2 py-2">{item.reviewer?.name || "-"}</td>
                  <td className="px-2 py-2">
                    {item.review_notes ? (
                      <button
                        className="text-red-600 hover:underline"
                        onClick={() => {
                          setSelectedNote(item.review_notes);
                          setNoteModalOpen(true);
                        }}
                      >
                        {item.review_notes.split(" ").slice(0, 3).join(" ") +
                          "..."}
                      </button>
                    ) : (
                      "-"
                    )}
                  </td>

                  <td className="px-2 py-2 text-center">
                    {new Date(item.created_at).toLocaleString()}
                  </td>
                  <td className="py-2 flex text-center gap-1.5">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="text-blue-600 hover:text-blue-800 cursor-pointer"
                      title="Detail"
                    >
                      <img
                        src="/icons/detail.svg"
                        alt="Detail Icon"
                        className="h-5 w-5 hover:opacity-80 hover:cursor-pointer"
                      />
                    </button>
                    <button
                      onClick={() => {
                        setSelectedReviewItem(item);
                        setReviewModalOpen(true);
                      }}
                      className={`${
                        (item.is_approved === null ||
                          item.is_approved === false) &&
                        item.is_sent
                          ? "text-green-700 hover:text-green-900 cursor-pointer"
                          : "text-gray-400 cursor-not-allowed"
                      }`}
                      title="Review"
                      disabled={
                        !(
                          (item.is_approved === null ||
                            item.is_approved === false) &&
                          item.is_sent
                        )
                      }
                    >
                      <CheckCircleIcon className="w-5 h-5" />
                    </button>
                    {/* <button
                      onClick={() => exportToExcel(item)}
                      className="text-indigo-600 hover:text-indigo-800 cursor-pointer"
                      title="Download Excel"
                    >
                      <DocumentArrowDownIcon className="h-5 w-5" />
                    </button> */}
                  </td>
                </tr>
              ))}
        </tbody>
      </table>
      {/* {!loading && totalPages > 1 && (
        // <div className="mt-4">
        //   <Pagination
        //     currentPage={currentPage}
        //     totalPages={totalPages}
        //     onPageChange={setCurrentPage}
        //   />
        // </div>
      )} */}
      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={(type, message) => {
          setReviewModalOpen(false);
          setSelectedReviewItem(null);

          if (type === "success") {
            setSuccessToast({ isOpen: true, message });
          } else if (type === "error") {
            setErrorToast({ isOpen: true, message });
          }

          fetchRiskHandlings()
            .then((res) => {
              const filtered = res.data.filter((item) => item.is_sent);
              setData(filtered);
            })
            .catch((err) => setError(err.message));
        }}
        item={selectedReviewItem}
      />
      <ReviewNoteModal
        isOpen={noteModalOpen}
        onClose={() => setNoteModalOpen(false)}
        note={selectedNote}
      />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
      />
    </div>
  );
}
