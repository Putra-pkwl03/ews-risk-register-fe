"use client";
import ModalControlability from "../../components/penangananrisiko/ControllabilityModal";
import { HeartPlus } from "lucide-react";
import Pagination from "../manage-users/Pagenations";

export default function RiskList({
  risks,
  onDetailClick,
  onOpenControlibility,
  selectedRisk,
  modalOpen,
  onCloseModal,
  onDecisionChange,
  isLoading,
  currentPage,
  totalPages,
  setCurrentPage,
  itemsPerPage,
  totalItems,
}) {
  const startIdx = (currentPage - 1) * itemsPerPage;
  const endIdx = startIdx + itemsPerPage;
  const currentRisks = risks.slice(startIdx, endIdx);

  return (
    <div className="bg-white rounded-sm shadow-gray-200 shadow-xl p-4 mb-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4 flex-wrap">
        <h5 className="text-[20px] text-black font-semibold">
          Analisis Risiko
        </h5>
      </div>

      <table className="w-full text-sm sm:text-base">
        <thead className="bg-gray-100 text-[#5932EA] text-left border-b-[1px] border-gray-200">
          <tr>
            {[
              "Cluster",
              "Unit",
              "Nama Risiko",
              "Kategori",
              "Severity",
              "Probability",
              "Score",
              "Grading",
              "Controllability",
              "Scoring",
              "Ranking",
              "Aksi",
            ].map((title, i) => (
              <th
                key={i}
                className={`p-2 text-[14px] sm:p-3 sm:text-bas ${
                  title === "Aksi" ? "text-center" : ""
                }`}
              >
                {title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, rowIndex) => (
              <tr key={rowIndex} className="animate-pulse">
                {Array.from({ length: 12 }).map((_, colIndex) => (
                  <td key={colIndex} className="p-2">
                    <div className="h-4 bg-gray-200 rounded w-full"></div>
                  </td>
                ))}
              </tr>
            ))
          ) : currentRisks.length === 0 ? (
            <tr>
              <td colSpan={12} className="text-center py-6 text-gray-500">
                Tidak ada data risiko yang sudah divalidasi.
              </td>
            </tr>
          ) : (
            currentRisks.map((risk, idx) => (
              <tr
                key={risk.id}
                className={`text-[12px] text-[#292D32] transition-colors border-b border-gray-200 ${
                  idx % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                } hover:bg-gray-100`}
              >
                <td className="p-2">{risk.cluster}</td>
                <td className="p-2">{risk.unit}</td>
                <td className="p-2">{risk.name}</td>
                <td className="p-2">{risk.category}</td>
                <td className="p-2 text-center">
                  {risk.analysis?.severity ?? "-"}
                </td>
                <td className="p-2 text-center">
                  {risk.analysis?.probability ?? "-"}
                </td>
                <td className="p-2 text-center">
                  {risk.analysis?.score ?? "-"}
                </td>
                <td className="p-2 text-center">
                  <span
                    className={`capitalize text-[12px] font-medium px-2 py-2 flex justify-center items-center rounded-md border 
                      ${
                        risk.analysis?.grading?.toLowerCase() ===
                        "sangat tinggi"
                          ? "bg-red-800 text-white"
                          : risk.analysis?.grading?.toLowerCase() === "tinggi"
                          ? "bg-red-500 text-white"
                          : risk.analysis?.grading?.toLowerCase() === "sedang"
                          ? "bg-yellow-400 text-white"
                          : risk.analysis?.grading?.toLowerCase() === "rendah"
                          ? "bg-green-700 text-white"
                          : risk.analysis?.grading?.toLowerCase() ===
                            "sangat rendah"
                          ? "bg-green-400 text-white"
                          : "bg-gray-400 text-white"
                      }`}
                  >
                    {risk.analysis?.grading || "-"}
                  </span>
                </td>
                <td className="p-2 text-center">
                  {risk.risk_appetite?.controllability ?? "-"}
                </td>
                <td className="p-2 text-center">
                  {risk.risk_appetite?.scoring ?? "-"}
                </td>
                <td className="p-2 text-center">
                  {risk.risk_appetite?.ranking ?? "-"}
                </td>
                <td className="p-2">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="flex gap-2">
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
                      <button
                        onClick={() =>
                          !risk.risk_appetite?.decision &&
                          onOpenControlibility(risk)
                        }
                        disabled={!!risk.risk_appetite?.decision}
                        className={`p-1 rounded transition ${
                          risk.risk_appetite?.decision
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:cursor-pointer"
                        }`}
                        title={
                          risk.risk_appetite?.decision
                            ? `Keputusan sudah dibuat: ${
                                risk.risk_appetite.decision === "accepted"
                                  ? "Diterima"
                                  : "Dicegah"
                              }`
                            : risk.risk_appetite &&
                              (risk.risk_appetite.scoring ||
                                risk.risk_appetite.ranking)
                            ? "Edit Selera Risiko"
                            : "Atur Selera Risiko"
                        }
                      >
                        <HeartPlus
                          className={`h-5 w-5 ${
                            risk.risk_appetite?.decision
                              ? "text-gray-400"
                              : "text-green-600 hover:opacity-80"
                          }`}
                        />
                      </button>
                    </div>

                    {!risk.risk_appetite?.decision && (
                      <select
                        defaultValue=""
                        className="w-full border border-gray-300 rounded px-2 py-1 text-sm"
                        onChange={(e) =>
                          onDecisionChange(
                            risk.risk_appetite.id,
                            e.target.value
                          )
                        }
                      >
                        <option value="" disabled>
                          Pilih Keputusan
                        </option>
                        <option value="accepted">Diterima</option>
                        <option value="mitigated">Dicegah</option>
                      </select>
                    )}

                    {risk.risk_appetite?.decision && (
                      <span className="text-xs italic text-gray-500">
                        {risk.risk_appetite.decision === "accepted"
                          ? "Diterima"
                          : "Dicegah"}
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <ModalControlability
        isOpen={modalOpen}
        onClose={onCloseModal}
        risk={selectedRisk}
      />

      <div className="text-sm text-gray-600 mt-4">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          itemsPerPage={itemsPerPage}
          totalItems={totalItems}
        />
      </div>
    </div>
  );
}
