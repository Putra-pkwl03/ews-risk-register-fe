"use client";
import { useEffect, useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { fetchRiskAnalysisById } from "../../lib/RiskAnalysis";
import SpinnerLoader from "../loadings/SpinnerLoader";

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

export default function DetailAnalisisRisiko({ data, onClose }) {
  const [riskAnalysisData, setRiskAnalysisData] = useState(null);

  useEffect(() => {
    if (data?.id) {
      fetchRiskAnalysisById(data.id)
        .then((res) => {
          console.log("Fetched RiskAnalysis:", res);
          setRiskAnalysisData(res);
        })
        .catch((err) => console.error("Gagal mengambil data:", err));
    }
  }, [data]);

  const isLoading = !data || !riskAnalysisData;

  const riskAnalysis = Array.isArray(riskAnalysisData)
    ? riskAnalysisData[0]
    : riskAnalysisData;
  const risk = riskAnalysis?.risk || {};
  const creatorName = riskAnalysis?.creator?.name || "Unknown";

  const uc_c_display =
    risk.uc_c === 0 ? "UC" : risk.uc_c === 1 ? "C" : risk.uc_c || "-";

  const gradingColorClass =
    gradingColors[riskAnalysis?.grading?.toLowerCase()] ||
    "bg-gray-400 text-white";

  const statusColorClass = statusColors[risk?.status] || "bg-gray-300";

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

  return isLoading ? (
    <div className="fixed inset-0 flex justify-center items-center">
      <SpinnerLoader />
    </div>
  ) : (
    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 mx-auto">
      <button
        onClick={() => {
          const params = new URLSearchParams(window.location.search);
          params.delete("ref");
          const newUrl = `${window.location.pathname}?${params.toString()}`;
          window.history.pushState({}, "", newUrl);
          onClose();
        }}
        className="flex items-center text-sm text-gray-600 hover:text-blue-600 mb-6 hover:cursor-pointer"
      >
        <ArrowLeftIcon className="w-5 h-5 mr-1" />
        Kembali
      </button>

      <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
        Detail Analisis Risiko
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 mb-8">
        <DetailItem label="Klaster" value={risk.cluster} />
        <DetailItem label="Unit" value={risk.unit} />
        <DetailItem label="Nama Risiko" value={risk.name} />
        <DetailItem label="Kategori" value={risk.category} />
        <DetailItem
          label="Deskripsi"
          value={risk.description || "-"}
          spanFull
        />
        <div>
          <h3 className="mb-2 font-semibold text-gray-800">Penyebab</h3>
          {risk.causes && risk.causes.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {risk.causes.map((cause) => (
                <div
                  key={cause.id}
                  className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-gray-800"
                >
                  <div className="mb-2">
                    <strong className="text-[16px] font-semibold">
                      Kategori:
                    </strong>{" "}
                    <span className="capitalize text-[14px]">
                      {cause.category}
                    </span>
                  </div>
                  <div className="mb-2">
                    <strong className="text-[16px] font-semibold">
                      Penyebab Utama:
                    </strong>{" "}
                    <span className="capitalize text-[14px]">
                      {cause.main_cause}
                    </span>
                  </div>
                  {cause.sub_causes && cause.sub_causes.length > 0 && (
                    <div className="ml-4 mt-3 text-[14px] text-gray-600 font-semibold">
                      <strong>Sub Penyebab:</strong>
                      <ul className="list-disc list-inside mt-1 space-y-1 text-[14px]">
                        {cause.sub_causes.map((sub) => (
                          <li key={sub.id}>{sub.sub_cause}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">Tidak ada penyebab yang tercatat.</p>
          )}
        </div>
        <DetailItem label="Dampak" value={risk.impact || "-"} spanFull />
        <DetailItem label="UC/C" value={uc_c_display} />
        <DetailItem label="Severity" value={riskAnalysis.severity ?? "-"} />
        <DetailItem
          label="Probability"
          value={riskAnalysis.probability ?? "-"}
        />
        <DetailItem label="Score" value={riskAnalysis.score ?? "-"} />
        <DetailItem label="Dibuat oleh" value={creatorName} />
        <DetailItem
          label="Tanggal Dibuat"
          value={formatDate(risk.created_at)}
        />
        <DetailItem
          label="Tanggal Update"
          value={formatDate(risk.updated_at)}
        />
        <DetailItem
          label="Grading"
          custom={
            <span
              className={`capitalize text-[12px] font-medium px-2 py-2 flex justify-center items-center rounded-md border ${gradingColorClass}`}
            >
              {riskAnalysis.grading || "-"}
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
      </div>

      <button
        onClick={onClose}
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
