"use client";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

const statusColors = {
  draft: "bg-gray-400",
  pending: "bg-yellow-500",
  validated_approved: "bg-green-500",
  validated_rejected: "bg-red-500",
};

const gradingColors = {
  "sangat tinggi": "bg-red-800 text-white",
  tinggi: "bg-red-500 text-white",
  sedang: "bg-yellow-400 text-white",
  rendah: "bg-green-700 text-white",
  "sangat rendah": "bg-green-400 text-white",
};

export default function RiskDetail({ risk, onBack }) {
  const uc_c_display =
    risk.uc_c === 0 ? "UC" : risk.uc_c === 1 ? "C" : risk.uc_c || "-";

  const gradingColorClass =
    gradingColors[risk.analysis?.grading?.toLowerCase()] ||
    "bg-gray-400 text-white";

  const statusColorClass = statusColors[risk.status] || "bg-gray-300";

  function formatDate(dateStr) {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  return (
    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 mx-auto">
      <button
        onClick={onBack}
        className="flex items-center text-sm text-gray-600 hover:text-blue-600 mb-6 hover:cursor-pointer"
      >
        <ArrowLeftIcon className="w-5 h-5 mr-1" />
      </button>

      <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
        Detail Analisis Risiko
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 mb-8">
        <DetailItem label="Nama Risiko" value={risk.name} />
        <DetailItem label="Klaster" value={risk.cluster} />
        <DetailItem label="Unit" value={risk.unit} />
        <DetailItem label="Kategori" value={risk.category} />
        <DetailItem
          label="Deskripsi"
          value={risk.description || "-"}
          spanFull
        />
        <DetailItem label="Dampak" value={risk.impact || "-"} spanFull />
        <DetailItem label="UC/C" value={uc_c_display} />
        <DetailItem label="Severity" value={risk.analysis?.severity ?? "-"} />
        <DetailItem
          label="Probability"
          value={risk.analysis?.probability ?? "-"}
        />
        <DetailItem label="Score" value={risk.analysis?.score ?? "-"} />
        <DetailItem
          label="Grading"
          custom={
            <span
              className={`capitalize text-[12px] font-medium px-2 py-2 flex justify-center items-center rounded-md border ${gradingColorClass}`}
            >
              {risk.analysis?.grading || "-"}
            </span>
          }
        />
        <DetailItem
          label="Status Risiko"
          custom={
            <div
              className={`px-3 py-2 inline-flex items-center gap-2 rounded-2xl text-white text-sm capitalize ${statusColorClass}`}
            >
              {risk.status || "-"}
            </div>
          }
        />
        <DetailItem
          label="Controllability"
          value={risk.risk_appetite?.controllability ?? "-"}
        />
        <DetailItem
          label="Score"
          value={risk.risk_appetite?.scoring ?? "-"}
        />
        <DetailItem
          label="Ranking"
          value={risk.risk_appetite?.ranking ?? "-"}
        />
        <DetailItem
          label="Tanggal Dibuat"
          value={formatDate(risk.created_at)}
        />
        <DetailItem
          label="Tanggal Diperbarui"
          value={formatDate(risk.updated_at)}
        />
      </div>

      <button
        onClick={onBack}
        className="mt-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl w-full hover:cursor-pointer"
      >
        Tutup Detail
      </button>
    </div>
  );
}

function DetailItem({
  label,
  value,
  custom,
  capitalize = false,
  spanFull = false,
}) {
  return (
    <div className={`${spanFull ? "md:col-span-2" : ""}`}>
      <div className="text-gray-500 font-medium mb-1">{label}</div>
      {custom ? (
        custom
      ) : (
        <div
          className={`p-3 bg-gray-100 rounded-xl ${
            capitalize ? "capitalize" : ""
          }`}
        >
          {value ?? "-"}
        </div>
      )}
    </div>
  );
}
