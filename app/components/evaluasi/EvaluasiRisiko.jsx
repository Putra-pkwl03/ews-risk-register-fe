"use client";

import { useEffect, useState } from "react";
import { getValidatedRisks } from "../../lib/RiskAnalysis";
import { getAllRiskMitigations } from "../../lib/RiskMitigations";
import { useRouter } from "next/navigation";
import { ShieldPlus } from "lucide-react";
import LoadingSkeleton from "../loadings/LoadingSkeleton";
import Pagination from "../manage-users/Pagenations";

export default function EvaluasiRisiko() {
  const [risks, setRisks] = useState([]);
  const [mitigations, setMitigations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const totalItems = risks.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Ambil data yang sesuai halaman
  const currentRisks = risks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const onDetailClick = (risk) => {
    router.push(`/dashboard?page=evaluasi-risiko/${risk.id}/detail`);
  };
  
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const risksData = await getValidatedRisks();
      const mitigationsData = await getAllRiskMitigations();
      setRisks(risksData);
      setMitigations(mitigationsData);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const findMitigationByRiskId = (riskId) => {
    return mitigations.filter((m) => m.risk_id === riskId);
  };

  const shortDesc = (text) => {
    if (!text) return "-";
    const words = text.split(" ");
    return words.length > 2 ? words.slice(0, 3).join(" ") + "..." : text;
  };

  return (
    <div className="bg-white rounded-sm shadow-gray-200 shadow-xl p-4 mb-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4 flex-wrap">
        <h5 className="text-[20px] text-black font-semibold">
          Evaluasi Risiko
        </h5>
      </div>

      {isLoading ? (
        <LoadingSkeleton columns={5} />
      ) : risks.length === 0 ? (
        <p className="text-center text-gray-500">
          Tidak ada data risiko yang sudah divalidasi.
        </p>
      ) : (
        <table className="w-full text-sm sm:text-base">
          <thead className="bg-gray-100 text-[#5932EA] text-left border-b">
            <tr>
              {[
                "Cluster",
                "Unit",
                "Nama Risiko",
                "Mitigasi",
                "Controllability",
                "Scoring",
                "Decision",
                "Aksi",
              ].map((title, i) => (
                <th key={i} className="p-2">
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-[#292D32]">
            {currentRisks.map((risk, idx) => {
              const mitigationsForRisk = findMitigationByRiskId(risk.id);
              return (
                <tr
                  key={risk.id}
                  className={`${
                    idx % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-gray-100 transition-colors`}
                >
                  <td className="p-2">{risk.cluster}</td>
                  <td className="p-2">{risk.unit}</td>
                  <td className="p-2">{risk.name}</td>
                  <td className="p-2">
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
                  <td className="p-2 text-center">
                    {risk.risk_appetite?.controllability ?? "-"}
                  </td>
                  <td className="p-2 text-center">
                    {risk.risk_appetite?.scoring ?? "-"}
                  </td>
                  <td className="p-2 text-center capitalize">
                    {risk.risk_appetite?.decision ?? "-"}
                  </td>
                  <td className="p-2 text-center">
                    <div className="flex justify-center items-center gap-2">
                      {/* Tombol Detail */}
                      <button
                        onClick={() => onDetailClick(risk)}
                        className="p-1 rounded transition"
                        title="Detail"
                      >
                        <img
                          src="/icons/detail.svg"
                          alt="Detail Icon"
                          className="h-5 w-5 min-w-[20px] min-h-[20px] hover:opacity-80 hover:cursor-pointer"
                        />
                      </button>

                      {/* Tombol Add/Edit Mitigation */}
                      <button
                        onClick={() =>
                          router.push(
                            mitigationsForRisk.length > 0
                              ? `/dashboard?page=evaluasi-risiko/${risk.id}/edit-mitigations/${mitigationsForRisk[0].id}`
                              : `/dashboard?page=evaluasi-risiko/${risk.id}/add-mitigations`
                          )
                        }
                        title={
                          mitigationsForRisk.length > 0
                            ? "Edit Mitigation"
                            : "Add Mitigation"
                        }
                        disabled={
                          !risk.risk_appetite?.controllability ||
                          risk.risk_appetite?.decision === "accepted"
                        }
                        className={`p-1 rounded transition ${
                          !risk.risk_appetite?.controllability ||
                          risk.risk_appetite?.decision === "accepted"
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-gray-100 hover:cursor-pointer"
                        }`}
                      >
                        <ShieldPlus
                          className="h-5 w-5 text-blue-600"
                          aria-hidden="true"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
        onPageChange={(page) => setCurrentPage(page)}
      />
    </div>
  );
}
