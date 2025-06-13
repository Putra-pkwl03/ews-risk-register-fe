"use client";
import ModalControlability from "../../components/penangananrisiko/ControllabilityModal";

export default function RiskList({
  risks,
  onDetailClick,
  onOpenControlibility,
  selectedRisk,
  modalOpen,
  onCloseModal,
  onDecisionChange,
}) {
  return (
    <div className="bg-white rounded-sm shadow-gray-200 shadow-xl p-4 mb-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4 flex-wrap">
        <h5 className="text-[20px] text-black font-semibold">
          Penanganan Risiko
        </h5>
      </div>

      {risks.length === 0 ? (
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
                  className={`p-2 ${title === "Aksi" ? "text-center" : ""}`}
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {risks.map((risk) => (
              <tr key={risk.id} className="hover:bg-gray-50 text-[12px]">
                <td className="py-2 text-center">{risk.cluster}</td>
                <td className="py-2 text-center">{risk.unit}</td>
                <td className="py-2 text-left">{risk.name}</td>
                <td className="py-2 text-left">{risk.category}</td>
                <td className="py-2 text-center">
                  {risk.analysis?.severity ?? "-"}
                </td>
                <td className="py-2 text-center">
                  {risk.analysis?.probability ?? "-"}
                </td>
                <td className="py-2 text-center">
                  {risk.analysis?.score ?? "-"}
                </td>
                <td className="py-2 text-center capitalize">
                  {risk.analysis?.grading ?? "-"}
                </td>
                <td className="py-2 text-center">
                  {risk.risk_appetite?.controllability ?? "-"}
                </td>
                <td className="py-2 text-center">
                  {risk.risk_appetite?.scoring ?? "-"}
                </td>
                <td className="py-2 text-center">
                  {risk.risk_appetite?.ranking ?? "-"}
                </td>
                <td className="py-2 text-center space-x-2">
                  <button
                    onClick={() => onDetailClick(risk)}
                    className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700 transition"
                  >
                    Detail
                  </button>
                  <button
                    onClick={() => onOpenControlibility(risk)}
                    className={`px-2 py-1 rounded text-white transition ${
                      risk.risk_appetite &&
                      (risk.risk_appetite.scoring || risk.risk_appetite.ranking)
                        ? "bg-yellow-600 hover:bg-yellow-700"
                        : "bg-green-600 hover:bg-green-700"
                    }`}
                  >
                    {risk.risk_appetite &&
                    (risk.risk_appetite.scoring || risk.risk_appetite.ranking)
                      ? "Edit"
                      : "Selera Risiko"}
                  </button>

                  {/* Dropdown untuk decision */}
                  {risk.risk_appetite && !risk.risk_appetite.decision && (
                    <select
                      defaultValue=""
                      className="mt-2 block w-full border border-gray-300 rounded px-2 py-1 text-sm"
                      onChange={(e) =>
                        onDecisionChange(risk.risk_appetite.id, e.target.value)
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
                    <span className="block mt-2 text-xs italic text-gray-500">
                      {risk.risk_appetite.decision === "accepted"
                        ? "Diterima"
                        : "Dicegah"}
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <ModalControlability
        isOpen={modalOpen}
        onClose={onCloseModal}
        risk={selectedRisk}
      />
    </div>
  );
}
