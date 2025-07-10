"use client";

import { useEffect, useState } from "react";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { getAllRiskAnalysisWithoutLimit } from "../../lib/RiskAnalysis";
import { ChartPieIcon } from "@heroicons/react/24/outline";

const gradingColors = {
  "sangat tinggi": "#991B1B",
  tinggi: "#EF4444",
  sedang: "#FACC15",
  rendah: "#15803D",
  "sangat rendah": "#4ADE80",
  "tidak diketahui": "#9CA3AF",
};

export default function PieChartGrading() {
  const [data, setData] = useState([]);
  const [activeIndexes, setActiveIndexes] = useState([]);
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

        const randomIndexes = chartData.map((_, i) => Math.random() > 0.5);
        setActiveIndexes(randomIndexes);
      })
      .catch((err) => {
        console.error("Gagal ambil data grading:", err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={`w-full ${loading ? "animate-pulse" : ""}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <ChartPieIcon className="w-5 h-5 text-red-600" />
        <h2 className="text-[16px] font-semibold text-gray-700">
          Distribusi Grading Risiko
        </h2>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 w-full h-[320px] transition-all flex flex-col">
        {/* Chart Container */}
        <div className="flex-1">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-sm text-gray-500">Memuat chart grading...</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <defs>
                  <filter
                    id="shadow"
                    x="-20%"
                    y="-20%"
                    width="140%"
                    height="140%"
                  >
                    <feDropShadow
                      dx="2"
                      dy="4"
                      stdDeviation="4"
                      floodColor="#888"
                    />
                  </filter>
                </defs>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  paddingAngle={3}
                  outerRadius={80}
                  dataKey="value"
                  labelLine={false}
                  filter="url(#shadow)"
                  label={({
                    cx,
                    cy,
                    midAngle,
                    innerRadius,
                    outerRadius,
                    percent,
                  }) => {
                    const RADIAN = Math.PI / 180;
                    const radius =
                      innerRadius + (outerRadius - innerRadius) * 0.5;
                    const x = cx + radius * Math.cos(-midAngle * RADIAN);
                    const y = cy + radius * Math.sin(-midAngle * RADIAN);
                    return (
                      <text
                        x={x}
                        y={y}
                        fill="white"
                        textAnchor="middle"
                        dominantBaseline="central"
                        fontSize={12}
                      >
                        {(percent * 100).toFixed(0)}%
                      </text>
                    );
                  }}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        gradingColors[entry.name.toLowerCase()] || "#D1D5DB"
                      }
                      stroke="#fff"
                      strokeWidth={2}
                      isActive={activeIndexes[index]}
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
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Legend */}
        <div className="overflow-y-auto max-h-[72px] mt-2">
          {loading ? (
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-400">
              <div className="h-4 bg-gray-200 rounded col-span-1"></div>
              <div className="h-4 bg-gray-200 rounded col-span-1"></div>
              <div className="h-4 bg-gray-200 rounded col-span-1"></div>
              <div className="h-4 bg-gray-200 rounded col-span-1"></div>
            </div>
          ) : (
            <ul className="text-xs text-gray-600 grid grid-cols-2">
              {data.map((entry, i) => (
                <li key={i} className="flex items-center gap-2">
                  <span
                    className="w-3 h-3 rounded-full inline-block"
                    style={{
                      backgroundColor:
                        gradingColors[entry.name.toLowerCase()] || "#D1D5DB",
                    }}
                  ></span>
                  <span className="capitalize">{entry.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
