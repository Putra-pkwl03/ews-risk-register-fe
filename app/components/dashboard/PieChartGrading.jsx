"use client";

import { useEffect, useState } from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { getAllRiskAnalysisWithoutLimit } from "../../lib/RiskAnalysis";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";

// Warna sesuai grading
const gradingColors = {
  "sangat tinggi": "#991B1B", 
  "tinggi": "#EF4444",        
  "sedang": "#FACC15",       
  "rendah": "#15803D",       
  "sangat rendah": "#4ADE80", 
  "tidak diketahui": "#9CA3AF" 
};

export default function PieChartGrading() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllRiskAnalysisWithoutLimit()
      .then((res) => {
        const counts = res.reduce((acc, curr) => {
          const grade = curr.grading?.toLowerCase() || "tidak diketahui";
          acc[grade] = (acc[grade] || 0) + 1;
          return acc;
        }, {});

        const chartData = Object.keys(counts).map((key) => ({
          name: key,
          value: counts[key],
        }));

        setData(chartData);
      })
      .catch((err) => {
        console.error("Gagal ambil data grading:", err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-gray-500 text-sm animate-pulse">Memuat chart grading...</p>;
  }

  return (
    <div className="bg-white rounded-xl shadow-md p-4 w-full h-[320px] transition-all">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <ExclamationTriangleIcon className="w-5 h-5 text-red-600" />
        <h2 className="text-base font-semibold text-gray-700">
          Distribusi Grading Risiko
        </h2>
      </div>

      {/* Pie Chart */}
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            labelLine={false}
            data={data}
            cx="50%"
            cy="50%"
            outerRadius={80}
            dataKey="value"
            label={({ percent }) => `(${(percent * 100).toFixed(0)}%)`}
          >
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={gradingColors[entry.name.toLowerCase()] || "#D1D5DB"}
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: 10,
              borderColor: "#E2E8F0",
              fontSize: 12,
            }}
            labelStyle={{ fontWeight: "500", color: "#374151" }}
          />
          <Legend
            wrapperStyle={{ fontSize: 12 }}
            verticalAlign="bottom"
            height={36}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
