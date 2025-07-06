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
} from "recharts";
import { fetchRiskHandlingspublic } from "../../lib/pnrisiko";

export default function RiskHandlingEvaluationChart() {
  const [barChartData, setBarChartData] = useState(null);
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
    return <p className="text-gray-500 text-sm">Memuat grafik evaluasi...</p>;
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white p-4 rounded-xl shadow">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-bold">
          Evaluasi Penanganan Risiko (Efektivitas)
        </h2>
        <span className="text-sm text-gray-600">
          Total Risiko Ditangani: <strong>{totalRisks}</strong>
        </span>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart layout="vertical" data={barChartData}>
          <XAxis type="number" allowDecimals={false} />
          <YAxis dataKey="name" type="category" />
          <Tooltip />
          <Legend />
          <Bar dataKey="value" fill="#0088FE" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
