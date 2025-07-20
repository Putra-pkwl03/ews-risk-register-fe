"use client";

import { useEffect, useState, useRef } from "react";
import { fetchRiskHandlings } from "../../lib/pnrisiko";
import SpinnerLoader from "../loadings/SpinnerLoader";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { Download } from "lucide-react";

const DownloadLaporan = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exportType, setExportType] = useState(null);
  const [rangeType, setRangeType] = useState(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setExportType(null);
        setRangeType(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    fetchRiskHandlings()
      .then((res) => {
        const filtered = res.data.filter(
          (item) =>
            item.is_sent &&
            item.approval_signature &&
            item.approval_signature !== ""
        );
        setData(filtered);
        setLoading(false);
      })
      .catch((err) => {
        console.error("❌ Gagal ambil data:", err.message);
        setLoading(false);
      });
  }, []);

  const getFilteredData = () => {
    if (rangeType === "6bulan") {
      const sixMonthsAgo = new Date();
      sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
      return data.filter((item) => new Date(item.created_at) >= sixMonthsAgo);
    }
    return data;
  };

  const exportToPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    doc.text("Laporan Risiko", 14, 15);

    const tableData = getFilteredData().map((item, index) => [
      index + 1,
      item.risk?.name || "-",
      item.risk?.unit || "-",
      item.risk?.category || "-",
      item.risk?.impact || "-",
      item.risk?.cause || "-",
      item.risk?.handling || "-",
      item.risk?.monitoring_plan || "-",
      item.effectiveness || "-",
      item.handler?.name || "-",
      item.reviewer?.name || "-",
      new Date(item.created_at).toLocaleDateString(),
      item.approval_signature || "-", // will be replaced with image later
    ]);

    autoTable(doc, {
      head: [
        [
          "No",
          "Nama Risiko",
          "Unit",
          "Kategori",
          "Dampak",
          "Penyebab",
          "Penanganan",
          "Monitoring",
          "Efektivitas",
          "Handler",
          "Reviewer",
          "Tanggal",
          "Tanda Tangan",
        ],
      ],
      body: tableData,
      startY: 25,
      styles: { cellWidth: "wrap", fontSize: 8 },
      columnStyles: {
        12: { cellWidth: 30 }, // tanda tangan
      },
      didDrawCell: function (data) {
        if (
          data.column.index === 12 &&
          data.cell.raw &&
          typeof data.cell.raw === "string" &&
          data.cell.raw.startsWith("data:image")
        ) {
          doc.addImage(
            data.cell.raw,
            "PNG",
            data.cell.x + 1,
            data.cell.y + 1,
            28,
            10
          );
        }
      },
    });

    doc.save(`laporan_penanganan_risiko_${rangeType}.pdf`);
  };

  const exportToExcel = () => {
    const headers = [
      "No",
      "Nama Risiko",
      "Unit",
      "Kategori",
      "Dampak",
      "Penyebab",
      "Penanganan",
      "Monitoring",
      "Efektivitas",
      "Handler",
      "Reviewer",
      "Tanggal",
      "Tanda Tangan",
    ];

    const rows = getFilteredData().map((item, index) => [
      index + 1,
      item.risk?.name || "-",
      item.risk?.unit || "-",
      item.risk?.category || "-",
      item.risk?.impact || "-",
      item.risk?.cause || "-",
      item.risk?.handling || "-",
      item.risk?.monitoring_plan || "-",
      item.effectiveness || "-",
      item.handler?.name || "-",
      item.reviewer?.name || "-",
      new Date(item.created_at).toLocaleDateString(),
      item.approval_signature ? "✅ Sudah TTD" : "-",
    ]);

    const ws = XLSX.utils.aoa_to_sheet([headers, ...rows]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Laporan Risiko");

    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8",
    });

    saveAs(blob, `laporan_penanganan_risiko_${rangeType}.xlsx`);
  };

  const handleExport = () => {
    if (exportType === "pdf") {
      exportToPDF();
    } else if (exportType === "excel") {
      exportToExcel();
    }
    setExportType(null);
    setRangeType(null);
  };

  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white">
        <SpinnerLoader />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 text-black overflow-x-auto">
      <div className="flex flex-wrap gap-4 justify-between items-start sm:items-center mb-6">
        <h1 className="text-2xl font-bold whitespace-nowrap">Laporan Risiko</h1>

        <div ref={wrapperRef} className="relative inline-block text-left">
          {/* Tombol Download selalu muncul */}
          <button
            onClick={() =>
              exportType === "open"
                ? setExportType(null)
                : setExportType("open")
            }
            className="flex items-center gap-2 px-3 py-1.5 border border-blue-500 text-blue-500 hover:bg-blue-100 cursor-pointer rounded-md text-sm"
          >
            Download
            <Download className="h-4 w-4" />
          </button>

          {/* Dropdown Pilihan PDF / Excel */}
          {exportType === "open" && (
            <div className="absolute right-0 mt-2 w-44 bg-white border border-gray-300 rounded-md shadow-lg z-10 space-y-1 p-2">
              <button
                onClick={() => {
                  setExportType("pdf");
                  setTimeout(() => setRangeType("select"), 100);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition cursor-pointer"
              >
                <img src="/icons/pdf.png" alt="PDF" className="w-4 h-4" />
                <span>PDF</span>
              </button>
              <button
                onClick={() => {
                  setExportType("excel");
                  setTimeout(() => setRangeType("select"), 100);
                }}
                className="w-full flex items-center gap-2 px-3 py-2 text-sm text-green-600 border border-green-300 rounded-md hover:bg-green-50 transition cursor-pointer"
              >
                <img src="/icons/excel.png" alt="Excel" className="w-4 h-4" />
                <span>Excel</span>
              </button>
            </div>
          )}

          {/* Dropdown Pilihan Rentang Waktu */}
          {rangeType === "select" && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-20 overflow-hidden">
              <button
                onClick={() => {
                  setRangeType("semua");
                  setTimeout(handleExport, 300);
                }}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3M16 7V3M3 11h18M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="font-medium">Semua Data</span>
              </button>

              <button
                onClick={() => {
                  setRangeType("6bulan");
                  setTimeout(handleExport, 300);
                }}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-all cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-gray-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3M16 7V3M3 11h18M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="font-medium">6 Bulan Terakhir</span>
              </button>
            </div>
          )}
        </div>
      </div>

      
        <table className="w-full text-sm text-left overflow-auto max-h-[75vh] rounded">
          <thead className="bg-gray-100 text-[#5932EA] text-left border-b">
            <tr>
              <th className="px-2 py-1">No</th>
              <th className="px-2 py-1">Nama Risiko</th>
              <th className="px-2 py-1">Unit</th>
              <th className="px-2 py-1">Kategori</th>
              <th className="px-2 py-1">Dampak</th>
              <th className="px-2 py-1">Penyebab</th>
              <th className="px-2 py-1">Penanganan</th>
              <th className="px-2 py-1">Monitoring</th>
              <th className="px-2 py-1">Efektivitas</th>
              <th className="px-2 py-1">Handler</th>
              <th className="px-2 py-1">Reviewer</th>
              <th className="px-2 py-1">Tanggal</th>
              <th className="px-2 py-1">Tanda Tangan</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr
                key={item.id}
                className={`text-[12px] text-[#292D32] transition-colors border-gray-200 ${
                  idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-gray-100`}
              >
                <td className="px-2 py-1 text-center">{idx + 1}</td>
                <td className="px-2 py-1">{item.risk?.name}</td>
                <td className="px-2 py-1">{item.risk?.unit}</td>
                <td className="px-2 py-1">{item.risk?.category}</td>
                <td className="px-2 py-1">{item.risk?.impact}</td>
                <td className="px-2 py-1">{item.risk?.cause}</td>
                <td className="px-2 py-1">{item.risk?.handling}</td>
                <td className="px-2 py-1">
                  {item.risk?.monitoring_plan}
                </td>
                <td className="px-2 py-1">{item.effectiveness}</td>
                <td className="px-2 py-1">{item.handler?.name}</td>
                <td className="px-2 py-1">{item.reviewer?.name}</td>
                <td className="px-2 py-1">
                  {new Date(item.created_at).toLocaleDateString()}
                </td>
                <td className="px-2 py-1 text-center">
                  <img
                    src={item.approval_signature}
                    alt="TTD"
                    className="w-20 h-auto mx-auto"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      
    </div>
  );
};

export default DownloadLaporan;
