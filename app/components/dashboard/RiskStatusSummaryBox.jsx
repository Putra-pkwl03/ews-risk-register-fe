"use client";

import { useEffect, useState } from "react";
import {
  BookmarkSquareIcon,
} from "@heroicons/react/24/outline";
import { getAllRiskAnalysisWithoutLimit } from "../../lib/RiskAnalysis";

export default function RiskStatusSummaryBox() {
  const [pendingCount, setPendingCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [rejectedCount, setRejectedCount] = useState(0);
  const [totalLast6Months, setTotalLast6Months] = useState(0);
  const [loading, setLoading] = useState(true);

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

        setTotalLast6Months(filtered.length);
        setPendingCount(
          filtered.filter((item) => item.risk?.status === "pending").length
        );
        setApprovedCount(
          filtered.filter((item) => item.risk?.status === "validated_approved")
            .length
        );
        setRejectedCount(
          filtered.filter((item) => item.risk?.status === "validated_rejected")
            .length
        );
      })
      .catch((err) => {
        console.error("Gagal ambil data status risiko:", err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <p className="text-gray-500 text-sm animate-pulse">
        Memuat status risiko...
      </p>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-4 w-full">
      <h2 className="text-md font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <BookmarkSquareIcon className="w-5 h-5 text-yellow-500" />
        Status Risiko 6 Bulan Terakhir
      </h2>

      <div className="grid grid-cols-2 gap-2">
        <StatusCard
          title="Total Risiko"
          value={totalLast6Months}
          color="bg-blue-100"
          textColor="text-black"
        />
        <StatusCard
          title="Pending"
          value={pendingCount}
          color="bg-yellow-100"
          textColor="text-yellow-600"
        />
        <StatusCard
          title="Disetujui"
          value={approvedCount}
          color="bg-green-100"
          textColor="text-green-600"
        />
        <StatusCard
          title="Ditolak"
          value={rejectedCount}
          color="bg-red-100"
          textColor="text-red-600"
        />
      </div>
    </div>
  );
}

function StatusCard({ title, value, color, textColor }) {
  return (
    <div className={`rounded-xl p-1 ${color} hover:shadow-md  text-center transition-all`}>
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <p className={`text-md font-bold ${textColor}`}>{value}</p>
    </div>
  );
}
