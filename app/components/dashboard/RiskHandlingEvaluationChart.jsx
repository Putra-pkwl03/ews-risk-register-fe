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
  Efektif: "#16A34A", // green-600
  "Kurang Efektif": "#FACC15", // yellow-400
  "Tidak Efektif": "#DC2626", // red-600
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
          { name: "Efektif", value: efektif },
          { name: "Kurang Efektif", value: kurangEfektif },
          { name: "Tidak Efektif", value: tidakEfektif },
        ];

        setTotalRisks(data.length);
        setBarChartData(hasilBarChart);
      })
      .catch((err) => {
        console.error("Gagal ambil data evaluasi:", err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <p className="text-gray-500 text-sm animate-pulse">
        Memuat grafik evaluasi...
      </p>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-5 w-full max-w-2xl mx-auto transition-all">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ChartBarSquareIcon className="w-5 h-5 text-indigo-500" />
          <h2 className="text-base font-semibold text-gray-700">
            Evaluasi Penanganan Risiko
          </h2>
        </div>
        <span className="text-sm text-gray-500">
          Total Ditangani:{" "}
          <strong className="text-gray-700">{totalRisks}</strong>
        </span>
      </div>

      {/* Chart */}
      <ResponsiveContainer width="100%" height={180}>
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
    </div>
  );
}
