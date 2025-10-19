"use client";

import { useEffect, useState } from "react";
import {
  CalculatorIcon,
  MagnifyingGlassPlusIcon,
  ChevronDoubleRightIcon,
  BookmarkIcon,
} from "@heroicons/react/24/outline";
import { getAllRiskAnalysisWithoutLimit } from "../../lib/RiskAnalysis";

export default function RiskSummaryBox() {
  const [totalRisiko, setTotalRisiko] = useState(0);
  const [totalUnit, setTotalUnit] = useState(0);
  const [totalCluster, setTotalCluster] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllRiskAnalysisWithoutLimit()
      .then((res) => {
        const allData = res || [];

        setTotalRisiko(allData.length);

        const filteredByUnit = new Set(
          allData
            .map((item) => item.risk?.unit)
            .filter((unit) => unit && unit.trim() !== "")
        );

        const filteredByCluster = new Set(
          allData
            .map((item) => item.risk?.cluster)
            .filter((cluster) => cluster && cluster.trim() !== "")
        );

        setTotalUnit(filteredByUnit.size);
        setTotalCluster(filteredByCluster.size);
      })
      .catch((err) => {
        console.error("Failed to fetch risk summary:", err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={`w-full ${loading ? "animate-pulse" : ""}`}>
      <h2 className="text-[16px] font-semibold text-gray-700 mb-2 flex items-center gap-2">
        <BookmarkIcon className="w-5 h-5 text-pink-500" />
        Risk Summary
      </h2>

      <div className="bg-[#5e7de4] to-slate-300  shadow rounded-xl transition-all duration-300 ease-in-out hover:shadow-md hover:scale-[1.02] hover:-translate-y-1 p-4 w-full min-h-[220px]">
        <div className="flex flex-col gap-3">
          <SummaryCard
            title="Total Risks"
            value={totalRisiko}
            icon={<CalculatorIcon className="h-5 w-5 text-blue-500" />}
            loading={loading}
          />
          <SummaryCard
            title="Total Units"
            value={totalUnit}
            icon={
              <MagnifyingGlassPlusIcon className="h-5 w-5 text-green-500" />
            }
            loading={loading}
          />
          <SummaryCard
            title="Total Clusters"
            value={totalCluster}
            icon={
              <ChevronDoubleRightIcon className="h-5 w-5 text-purple-500" />
            }
            loading={loading}
          />
        </div>

        <p className="text-xs text-white mt-4">
          * Units and clusters are counted only if they have associated risks.
        </p>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, icon, loading }) {
  return (
    <div className="bg-gray-50 p-2 rounded-xl shadow flex items-center gap-4 hover:shadow-md transition-all duration-200">
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex justify-between items-center w-full">
        <p className="text-sm text-gray-500">{loading ? "..." : title}</p>
        <p className="text-md font-bold text-gray-800">
          {loading ? "..." : value}
        </p>
      </div>
    </div>
  );
}
