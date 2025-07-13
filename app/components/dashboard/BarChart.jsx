"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  CartesianGrid,
  Cell,
} from "recharts";
import { getAllRiskAnalysisWithoutLimit } from "../../lib/RiskAnalysis";
import { ChartBarIcon } from "@heroicons/react/24/outline";

export default function VerticalBarChartByCluster() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllRiskAnalysisWithoutLimit()
      .then((res) => {
        const clusterCount = res.reduce((acc, curr) => {
          const cluster = curr.risk?.cluster || "Tidak Diketahui";
          acc[cluster] = (acc[cluster] || 0) + 1;
          return acc;
        }, {});

        const formatted = Object.entries(clusterCount).map(
          ([cluster, count]) => {
            const shortName = cluster.split(" ").slice(0, 2).join(" ");
            return {
              name: shortName,
              fullName: cluster,
              total: count,
            };
          }
        );

        setData(formatted);
      })
      .catch((err) => {
        console.error("Gagal ambil data:", err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  const colors = ["#1E3A8A", "#60A5FA"];

  return (
    <div className={`w-full ${loading ? "animate-pulse" : ""}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <ChartBarIcon className="w-5 h-5 text-blue-600" />
        <h2 className="text-[16px] font-semibold text-gray-700">
          Risiko per Klaster
        </h2>
      </div>

      <div className="bg-white rounded-xl p-4 w-full h-[320px] transition-all">
        {/* Chart Container */}
        {loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <p className="text-sm text-gray-500">Memuat grafik cluster...</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ top: 5, right: 10, left: 0, bottom: 40 }}
              barCategoryGap="2%"
              barGap={2}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
              <XAxis
                dataKey="name"
                angle={0}
                textAnchor="middle"
                interval={0}
                tick={{ fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  borderRadius: 8,
                  borderColor: "#E2E8F0",
                  fontSize: 12,
                }}
                labelFormatter={(value) => {
                  const found = data.find((d) => d.name === value);
                  return found?.fullName || value;
                }}
                labelStyle={{ color: "#374151", fontWeight: "500" }}
              />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar
                dataKey="total"
                name="Total Risiko"
                radius={[10, 10, 10, 10]}
                barSize={14}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
