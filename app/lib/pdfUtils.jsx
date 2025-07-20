import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function formatEfektivitas(code) {
  if (code === "E") return "Efektif";
  if (code === "KE") return "Kurang Efektif";
  if (code === "TE") return "Tidak Efektif";
  return "-";
}

export function generateLaporanPDF(data, judul = "Laporan Risiko") {
  const doc = new jsPDF("portrait");
  const tanggalCetak = new Date().toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  doc.setFontSize(14);
  doc.text(judul, 14, 14);

  doc.setFontSize(10);
  doc.text(`Tanggal Cetak: ${tanggalCetak}`, 14, 20);
  doc.text(`Halaman 1 dari ${data.length}`, 200, 20, { align: "right" });

  data.forEach((item, index) => {
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

    const mainCauses =
      causes.map((c) => `• ${c.main_cause} (${c.category})`).join("\n") || "-";
    const subCauses =
      causes
        .map((c) =>
          c.sub_causes?.map((s, idx) => `${idx + 1}. ${s.sub_cause}`).join("\n")
        )
        .filter(Boolean)
        .join("\n") || "-";

    const uc_c =
      risk.uc_c === 1 ? "Controlled" : risk.uc_c === 0 ? "Uncontrolled" : "-";
    const efektivitas = formatEfektivitas(item.effectiveness);
    const tanggal = item.created_at?.split("T")[0] || "-";
    const catatan = item.review_notes || "-";
    const hambatan = item.barrier || "-";

    if (index > 0) {
      doc.addPage();
      doc.setFontSize(10);
      doc.text(`Halaman ${index + 1} dari ${data.length}`, 200, 20, {
        align: "right",
      });
    }

    // Identifikasi Risiko
    autoTable(doc, {
      startY: index === 0 ? 30 : 25,
      head: [["Identifikasi Risiko", "Isi"]],
      body: [
        ["Nama Risiko", risk.name || "-"],
        ["Cluster", risk.cluster || "-"],
        ["Unit", risk.unit || "-"],
        ["Kategori", risk.category || "-"],
        ["Deskripsi", risk.description || "-"],
        ["Penyebab Utama", mainCauses],
        ["Sub Penyebab", subCauses],
        ["Dampak", risk.impact || "-"],
        ["UC/C", uc_c],
        ["Status", risk.status || "-"],
      ],
      styles: { fontSize: 9, cellPadding: 3, valign: "top" },
      theme: "grid",
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 65 },
        1: { cellWidth: "auto" },
      },
    });

    // Analisis Risiko
    autoTable(doc, {
      margin: { top: 10 },
      head: [["Analisis Risiko", "Nilai"]],
      body: [
        ["Severity", item.severity ?? "-"],
        ["Probability", item.probability ?? "-"],
        ["Skor", item.score ?? "-"],
        ["Bands Risiko", item.grading ?? "-"],
      ],
      styles: { fontSize: 9, cellPadding: 3 },
      theme: "grid",
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 65 },
        1: { cellWidth: "auto" },
      },
    });

    // Evaluasi Risiko
    autoTable(doc, {
      margin: { top: 10 },
      head: [["Evaluasi Risiko", "Nilai"]],
      body: [
        ["Kontrolabilitas", appetite.controllability ?? "-"],
        ["Scoring", appetite.scoring ?? "-"],
        ["Ranking", appetite.ranking ?? "-"],
        ["Keputusan", appetite.decision ?? "-"],
      ],
      styles: { fontSize: 9, cellPadding: 3 },
      theme: "grid",
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 65 },
        1: { cellWidth: "auto" },
      },
    });

    // Penanganan Risiko
    const mitigationRows = mitigations.map((m) => [
      m.mitigation_type || "-",
      m.pic?.name || "-",
      m.deadline || "-",
      Array.isArray(m.descriptions)
        ? m.descriptions.map((d) => `- ${d.description}`).join("\n")
        : "-",
    ]);

    autoTable(doc, {
      margin: { top: 10 },
      head: [["Jenis Mitigasi", "PIC", "Deadline", "Deskripsi Mitigasi"]],
      body: mitigationRows.length ? mitigationRows : [["-", "-", "-", "-"]],
      styles: { fontSize: 9, cellPadding: 3, valign: "top" },
      theme: "grid",
      columnStyles: {
        0: { cellWidth: 35 },
        1: { cellWidth: 40 },
        2: { cellWidth: 30 },
        3: { cellWidth: "auto" },
      },
    });

    // Informasi Tambahan & Signature
    autoTable(doc, {
      margin: { top: 10 },
      head: [["Field", "Isi"]],
      body: [
        ["Efektivitas", efektivitas],
        ["Hambatan", hambatan],
        ["Catatan", catatan],
        ["Tanggal", tanggal],
        ["Pembuat", creator],
        ["Handled By", handler],
        ["Validator", validator],
        ["Reviewer", reviewer],
      ],
      styles: { fontSize: 9, cellPadding: 3, valign: "top" },
      theme: "grid",
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 65 },
        1: { cellWidth: "auto" },
      },
    });

    if (item.approval_signature) {
      const yPos = doc.lastAutoTable.finalY + 10;
      const imgWidth = 30;
      const imgHeight = 15;
      const centerX = 175;

      const text = "TTD:";
      const textWidth = doc.getTextWidth(text);
      const textX = centerX - textWidth / 6;
      const imgX = centerX - imgWidth / 2;

      doc.setFontSize(10);
      doc.text(text, textX, yPos);
      doc.addImage(
        item.approval_signature,
        "PNG",
        imgX,
        yPos + 5,
        imgWidth,
        imgHeight
      );
    }
  });

  doc.save("laporan-risiko.pdf");
}
