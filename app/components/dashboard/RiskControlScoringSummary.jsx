"use client";

import { useEffect, useState } from "react";
import { BookmarkSlashIcon } from "@heroicons/react/24/outline";
import { fetchRiskAppetites } from "../../lib/pnrisiko";

export default function RiskControlScoringSummary() {
  const [summary, setSummary] = useState({
    total: 0,
    highestControl: 0,
    lowestControl: 0,
    highestControlCount: 0,
    lowestControlCount: 0,
    mitigated: 0,
    accepted: 0,
    highestScoring: 0,
    top3Ranking: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRiskAppetites()
      .then((res) => {
        const data = res.data;

        const controllabilityEmpat = data.filter(
          (item) => item.controllability === 4
        );
        const controllabilitySatu = data.filter(
          (item) => item.controllability === 1
        );
        const accepted = data.filter((item) => item.decision === "accepted");
        const mitigated = data.filter((item) => item.decision === "mitigated");
        const maxScoring = Math.max(...data.map((item) => item.scoring || 0));
        const top3 = data.sort((a, b) => a.ranking - b.ranking).slice(0, 3);

        setSummary({
          total: data.length,
          highestControl: 4,
          lowestControl: 1,
          highestControlCount: controllabilityEmpat.length,
          lowestControlCount: controllabilitySatu.length,
          mitigated: mitigated.length,
          accepted: accepted.length,
          highestScoring: maxScoring,
          top3Ranking: top3.length,
        });
      })
      .catch((err) => {
        console.error("Gagal ambil data risk appetite:", err);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={`w-full ${loading ? "animate-pulse" : ""}`}>
      <h2 className="text-[16px] font-semibold text-gray-700 mb-2 flex items-center gap-2">
        <BookmarkSlashIcon className="w-5 h-5 text-green-800" />
        Ringkasan Kontrol & Skor
      </h2>

      <div className="bg-white rounded-2xl  p-4 w-full font-semibold min-h-[220px]">
        <div className="mb-4 font-semibold">
          <MiniCard
            title="Total Risiko"
            value={summary.total}
            color="bg-blue-100"
            text="text-black"
            large
            loading={loading}
          />
        </div>

        <div className="grid grid-cols-2 gap-2 py-2">
          <MiniCard
            title={`C Tertinggi (C=${summary.highestControl})`}
            value={summary.highestControlCount}
            color="bg-green-100"
            text="text-green-600"
            horizontal
            loading={loading}
          />
          <MiniCard
            title={`C Terendah (C=${summary.lowestControl})`}
            value={summary.lowestControlCount}
            color="bg-red-100"
            text="text-red-600"
            horizontal
            loading={loading}
          />
          <MiniCard
            title="Mitigated"
            value={summary.mitigated}
            color="bg-teal-100"
            text="text-teal-600"
            horizontal
            loading={loading}
          />
          <MiniCard
            title="Accepted"
            value={summary.accepted}
            color="bg-indigo-100"
            text="text-indigo-600"
            horizontal
            loading={loading}
          />
          <MiniCard
            title="Skoring Tertinggi"
            value={summary.highestScoring}
            color="bg-orange-100"
            text="text-orange-600"
            horizontal
            loading={loading}
          />
          <MiniCard
            title="Top 3 Ranking"
            value={summary.top3Ranking}
            color="bg-yellow-100"
            text="text-yellow-600"
            horizontal
            loading={loading}
          />
        </div>
      </div>
    </div>
  );
}

function MiniCard({
  title,
  value,
  color,
  text,
  large = false,
  horizontal = false,
  loading = false,
}) {
  const isHorizontal = large || horizontal;

  return (
    <div
      className={`rounded-xl ${color} hover:shadow transition-all ${
        isHorizontal
          ? " px-2 py-1 flex items-center justify-between"
          : "px-2 py-1 text-center"
      }`}
    >
      <p
        className={`font-medium text-sm text-gray-700 ${
          isHorizontal ? "mb-0" : "mb-1"
        }`}
      >
        {loading ? "..." : title}
      </p>
      <p
        className={`font-bold ${text} ${isHorizontal ? "text-md" : "text-sm"}`}
      >
        {loading ? "..." : value}
      </p>
    </div>
  );
}
