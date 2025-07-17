import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function generateLaporanPDF(data, judul = "Laporan Risiko") {
  const doc = new jsPDF("portrait");
  const tanggalCetak = new Date().toLocaleDateString("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  // Header hanya di halaman pertama
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
    const appetite = risk.risk_appetite || {};
    const causes = risk.causes || [];
    const mitigations = Array.isArray(risk.mitigations) && risk.mitigations.length > 0
      ? risk.mitigations
      : Array.isArray(item.mitigations) ? item.mitigations : [];

    if (index > 0) {
      doc.addPage();
      doc.setFontSize(10);
      doc.text(`Halaman ${index + 1} dari ${data.length}`, 200, 20, { align: "right" });
    }

    // RISK
    autoTable(doc, {
      startY: index === 0 ? 30 : 25,
      head: [["Field", "Isi"]],
      body: [
        ["Nama Risiko", risk.name || "-"],
        ["Cluster", risk.cluster || "-"],
        ["Unit", risk.unit || "-"],
        ["Kategori", risk.category || "-"],
        ["Deskripsi", risk.description || "-"],
        ["Dampak", risk.impact || "-"],
        ["Status", risk.status || "-"],
        ["Efektivitas Penanganan", item.effectiveness || "-"],
        ["Tanggal Penanganan", item.created_at?.split("T")[0] || "-"],
        ["Pembuat", creator],
        ["Validator", validator],
        ["Handler", handler],
      ],
      styles: { fontSize: 9, cellPadding: 3, valign: "top" },
      theme: "grid",
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 65 },
        1: { cellWidth: "auto" },
      },
    });

    // APPETITE
    autoTable(doc, {
      margin: { top: 10 },
      head: [["Risk Appetite", "Nilai"]],
      body: [
        ["Skor", appetite.scoring ?? "-"],
        ["Keputusan", appetite.decision || "-"],
        ["Ranking", appetite.ranking ?? "-"],
        ["Kontrolabilitas", appetite.controllability ?? "-"],
      ],
      styles: { fontSize: 9, cellPadding: 3 },
      theme: "grid",
      columnStyles: {
        0: { fontStyle: "bold", cellWidth: 65 },
        1: { cellWidth: "auto" },
      },
    });

    // CAUSES
    const causeRows = [];
    causes.forEach((cause) => {
      causeRows.push([
        `• ${cause.main_cause} (${cause.category})`,
        cause.sub_causes?.map((s) => `- ${s.sub_cause}`).join("\n") || "-",
      ]);
    });

    autoTable(doc, {
      margin: { top: 10 },
      head: [["Penyebab Utama (4M1E)", "Sub Penyebab"]],
      body: causeRows.length ? causeRows : [["-", "-"]],
      styles: { fontSize: 9, cellPadding: 3, valign: "top" },
      theme: "grid",
      columnStyles: {
        0: { cellWidth: 80 },
        1: { cellWidth: "auto" },
      },
    });

    // MITIGATIONS
    const mitigationRows = [];
    mitigations.forEach((m) => {
      mitigationRows.push([
        m.mitigation_type || "-",
        m.pic?.name || "-",
        m.deadline || "-",
        Array.isArray(m.descriptions) && m.descriptions.length > 0
          ? m.descriptions.map((d) => `- ${d.description}`).join("\n")
          : "-"
      ]);
    });

    autoTable(doc, {
      margin: { top: 10 },
      head: [["Jenis", "PIC", "Deadline", "Deskripsi Mitigasi"]],
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
    
  if (item.approval_signature) {
  const yPos = doc.lastAutoTable.finalY + 10;
  const imgWidth = 30;
  const imgHeight = 15;

  const centerX = 175;

  const text = "TTD:";
  const textWidth = doc.getTextWidth(text);
  const textX = centerX - (textWidth / 6);      
  const imgX = centerX - (imgWidth / 2);        

  doc.setFontSize(10);
  doc.text(text, textX, yPos);
  doc.addImage(item.approval_signature, 'PNG', imgX, yPos + 5, imgWidth, imgHeight);
}


  });

  doc.save("laporan-risiko.pdf");
}
