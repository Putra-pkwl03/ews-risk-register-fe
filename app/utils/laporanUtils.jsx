import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const FILE_LABELS = {
  "identifikasi-risiko": "Identifikasi Risiko",
  "analisis-risiko": "Analisis Risiko",
  "evaluasi-risiko": "Evaluasi Risiko",
};

export const getMappedData = (data, filename) => {
  switch (filename) {
    case "identifikasi-risiko":
      return data.map((item) => ({
        Klaster: item.cluster,
        Unit: item.unit,
        "Nama Risiko": item.name,
        Kategori: item.category,
        Deskripsi: item.description,
        Penyebab: item.causes
          ?.map((cause) => {
            const sub = cause.sub_causes?.map((s) => s.sub_cause).join(", ");
            return `Kategori: ${cause.category}, Utama: ${cause.main_cause}, Sub: ${sub}`;
          })
          .join(" || "),
        Dampak: item.impact,
        "UC/C": item.uc_c === 1 ? "C" : item.uc_c === 0 ? "UC" : item.uc_c,
      }));

    case "analisis-risiko":
      return data.map((item) => ({
        Klaster: item.risk?.cluster,
        Unit: item.risk?.unit,
        "Nama Risiko": item.risk?.name,
        Severity: item.severity,
        Probability: item.probability,
        Skor: item.score,
        "Bands Risiko": item.grading,
        Status: item.risk?.status,
      }));

    case "evaluasi-risiko":
      return data.map((item) => ({
        Klaster: item.cluster,
        Unit: item.unit,
        "Nama Risiko": item.name,
        Mitigasi: item.mitigations
          ?.map((m) => {
            const des = m.descriptions?.[0]?.description || "-";
            return `${m.mitigation_type}: ${des}`;
          })
          .join(" || "),
        Controllability: item.risk_appetite?.controllability || "-",
        Scoring: item.risk_appetite?.scoring || "-",
        Decision: item.risk_appetite?.decision || "-",
      }));

    default:
      return data;
  }
};

export const downloadExcel = (data, filename) => {
  const mappedData = getMappedData(data, filename);
  const worksheet = XLSX.utils.json_to_sheet(mappedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const fileData = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });

  saveAs(fileData, `${filename}.xlsx`);
};
