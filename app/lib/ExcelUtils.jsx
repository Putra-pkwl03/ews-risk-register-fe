import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

export async function generateExcel(data, judul = "Laporan Risiko") {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(judul);

  // Header
const headerRow = worksheet.addRow([
  "Nama Risiko", "Cluster", "Unit", "Kategori", "Deskripsi", "Dampak", "Status",
  "Efektivitas", "Tanggal", "Pembuat", "Validator", "Handler",
  "Risk Appetite", "Keputusan", "Ranking", "Kontrolabilitas",
  "Penyebab Utama", "Sub Penyebab",
  "Jenis Mitigasi", "Deskripsi Mitigasi", "PIC", "Deadline"
]);

headerRow.font = { bold: true };
headerRow.height = 25;

// Warna dan border untuk header
headerRow.eachCell((cell) => {
  cell.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FFCCE5FF' } 
  };
  cell.border = {
    top: { style: 'thin' },
    left: { style: 'thin' },
    bottom: { style: 'thin' },
    right: { style: 'thin' }
  };
});

  headerRow.font = { bold: true };
  headerRow.height = 25;

  data.forEach((item) => {
    const risk = item.risk || {};
    const creator = risk.creator?.name || "-";
    const validator = risk.validations?.[0]?.validator?.name || "-";
    const handler = item.handler?.name || "-";
    const appetite = risk.risk_appetite || {};
    const causes = risk.causes || [];
    const mitigations = Array.isArray(risk.mitigations) && risk.mitigations.length > 0
      ? risk.mitigations
      : Array.isArray(item.mitigations) ? item.mitigations : [];

    const mainCauses = causes.map(c => `• ${c.main_cause} (${c.category})`).join("\n");
    const subCauses = causes
      .map(c => c.sub_causes?.map((s, idx) => `${idx + 1}. ${s.sub_cause}`).join("\n"))
      .filter(Boolean)
      .join("\n");

    const baseRow = [
      risk.name || "-", risk.cluster || "-", risk.unit || "-", risk.category || "-",
      risk.description || "-", risk.impact || "-", risk.status || "-",
      item.effectiveness || "-", item.created_at?.split("T")[0] || "-",
      creator, validator, handler,
      appetite.scoring ?? "-", appetite.decision || "-", appetite.ranking ?? "-", appetite.controllability ?? "-",
      mainCauses, subCauses
    ];

    if (mitigations.length > 0) {
      mitigations.forEach((m, i) => {
        const formattedDescriptions = Array.isArray(m.descriptions)
          ? m.descriptions.map((d, idx) => `${idx + 1}. ${d.description}`).join("\n")
          : "-";

        const mitRow = [
          ...(i === 0 ? baseRow : Array(18).fill("")),
          m.mitigation_type || "-",
          formattedDescriptions,
          m.pic?.name || "-",
          m.deadline || "-"
        ];

        const row = worksheet.addRow(mitRow);
        row.font = i > 0 ? { italic: true } : {};
        row.alignment = { vertical: 'top', wrapText: true };
        row.height = 50; 
      });
    } else {
      const row = worksheet.addRow([...baseRow, "", "", "", ""]);
      row.alignment = { vertical: 'top', wrapText: true };
      row.height = 50;
    }
  });

  // Auto width & alignment per kolom
  worksheet.columns.forEach((col) => {
    col.width = 25;
    col.alignment = { vertical: 'top', wrapText: true };
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const now = new Date().toLocaleDateString("id-ID", { day: '2-digit', month: 'short', year: 'numeric' });
  saveAs(new Blob([buffer]), `laporan-risiko-${now}.xlsx`);
}
