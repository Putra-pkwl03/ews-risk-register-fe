"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LabelList,
  Cell,
} from "recharts";
import { fetchRiskHandlingspublic } from "../../lib/pnrisiko";
import { ChartBarSquareIcon } from "@heroicons/react/24/outline";

const barColors = {
  Effective: "#16A34A",
  "Less Effective": "#FACC15",
  Ineffective: "#DC2626",
};

export default function RiskHandlingEvaluationChart() {
  const [barChartData, setBarChartData] = useState([]);
  const [totalRisks, setTotalRisks] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRiskHandlingspublic()
      .then((res) => {
        const data = res.data || [];

        let efektif = 0;
        let kurangEfektif = 0;
        let tidakEfektif = 0;

        data.forEach((item) => {
          const effectiveness = item.effectiveness;
          if (effectiveness === "E") efektif++;
          else if (effectiveness === "KE") kurangEfektif++;
          else if (effectiveness === "TE") tidakEfektif++;
        });

        const hasilBarChart = [
          { name: "Effective", value: efektif },
          { name: "Less Effective", value: kurangEfektif },
          { name: "Ineffective", value: tidakEfektif },
        ];

        setTotalRisks(data.length);
        setBarChartData(hasilBarChart);
      })
      .catch((err) => {
        console.error("Failed to fetch evaluation data:", err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={`w-full ${loading ? "animate-pulse" : ""}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <ChartBarSquareIcon className="w-5 h-5 text-indigo-500" />
        <h2 className="text-[16px] font-semibold text-gray-700">
          Risk Handling Evaluation
        </h2>
      </div>

      <div className="bg-white shadow rounded-xl transition-all duration-300 ease-in-out hover:shadow-md hover:scale-[1.02] hover:-translate-y-1 p-5 w-full max-w-2xl mx-auto">
        <span className="text-sm text-gray-500">
          Total Ditangani:{" "}
          <strong className="text-gray-700">
            {loading ? "..." : totalRisks}
          </strong>
        </span>

        {/* Chart */}
        <div className="mt-2 h-[180px]">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-sm text-gray-500">Loading evaluation chart...</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={barChartData}
                barSize={16}
                barCategoryGap={2}
              >
                <XAxis
                  type="number"
                  allowDecimals={false}
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fontFamily: "Poppins, sans-serif",
                    fill: "#4B5563",
                  }}
                />

                <YAxis
                  dataKey="name"
                  type="category"
                  axisLine={false}
                  tickLine={false}
                  tick={{
                    fontSize: 12,
                    fontFamily: "Poppins, sans-serif",
                    fill: "#4B5563",
                  }}
                />

                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Bar dataKey="value" radius={[6, 6, 6, 6]}>
                  {barChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={barColors[entry.name]} />
                  ))}
                  <LabelList
                    dataKey="value"
                    position="right"
                    fill="#374151"
                    fontSize={12}
                  />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
