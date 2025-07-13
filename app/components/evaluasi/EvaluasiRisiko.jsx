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

// INFO START
  const today = new Date();
  const mitigasiTindakLanjut = [];
  useEffect(() => {
    if (mitigations.length > 0) {
      // console.log("Mitigations:", mitigations);
      // console.log("Risks:", risks);
    }
  }, [mitigations, risks]);

  const [showInfoDeadline, setShowInfoDeadline] = useState(false);

 const getDeadlineStatus = () => {
   const hasil = [];

   mitigations.forEach((m) => {
     if (!m.deadline || !m.risk_id) return;

     const deadline = new Date(m.deadline);
     const diffTime = deadline - today;
     const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

     if (diffDays < 0) return;
     if (diffDays <= 7) {
       const relatedRisk = risks.find((r) => r.id === m.risk_id);
       if (relatedRisk && relatedRisk.name) {
         hasil.push({
           riskName: relatedRisk.name,
           deadline: m.deadline,
           warna: diffDays <= 3 ? "red" : "blue",
         });
       }
     }
   });

   return hasil;
 };

 const dataDeadline = getDeadlineStatus();
// INFO END
  

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Evaluasi Risiko</h1>

      {/* INFO START */}
      <div className="mb-6">
        <button
          onClick={() => setShowInfoDeadline(!showInfoDeadline)}
          className="text-md font-medium mb-4 text-red-700 flex items-center gap-2 focus:outline-none hover:underline cursor-pointer"
        >
          <span className="relative flex h-5 w-5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500">
              <svg
                className="text-white w-3.5 h-3.5 m-auto"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 2a6 6 0 00-6 6v2a3 3 0 01-.879 2.121L2 14h16l-1.121-1.879A3 3 0 0116 10V8a6 6 0 00-6-6zm0 16a2 2 0 002-2H8a2 2 0 002 2z" />
              </svg>
            </span>
          </span>
          {dataDeadline.length} mitigasi perlu tindak lanjut segera
        </button>

        {showInfoDeadline && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div className="space-y-3">
              {dataDeadline
                .filter((item) => item.warna === "red")
                .map((item, idx) => (
                  <div
                    key={`red-${idx}`}
                    className="flex items-center justify-between bg-white border-l-4 border-red-500/60 rounded-lg px-5 py-3 hover:shadow-md transition"
                  >
                    <div>
                      <div className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                        <svg
                          className="w-4 h-4 text-red-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9 2a7 7 0 100 14A7 7 0 009 2zm0 12a5 5 0 110-10 5 5 0 010 10zm-.25-8a.75.75 0 011.5 0v3.25a.75.75 0 01-1.5 0V6zm.25 6a.75.75 0 100 1.5.75.75 0 000-1.5z" />
                        </svg>
                        {item.riskName}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Deadline:{" "}
                        <span className="font-semibold text-red-600">
                          {item.deadline}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-red-100 text-red-700">
                      Tindak Lanjut Segera
                    </span>
                  </div>
                ))}
            </div>

            <div className="space-y-3">
              {dataDeadline
                .filter((item) => item.warna === "blue")
                .map((item, idx) => (
                  <div
                    key={`blue-${idx}`}
                    className="flex items-center justify-between bg-white border-l-4 border-blue-500/60 rounded-lg px-5 py-3 hover:shadow-md transition"
                  >
                    <div>
                      <div className="text-sm font-semibold text-gray-800 flex items-center gap-1">
                        <svg
                          className="w-4 h-4 text-blue-500"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9 2a7 7 0 100 14A7 7 0 009 2zm0 12a5 5 0 110-10 5 5 0 010 10zm-.25-8a.75.75 0 011.5 0v3.25a.75.75 0 01-1.5 0V6zm.25 6a.75.75 0 100 1.5.75.75 0 000-1.5z" />
                        </svg>
                        {item.riskName}
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        Deadline:{" "}
                        <span className="font-semibold text-blue-600">
                          {item.deadline}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-blue-100 text-blue-700">
                      Perlu Diperhatikan
                    </span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
      {/* INFO END */}

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
