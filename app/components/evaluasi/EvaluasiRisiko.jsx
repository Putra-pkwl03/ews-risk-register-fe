"use client";

import { useEffect, useState } from "react";
import { getValidatedRisks } from "../../lib/RiskAnalysis";
import { getAllRiskMitigations } from "../../lib/RiskMitigations";
import { useRouter } from "next/navigation";

export default function EvaluasiRisiko() {
  const [risks, setRisks] = useState([]);
  const [mitigations, setMitigations] = useState([]);
  const router = useRouter();

  const fetchData = async () => {
    try {
      const risksData = await getValidatedRisks();
      const mitigationsData = await getAllRiskMitigations();
      setRisks(risksData);
      setMitigations(mitigationsData);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Cari mitigasi berdasarkan risk_id
  const findMitigationByRiskId = (riskId) => {
    return mitigations.filter((m) => m.risk_id === riskId);
  };

  // Fungsi ambil 2-3 kata pertama dari deskripsi lalu tambahkan "..."
  const shortDesc = (text) => {
    if (!text) return "-";
    const words = text.split(" ");
    return words.length > 2 ? words.slice(0, 3).join(" ") + "..." : text;
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Evaluasi Risiko</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200 text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-4 py-2">Cluster</th>
              <th className="border px-4 py-2">Unit</th>
              <th className="border px-4 py-2">Nama Risiko</th>
              <th className="border px-4 py-2">Mitigasi</th>
              <th className="border px-4 py-2">Controllability</th>
              <th className="border px-4 py-2">Scoring</th>
              <th className="border px-4 py-2">Decision</th>
              <th className="border px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {risks.map((risk) => {
              const mitigationsForRisk = findMitigationByRiskId(risk.id);
              return (
                <tr key={risk.id}>
                  <td className="border px-4 py-2">{risk.cluster}</td>
                  <td className="border px-4 py-2">{risk.unit}</td>
                  <td className="border px-4 py-2">{risk.name}</td>
                  <td className="border px-4 py-2">
                    {mitigationsForRisk.length > 0
                      ? mitigationsForRisk.map((m) => (
                          <div key={m.id} className="mb-2">
                            <strong>{m.mitigation_type}</strong> <br />
                            {m.descriptions.length > 0
                              ? shortDesc(m.descriptions[0].description)
                              : "-"}
                          </div>
                        ))
                      : "-"}
                  </td>
                  <td className="border px-4 py-2">
                    {risk.risk_appetite?.controllability ?? "-"}
                  </td>
                  <td className="border px-4 py-2">
                    {risk.risk_appetite?.scoring ?? "-"}
                  </td>
                  <td className="border px-4 py-2 capitalize">
                    {risk.risk_appetite?.decision ?? "-"}
                  </td>
                  <td className="border px-4 py-2">
                    <button
                      className="px-3 py-1 text-sm border rounded hover:bg-gray-100"
                      onClick={() =>
                        router.push(
                          `/dashboard?page=evaluasi-risiko/${risk.id}/detail`
                        )
                      }
                    >
                      Detail
                    </button>
                    <button
                      className="px-3 py-1 text-sm border rounded hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                      disabled={
                        !risk.risk_appetite?.controllability ||
                        risk.risk_appetite?.decision === "accepted"
                      }
                      onClick={() =>
                        router.push(
                          mitigationsForRisk.length > 0
                            ? `/dashboard?page=evaluasi-risiko/${risk.id}/edit-mitigations/${mitigationsForRisk[0].id}`
                            : `/dashboard?page=evaluasi-risiko/${risk.id}/add-mitigations`
                        )
                      }
                    >
                      {mitigationsForRisk.length > 0
                        ? "Edit Mitigation"
                        : "Add Mitigation"}
                    </button>
                  </td>
                </tr>
              );
            })}
            {risks.length === 0 && (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  Tidak ada data risiko tervalidasi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
