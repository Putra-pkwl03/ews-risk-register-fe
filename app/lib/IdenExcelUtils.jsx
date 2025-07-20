import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

// Helper untuk format penyebab
function formatCauses(causes = []) {
  return causes
    .map((cause, idx) => {
      const sub =
        cause.sub_causes
          ?.map((sc) => `     • Sub: ${sc.sub_cause}`)
          .join("\n") || "     • Sub: -";
      return `Kategori: ${idx + 1}. ${cause.category}\n   - Penyebab Utama: ${
        cause.main_cause
      }\n${sub}`;
    })
    .join("\n\n");
}

// Fungsi Export to Excel dengan gaya
export async function exportToExcel(data, filename = "laporan-risk") {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Laporan Risiko");

  // Header kolom
  worksheet.columns = [
    { header: "No", key: "no", width: 4 },
    { header: "Nama Risiko", key: "name", width: 20 },
    { header: "Cluster", key: "cluster", width: 15 },
    { header: "Unit", key: "unit", width: 15 },
    { header: "Kategori", key: "category", width: 15 },
    { header: "Dampak", key: "impact", width: 15 },
    { header: "Deskripsi", key: "description", width: 25 },
    { header: "Penyebab", key: "causes", width: 45 },
    { header: "UC/C", key: "uc_c", width: 15 },
    { header: "Tanggal", key: "tanggal", width: 12 },
  ];

  // data
  data.forEach((item, index) => {
    worksheet.addRow({
      no: index + 1,
      name: item.name || "-",
      cluster: item.cluster || "-",
      unit: item.unit || "-",
      category: item.category || "-",
      impact: item.impact || "-",
      description: item.description || "-",
      causes: formatCauses(item.causes),
      uc_c:
        item.uc_c === 1
          ? "Controlled"
          : item.uc_c === 0
          ? "Uncontrolled"
          : item.uc_c,
      tanggal: new Date(item.created_at).toLocaleDateString("id-ID"),
    });
  });

  // Gaya header
  const headerRow = worksheet.getRow(1);
  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFCCE5FF" },
    };
    cell.font = { bold: true };
    cell.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
  });
  headerRow.height = 22;

  // Gaya semua baris data
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber !== 1) {
      row.height = 50;
      row.alignment = { vertical: "top", wrapText: true };
      row.eachCell((cell) => {
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    }
  });

  // Ekspor file
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });

  const now = new Date().toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  saveAs(blob, `${filename}-${now}.xlsx`);
}

export function exportToPDF(data, filename = "laporan-risk") {
  const doc = new jsPDF("p", "mm", "a4");
  const fontSize = 9;

  data.forEach((item, index) => {
    const formattedCauses = item.causes.map((cause, i) => {
      const subCauses = (cause.sub_causes || [])
        .map((sub) => `     • Sub: ${sub.sub_cause}`)
        .join("\n");

      return [
        `Kategori: ${i + 1}. ${cause.category}`,
        `   - Penyebab Utama: ${cause.main_cause}`,
        subCauses,
      ]
        .filter(Boolean)
        .join("\n");
    });

    const rows = [
      ["No", index + 1],
      ["Nama Risiko", item.name || ""],
      ["Cluster", item.cluster || ""],
      ["Unit", item.unit || ""],
      ["Kategori", item.category || ""],
      ["Dampak", item.impact || ""],
      ["Deskripsi", item.description || ""],
      ["Penyebab", formattedCauses.join("\n\n")],
      [
        "UC/C",
        item.uc_c === 1 ? "Controlled" : item.uc_c === 0 ? "Uncontrolled" : "-",
      ],
      ["Tanggal", new Date(item.created_at).toLocaleDateString("id-ID")],
    ];

    const tableStartY = doc.lastAutoTable?.finalY
      ? doc.lastAutoTable.finalY + 10
      : 15;

    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.text(`Data Risiko #${index + 1}`, 15, tableStartY);

    autoTable(doc, {
      head: [],
      body: rows,
      startY: tableStartY + 5,
      styles: {
        fontSize,
        cellPadding: { top: 2, right: 2, bottom: 2, left: 2 },
        valign: "top",
        overflow: "linebreak",
        font: "helvetica",
        fontStyle: "normal",
      },
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 40 },
        1: { cellWidth: 140 },
      },
      theme: "grid",
      margin: { left: 15, right: 15 },
    });
  });

  doc.save(`${filename}.pdf`);
}
