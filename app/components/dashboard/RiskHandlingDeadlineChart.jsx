"use client";

import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { fetchRiskHandlingspublic } from "../../lib/pnrisiko";
import { ClockIcon } from "@heroicons/react/24/outline";
import dayjs from "dayjs";

export default function RiskHandlingDeadlineChart() {
  const [dataChart, setDataChart] = useState([]);
  const [totalWarning, setTotalWarning] = useState(0);
  const [totalExpired, setTotalExpired] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRiskHandlingspublic()
      .then((res) => {
        const data = res.data || [];
        const today = dayjs();
        let warningCount = 0;
        let expiredCount = 0;

        const parsed = [];

        data.forEach((riskHandling) => {
          riskHandling.risk?.mitigations?.forEach((mitigation) => {
            const deadline = dayjs(mitigation.deadline);
            const diff = deadline.diff(today, "day");

            let status = "normal";
            if (diff < 0) {
              status = "expired";
              expiredCount++;
            } else if (diff <= 3) {
              status = "warning";
              warningCount++;
            }

            let value = 1;
            if (diff <= 3 && diff >= 0) {
              value = 3;
            } else if (diff < 0) {
              value = 0;
            }

            parsed.push({
              date: deadline.format("DD MMM"),
              value,
              risiko: riskHandling.risk?.name,
              deadline: deadline.format("DD MMM YYYY"),
              status,
              diff,
            });
          });
        });

        const sorted = parsed.sort((a, b) =>
          dayjs(a.deadline, "DD MMM YYYY").isAfter(
            dayjs(b.deadline, "DD MMM YYYY")
          )
            ? 1
            : -1
        );

        setDataChart(sorted);
        setTotalWarning(warningCount);
        setTotalExpired(expiredCount);
      })
      .catch((err) => {
        console.error("Failed to fetch mitigation deadlines:", err.message);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className={`w-full ${loading ? "animate-pulse" : ""}`}>
      {/* Header */}
      <div className="flex items-center gap-2 mb-2">
        <ClockIcon className="w-5 h-5 text-rose-500" />
        <h2 className="text-[16px] font-semibold text-gray-700">
          Risk Mitigation Deadlines
        </h2>
      </div>

      <div className="bg-white rounded-xl  p-5 w-full max-w-2xl mx-auto transition-all">
        <div className="text-sm text-right space-y-1">
          <div className="text-gray-500">
            Deadline within 3 days: {" "}
            <strong className="text-rose-600">
              {loading ? "..." : totalWarning}
            </strong>
          </div>
          <div className="text-gray-500">
            Past due: {" "}
            <strong className="text-gray-400">
              {loading ? "..." : totalExpired}
            </strong>
          </div>
        </div>

        <div className="mt-2 h-[160px]">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <p className="text-sm text-gray-500">Loading deadlines chart...</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={dataChart}
                margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" fontSize={12} />
                <YAxis hide domain={[0, 1]} />
                <Tooltip
                  formatter={(_, __, item) => {
                    return [
                      `Deadline: ${item.payload.deadline}`,
                      `Risk: ${item.payload.risiko}`,
                    ];
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#3B82F6"
                  strokeWidth={2}
                  dot={({ cx, cy, payload, index }) => {
                    let color = "#3B82F6";
                    if (payload.status === "warning") color = "#DC2626";
                    if (payload.status === "expired") color = "#9CA3AF";

                    return (
                      <g key={`dot-${index}`}>
                        <circle
                          cx={cx}
                          cy={cy}
                          r={5}
                          fill={color}
                          stroke="#fff"
                          strokeWidth={1}
                        />
                      </g>
                    );
                  }}
                />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
