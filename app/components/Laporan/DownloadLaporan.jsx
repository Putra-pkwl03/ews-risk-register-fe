"use client";

import { useEffect, useState } from "react";
import { fetchRiskHandlings } from "../../lib/pnrisiko";
import SpinnerLoader from "../loadings/SpinnerLoader";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const DownloadLaporan = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [exportType, setExportType] = useState(null);
  const [rangeType, setRangeType] = useState(null);

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
    doc.text("Laporan Penanganan Risiko", 14, 15);

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
    <div className="max-w-7xl mx-auto px-6 py-10 text-black">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Laporan Penanganan Risiko</h1>
        <div className="relative">
          {!exportType ? (
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md"
              onClick={() => setExportType("open")}
            >
              Download
            </button>
          ) : exportType === "open" ? (
            <div className="absolute right-0 mt-2 w-40 bg-white border rounded-md shadow-md">
              <button
                onClick={() => setExportType("pdf")}
                className="w-full px-4 py-2 hover:bg-gray-100 text-left"
              >
                PDF
              </button>
              <button
                onClick={() => setExportType("excel")}
                className="w-full px-4 py-2 hover:bg-gray-100 text-left"
              >
                Excel
              </button>
            </div>
          ) : !rangeType ? (
            <div className="absolute right-0 mt-2 w-52 bg-white border rounded-md shadow-md">
              <button
                onClick={() => {
                  setRangeType("6bulan");
                  setTimeout(handleExport, 300);
                }}
                className="w-full px-4 py-2 hover:bg-gray-100 text-left"
              >
                6 Bulan Terakhir
              </button>
              <button
                onClick={() => {
                  setRangeType("semua");
                  setTimeout(handleExport, 300);
                }}
                className="w-full px-4 py-2 hover:bg-gray-100 text-left"
              >
                Semua Data
              </button>
            </div>
          ) : null}
        </div>
      </div>

      <div className="overflow-auto max-h-[75vh] border rounded">
        <table className="w-full border text-sm text-left">
          <thead className="bg-gray-100 sticky top-0">
            <tr>
              <th className="border px-2 py-1">No</th>
              <th className="border px-2 py-1">Nama Risiko</th>
              <th className="border px-2 py-1">Unit</th>
              <th className="border px-2 py-1">Kategori</th>
              <th className="border px-2 py-1">Dampak</th>
              <th className="border px-2 py-1">Penyebab</th>
              <th className="border px-2 py-1">Penanganan</th>
              <th className="border px-2 py-1">Monitoring</th>
              <th className="border px-2 py-1">Efektivitas</th>
              <th className="border px-2 py-1">Handler</th>
              <th className="border px-2 py-1">Reviewer</th>
              <th className="border px-2 py-1">Tanggal</th>
              <th className="border px-2 py-1">Tanda Tangan</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="border px-2 py-1 text-center">{idx + 1}</td>
                <td className="border px-2 py-1">{item.risk?.name}</td>
                <td className="border px-2 py-1">{item.risk?.unit}</td>
                <td className="border px-2 py-1">{item.risk?.category}</td>
                <td className="border px-2 py-1">{item.risk?.impact}</td>
                <td className="border px-2 py-1">{item.risk?.cause}</td>
                <td className="border px-2 py-1">{item.risk?.handling}</td>
                <td className="border px-2 py-1">
                  {item.risk?.monitoring_plan}
                </td>
                <td className="border px-2 py-1">{item.effectiveness}</td>
                <td className="border px-2 py-1">{item.handler?.name}</td>
                <td className="border px-2 py-1">{item.reviewer?.name}</td>
                <td className="border px-2 py-1">
                  {new Date(item.created_at).toLocaleDateString()}
                </td>
                <td className="border px-2 py-1 text-center">
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
    </div>
  );
};

export default DownloadLaporan;
