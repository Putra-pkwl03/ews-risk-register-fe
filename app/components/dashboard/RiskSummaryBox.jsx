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
        console.error("Gagal ambil data ringkasan risiko:", err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <p className="text-gray-500 text-sm animate-pulse">
        Memuat ringkasan risiko...
      </p>
    );
  }

  return (
    <div className="bg-gradient-to-r from-[#5932EA] to-gray-100 rounded-2xl shadow-sm p-4 w-full">
      <h2 className="text-md font-bold text-white mb-4 flex items-center gap-2">
        <BookmarkIcon className="w-5 h-5 text-pink-500" />
        Ringkasan Risiko
      </h2>
      <div className="flex flex-col gap-3">
        <SummaryCard
          title="Total Risiko"
          value={totalRisiko}
          icon={<CalculatorIcon className="h-5 w-5 text-blue-500" />}
        />
        <SummaryCard
          title="Total Unit"
          value={totalUnit}
          icon={<MagnifyingGlassPlusIcon className="h-5 w-5 text-green-500" />}
        />
        <SummaryCard
          title="Total Klaster"
          value={totalCluster}
          icon={<ChevronDoubleRightIcon className="h-5 w-5 text-purple-500" />}
        />
      </div>

      <p className="text-xs text-white mt-4">
        * Unit & klaster hanya dihitung jika memiliki risiko terkait.
      </p>
    </div>
  );
}

function SummaryCard({ title, value, icon }) {
  return (
    <div className="bg-gray-50 p-2 rounded-xl shadow flex items-center gap-4 hover:shadow-md transition-all duration-200">
      <div className="flex-shrink-0">{icon}</div>
      <div className="flex justify-between items-center w-full">
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-md font-bold text-gray-800">{value}</p>
      </div>
    </div>
  );
}
        
