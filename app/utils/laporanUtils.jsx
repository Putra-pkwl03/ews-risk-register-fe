import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export const FILE_LABELS = {
  "identifikasi-risiko": "Risk Identification",
  "analisis-risiko": "Risk Analysis",
  "evaluasi-risiko": "Risk Evaluation",
};

export const getMappedData = (data, filename) => {
  switch (filename) {
    case "identifikasi-risiko":
      return data.map((item) => ({
        Cluster: item.cluster,
        Unit: item.unit,
        "Risk Name": item.name,
        Category: item.category,
        Description: item.description,
        Causes: item.causes
          ?.map((cause) => {
            const sub = cause.sub_causes?.map((s) => s.sub_cause).join(", ");
            return `Category: ${cause.category}, Main: ${cause.main_cause}, Sub: ${sub}`;
          })
          .join(" || "),
        Impact: item.impact,
        "UC/C": item.uc_c === 1 ? "C" : item.uc_c === 0 ? "UC" : item.uc_c,
      }));

    case "analisis-risiko":
      return data.map((item) => ({
        Cluster: item.risk?.cluster,
        Unit: item.risk?.unit,
        "Risk Name": item.risk?.name,
        Severity: item.severity,
        Probability: item.probability,
        Score: item.score,
        "Risk Bands": item.grading,
        Status: item.risk?.status,
      }));

    case "evaluasi-risiko":
      return data.map((item) => ({
        Cluster: item.cluster,
        Unit: item.unit,
        "Risk Name": item.name,
        Mitigation: item.mitigations
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
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const fileData = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });

  saveAs(fileData, `${filename}.xlsx`);
};
