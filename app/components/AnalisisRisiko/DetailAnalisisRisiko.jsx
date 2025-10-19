"use client";
import { useEffect, useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { fetchRiskAnalysisById } from "../../lib/RiskAnalysis";
import SpinnerLoader from "../loadings/SpinnerLoader";
import FishboneModal from "../diagram/FishboneModal";
import FishboneChart from "../diagram/FishboneChart";

const statusColors = {
  draft: "bg-gray-400",
  pending: "bg-yellow-500",
  validated_approved: "bg-green-500",
  validated_rejected: "bg-red-500",
};

const gradingColors = {
  "sangat tinggi": "bg-red-600 text-white", // merah
  tinggi: "bg-orange-500 text-white", // orange
  sedang: "bg-yellow-400 text-black", // kuning
  rendah: "bg-blue-500 text-white", // biru
  "sangat rendah": "bg-green-500 text-white", // hijau
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
  .catch((err) => console.error("Failed to fetch data:", err));
    }
  }, [data]);

  const [showFishbone, setShowFishbone] = useState(false);
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

  // Translate Indonesian grading labels to English for display only
  const translateGrading = (grading) => {
    if (!grading) return "-";
    const map = {
      "sangat tinggi": "Very High",
      "tinggi": "High",
      "sedang": "Medium",
      "rendah": "Low",
      "sangat rendah": "Very Low",
    };
    const key = String(grading).toLowerCase();
    return map[key] || grading;
  };

  function formatDate(dateStr) {
    if (!dateStr) return "-";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
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
    <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-3xl p-6 mx-auto mt-3">
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
      </button>

      <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
        Risk Analysis Details
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 mb-8">
        <DetailItem label="Cluster" value={risk.cluster} />
        <DetailItem label="Unit" value={risk.unit} />
        <DetailItem label="Risk Name" value={risk.name} />
        <DetailItem label="Category" value={risk.category} />
        <DetailItem
          label="Description"
          value={risk.description || "-"}
          spanFull
        />
        <div className="md:col-span-2">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-gray-800">Causes</h3>
            <button
              onClick={() => setShowFishbone(true)}
              className="text-sm px-3 py-1 rounded-lg bg-blue-600 text-white hover:bg-blue-700 hover:cursor-pointer"
            >
              View Tree Diagram
            </button>
          </div>

          {risk.causes && risk.causes.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {risk.causes.map((cause) => (
                <div
                  key={cause.id}
                  className="p-6 bg-gray-50 rounded-xl border border-gray-200 text-gray-800"
                >
                  <div className="mb-3">
                    <strong className="text-[16px] font-semibold">
                      Category:
                    </strong>{" "}
                    <span className="capitalize text-[15px]">
                      {cause.category}
                    </span>
                  </div>
                  <div className="mb-3">
                    <strong className="text-[16px] font-semibold">
                      Main Cause:
                    </strong>{" "}
                    <span className="capitalize text-[15px]">
                      {cause.main_cause}
                    </span>
                  </div>
                  {cause.sub_causes && cause.sub_causes.length > 0 && (
                    <div className="ml-4 mt-4 text-[15px] text-gray-700 font-medium">
                      <strong className="block mb-1">Sub Causes:</strong>
                      <ul className="list-disc list-inside space-y-1">
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
            <p className="text-gray-500">No causes recorded.</p>
          )}
        </div>

        <DetailItem label="Impact" value={risk.impact || "-"} spanFull />
        <DetailItem label="UC/C" value={uc_c_display} />
        <DetailItem label="Severity" value={riskAnalysis.severity ?? "-"} />
        <DetailItem
          label="Probability"
          value={riskAnalysis.probability ?? "-"}
        />
        <DetailItem label="Score" value={riskAnalysis.score ?? "-"} />
        <DetailItem label="Created By" value={creatorName} />
        <DetailItem
          label="Created At"
          value={formatDate(risk.created_at)}
        />
        <DetailItem
          label="Updated At"
          value={formatDate(risk.updated_at)}
        />
        <DetailItem
          label="Grading"
          custom={
            <span
              className={`capitalize text-[12px] font-medium px-2 py-2 flex justify-center items-center rounded-md border ${gradingColorClass}`}
            >
              {translateGrading(riskAnalysis.grading)}
            </span>
          }
        />
        <DetailItem
          label="Risk Status"
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
        Close Details
      </button>

      <FishboneModal
        isOpen={showFishbone}
        onClose={() => setShowFishbone(false)}
      >
        <FishboneChart causes={risk.causes || []} riskName={risk.name} />
      </FishboneModal>
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
