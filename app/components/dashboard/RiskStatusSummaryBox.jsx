"use client";

import { useEffect, useState } from "react";
import { BookmarkSquareIcon, EyeIcon } from "@heroicons/react/24/outline";
import { getAllRiskAnalysisWithoutLimit } from "../../lib/RiskAnalysis";

export default function RiskStatusSummaryBox() {
  const [pendingCount, setPendingCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [totalLast6Months, setTotalLast6Months] = useState(0);
  const [loading, setLoading] = useState(true);
  const [pendingRisks, setPendingRisks] = useState([]);
  const [rejectedRisks, setRejectedRisks] = useState([]);
  const [draftCount, setDraftCount] = useState(0);
  const [draftRisks, setDraftRisks] = useState([]);
  const [showModal, setShowModal] = useState(false);



  useEffect(() => {
    getAllRiskAnalysisWithoutLimit()
      .then((res) => {
        const allData = res || [];
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const filtered = allData.filter((item) => {
          const createdAt = new Date(item.created_at);
          return createdAt >= sixMonthsAgo;
        });

        const filteredPending = filtered.filter(
          (item) => item.risk?.status === "pending"
        );
        const filteredApproved = filtered.filter(
          (item) => item.risk?.status === "validated_approved"
        );
        const filteredRejected = filtered.filter(
          (item) => item.risk?.status === "validated_rejected"
        );
        const filteredDraft = filtered.filter(
          (item) => item.risk?.status === "draft"
        );


        setDraftCount(filteredDraft.length);
        setDraftRisks(filteredDraft.map((item) => item.risk));

        setTotalLast6Months(filtered.length);
        setPendingCount(filteredPending.length);
        setApprovedCount(filteredApproved.length);
        setRejectedCount(filteredRejected.length);

        setPendingRisks(filteredPending.map((item) => item.risk));
        setRejectedRisks(filteredRejected.map((item) => item.risk));
      })
      .catch((err) => {
        console.error("Gagal ambil data status risiko:", err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={`w-full ${loading ? "animate-pulse opacity-70" : ""}`}>
      <h2 className="text-[16px] font-semibold text-gray-700 mb-2 flex items-center gap-2">
        <BookmarkSquareIcon className="w-5 h-5 text-yellow-500" />
        Risk Status in the Last 6 Months
      </h2>

      <div className="bg-white shadow rounded-xl transition-all duration-300 ease-in-out hover:shadow-md hover:scale-[1.02] hover:-translate-y-1 p-4 w-full font-semibold min-h-[222px]">
        <div className="mb-4 font-semibold">
          {/* Total Risiko */}
          <StatusCard
            title="Total Risks"
            value={totalLast6Months}
            color="bg-blue-100"
            textColor="text-black"
            horizontal={true}
            large
            loading={loading}
          />
        </div>

        {/* Status lainnya */}
        <div className="grid grid-cols-2 gap-2">
          <StatusCard
            title="Pending"
            value={pendingCount}
            color="bg-yellow-100"
            textColor="text-yellow-600"
          />
          <StatusCard
            title="Approved"
            value={approvedCount}
            color="bg-green-100"
            textColor="text-green-600"
          />
          <StatusCard
            title="Rejected"
            value={rejectedCount}
            color="bg-red-100"
            textColor="text-red-600"
          />
          <StatusCard
            title="Draft"
            value={draftCount}
            color="bg-gray-100"
            textColor="text-gray-600"
          />
        </div>
        <div className="flex justify-end mt-3 mb-0">
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1 px-1 py-1 bg-slate-500 cursor-pointer text-white text-xs rounded-full hover:bg-indigo-700 transition"
          >
            <EyeIcon className="w-4 h-4" />
          </button>
        </div>
      </div>
      <RiskListModal
        show={showModal}
        onClose={() => setShowModal(false)}
        pending={pendingRisks}
        rejected={rejectedRisks}
        draft={draftRisks}
      />
    </div>
  );
}
function StatusCard({
  title,
  value,
  color,
  textColor,
  horizontal = false,
  large = false,
}) {
  const isHorizontal = horizontal || large;

  return (
    <div
      className={`rounded-xl shadow transition-all duration-200 hover:shadow-md
        ${color} ${
        isHorizontal
          ? "flex items-center justify-between px-2 py-1"
          : "px-2 py-1 text-center"
      }`}
    >
      <p
        className={`text-sm font-medium text-gray-600 ${
          isHorizontal ? "mb-0" : ""
        }`}
      >
        {title}
      </p>
      <p
        className={`font-bold ${textColor} ${
          isHorizontal ? "text-md" : "text-sm"
        }`}
      >
        {value}
      </p>
    </div>
  );
}



function RiskListModal({ show, onClose, pending, rejected, draft }) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center text-gray-900 justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-lg w-full p-6 relative overflow-y-auto max-h-[90vh]">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
        >
          X
        </button>
        <h2 className="text-lg font-bold mb-4 text-gray-800">
          Risk Details for the Last 6 Months
        </h2>

        {/* Pending */}
        {pending.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-yellow-600 mb-1">
              Pending Risks
            </h3>
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
              {pending.map((risk) => (
                <li key={`pending-${risk.id}`}>
                  <strong>{risk.name}</strong> - {risk.cluster} / {risk.unit}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Rejected */}
        {rejected.length > 0 && (
          <div className="mb-4">
            <h3 className="text-sm font-semibold text-red-600 mb-1">
              Rejected Risks
            </h3>
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
              {rejected.map((risk) => (
                <li key={`rejected-${risk.id}`}>
                  <strong>{risk.name}</strong> - {risk.cluster} / {risk.unit}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Draft */}
        {draft.length > 0 && (
          <div className="mb-2">
            <h3 className="text-sm font-semibold text-gray-600 mb-1">
              Draft Risks
            </h3>
            <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
              {draft.map((risk) => (
                <li key={`draft-${risk.id}`}>
                  <strong>{risk.name}</strong> - {risk.cluster} / {risk.unit}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Fallback */}
        {pending.length === 0 &&
          rejected.length === 0 &&
          draft.length === 0 && (
            <p className="text-sm text-gray-600">
              No risk data available for the last 6 months.
            </p>
          )}
      </div>
    </div>
  );
}
