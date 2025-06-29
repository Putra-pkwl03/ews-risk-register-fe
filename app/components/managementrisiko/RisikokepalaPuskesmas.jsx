"use client";

import { useEffect, useState } from "react";
import { fetchRiskHandlings } from "../../lib/pnrisiko";
import DetailRiskHandling from "../pnrisiko/DetailRiskHandling";
import ReviewModal from "../managementrisiko/ReviewModal";
import ReviewNoteModal from "../managementrisiko/RiviewNoteModal";
import {
  CheckCircleIcon,
  DocumentArrowDownIcon,
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
  const itemsPerPage = 9;

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
  const paginatedData = loading
    ? []
    : data.slice(startIndex, startIndex + itemsPerPage);
  const totalPages = Math.ceil(data.length / itemsPerPage);

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
        "Nama Risiko",
        "Unit",
        "Klaster Risiko",
        "Kategori Risiko",
        "Dampak Risiko",
        "Deskripsi Risiko",
        "Scoring",
        "Ranking",
        "Keputusan",
        "Efektivitas",
        "Signature",
        "Handled By",
        "Reviewer",
        "Tanggal Penanganan",
        "Catatan",
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
    XLSX.utils.book_append_sheet(wb, ws, "Detail Risiko");

    // Aktifkan style agar bisa dibaca Excel
    const excelBuffer = XLSX.write(wb, {
      bookType: "xlsx",
      type: "array",
      cellStyles: true,
    });

    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(blob, `penanganan_risiko_${risk?.name || "export"}.xlsx`);
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

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h1 className="text-[20px] text-black font-semibold">
          Manajemen Risiko
        </h1>
      </div>.....

      {error && <p className="text-red-500">{error}</p>}

      {data.length === 0 && !loading && (
        <p className="text-gray-500">Belum ada data penanganan risiko.</p>
      )}

      <table className="w-full text-sm sm:text-base">
        <thead className="bg-gray-100 text-[#5932EA] text-left border-b">
          <tr>
            <th className="px-2 py-2">No</th>
            <th className="px-2 py-2 text-left">Risiko</th>
            <th className="px-2 py-2 text-left">Unit</th>
            <th className="px-2 py-2">Efektivitas</th>
            <th className="px-2 py-2">Signature</th>
            <th className="px-2 py-2">Handled By</th>
            <th className="px-2 py-2">Reviewer</th>
            <th className="px-2 py-2">Catatan</th>
            <th className="px-2 py-2 text-center">Tanggal</th>
            <th className="px-2 py-2 text-center">Aksi</th>
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
                        alt="Tanda Tangan"
                        className="h-6 object-contain"
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-2 py-2 text-center">
                    {item.handler?.name || "-"}
                  </td>
                  <td className="px-2 py-2 text-center">
                    {item.reviewer?.name || "-"}
                  </td>
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
                      title="Tindak Lanjut"
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
                    <button
                      onClick={() => exportToExcel(item)}
                      className="text-indigo-600 hover:text-indigo-800 cursor-pointer"
                      title="Download Excel"
                    >
                      <DocumentArrowDownIcon className="h-5 w-5" />
                    </button>
                  </td>
                </tr>
              ))}
        </tbody>
      </table>

      {!loading && totalPages > 1 && (
        <div className="mt-4">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}

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
    </div>
  );
}
