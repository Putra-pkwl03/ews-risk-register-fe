import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

function formatEfektivitas(code) {
  if (code === "E") return "Efektif";
  if (code === "KE") return "Kurang Efektif";
  if (code === "TE") return "Tidak Efektif";
  return "-";
}

export async function generateExcel(data, judul = "Laporan Risiko") {
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet(judul);

  const headers = [
    // Identifikasi Risiko
    "Nama Risiko",
    "Cluster",
    "Unit",
    "Kategori",
    "Deskripsi",
    "Penyebab Utama",
    "Sub Penyebab",
    "Dampak",
    "UC/C",
    // Analisis Risiko
    "Severity",
    "Probability",
    "Skor",
    "Bands Risiko",
    "Status",
    // Evaluasi Risiko
    "Kontrolabilitas",
    "Scoring",
    "Ranking",
    // Penanganan Risiko
    "Deskripsi Mitigasi",
    "Keputusan",
    "Efektivitas",
    "Hambatan",
    "Signature",
    "Pembuat",
    "Handled By",
    "Validator",
    "Reviewer",
    "Catatan",
    "Jenis Mitigasi",
    "PIC",
    "Deadline",
    "Tanggal",
  ];

  const headerRow = worksheet.addRow(headers);
  headerRow.font = { bold: true };
  headerRow.height = 25;

  headerRow.eachCell((cell) => {
    cell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFCCE5FF" }, // Light blue
    };
    cell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    cell.alignment = {
      vertical: "middle",
      horizontal: "center",
      wrapText: true,
    };
  });

  const signatureColIndex = headers.indexOf("Signature");

  let rowIndex = 1; // Start from 1 (header row)

  for (const item of data) {
    const risk = item.risk || {};
    const creator = risk.creator?.name || "-";
    const validator = risk.validations?.[0]?.validator?.name || "-";
    const handler = item.handler?.name || "-";
    const reviewer = item.reviewed_by?.name || "-";
    const appetite = risk.risk_appetite || {};
    const causes = risk.causes || [];

    const mitigations =
      Array.isArray(risk.mitigations) && risk.mitigations.length > 0
        ? risk.mitigations
        : Array.isArray(item.mitigations)
        ? item.mitigations
        : [];

    const mainCauses = causes
      .map((c) => `• ${c.main_cause} (${c.category})`)
      .join("\n");

    const subCauses = causes
      .map((c) =>
        c.sub_causes?.map((s, idx) => `${idx + 1}. ${s.sub_cause}`).join("\n")
      )
      .filter(Boolean)
      .join("\n");

    const uc_c =
      risk.uc_c === 1 ? "Controlled" : risk.uc_c === 0 ? "Uncontrolled" : "-";

    const severity = item.severity ?? "-";
    const probability = item.probability ?? "-";
    const score = item.score ?? "-";
    const bands = item.grading ?? "-";

    const controllability = appetite.controllability ?? "-";
    const scoring = appetite.scoring ?? "-";
    const ranking = appetite.ranking ?? "-";
    const decision = appetite.decision ?? "-";
    const efektivitas = formatEfektivitas(item.effectiveness);
    const hambatan = item.barrier || "-";
    const catatan = item.review_notes || "-";
    const tanggal = item.created_at?.split("T")[0] || "-";

    const signatureImgUrl = item.approval_signature;

    const insertRow = async (mit = {}) => {
      const formattedDescriptions = Array.isArray(mit.descriptions)
        ? mit.descriptions
            .map((d, i) => `${i + 1}. ${d.description}`)
            .join("\n")
        : "-";

      const rowData = [
        risk.name || "-",
        risk.cluster || "-",
        risk.unit || "-",
        risk.category || "-",
        risk.description || "-",
        mainCauses,
        subCauses,
        risk.impact || "-",
        uc_c,
        severity,
        probability,
        score,
        bands,
        risk.status || "-",
        controllability,
        scoring,
        ranking,
        formattedDescriptions,
        decision,
        efektivitas,
        hambatan,
        "",
        creator,
        handler,
        validator,
        reviewer,
        catatan,
        mit.mitigation_type || "-",
        mit.pic?.name || "-",
        mit.deadline || "-",
        tanggal,
      ];

      const row = worksheet.addRow(rowData);
      row.alignment = { vertical: "top", wrapText: true };
      row.height = 60;
      rowIndex++;

      // Alternating row color (selang-seling)
      const fillColor = rowIndex % 2 === 0 ? "FFFFFFFF" : "FFF2F2F2"; // putih & abu muda
      row.eachCell((cell) => {
        cell.fill = {
          type: "pattern",
          pattern: "solid",
          fgColor: { argb: fillColor },
        };
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });

      // Signature image
      if (signatureImgUrl) {
        try {
          const res = await fetch(signatureImgUrl);
          const blob = await res.blob();
          const buffer = await blob.arrayBuffer();

          const imageId = workbook.addImage({
            buffer,
            extension: "png",
          });

          worksheet.addImage(imageId, {
            tl: { col: signatureColIndex, row: row.number - 1 },
            ext: { width: 100, height: 40 },
          });
        } catch (error) {
          console.error("Gagal menambahkan signature:", error);
        }
      }
    };

    if (mitigations.length > 0) {
      for (const mit of mitigations) {
        await insertRow(mit);
      }
    } else {
      await insertRow();
    }
  }

  worksheet.columns.forEach((col) => {
    col.width = 25;
    col.alignment = { vertical: "top", wrapText: true };
  });

  const buffer = await workbook.xlsx.writeBuffer();
  const now = new Date().toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  saveAs(new Blob([buffer]), `laporan-risiko-${now}.xlsx`);
}
