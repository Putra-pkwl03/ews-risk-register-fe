import { useState, useEffect } from "react";
import {
  saveRiskAppetite,
  editRiskAppetiteControllability,
} from "../../lib/RiskAnalysis";

export default function ControlabilityModal({ isOpen, onClose, risk }) {
  const [controllability, setControllability] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [decision, setDecision] = useState(""); // bisa kosong

  useEffect(() => {
    if (isOpen && risk) {
      setControllability(
        risk.risk_appetite?.controllability ??
          risk.analysis?.controllability ??
          1
      );
      setDecision(risk.risk_appetite?.decision ?? "");
      setError(null);
    }
  }, [isOpen, risk]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (
      !controllability ||
      isNaN(controllability) ||
      controllability < 1 ||
      controllability > 4
    ) {
      setError("Kontrolabilitas harus antara 1 sampai 4.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (risk.risk_appetite?.id) {
        // Mode edit
        await editRiskAppetiteControllability(
          risk.risk_appetite.id,
          controllability
        );
      } else {
        // Mode simpan baru
        const payload = {
          risk_id: String(risk.id),
          controllability: Number(controllability),
          decision,
        };
        await saveRiskAppetite(payload);
      }

      // Kirim data baru ke parent untuk update UI
      onClose(true, {
        ...risk,
        risk_appetite: {
          ...(risk.risk_appetite || {}),
          controllability,
          decision,
        },
      });
    } catch (err) {
      setError(err.response?.data?.message || "Gagal menyimpan");
      console.error(err.response?.data);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={() => onClose(false)}
    >
      <div
        className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-lg font-semibold mb-4">Kontrolabilitas Risiko</h2>

        <label
          htmlFor="controllability"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Nilai Kontrolabilitas (1-4)
        </label>
        <input
          id="controllability"
          type="number"
          min={1}
          max={4}
          value={controllability}
          onChange={(e) => {
            const value = parseInt(e.target.value);
            if ([1, 2, 3, 4].includes(value)) {
              setControllability(value);
            } else if (e.target.value === "") {
              setControllability("");
            }
          }}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300 mb-4"
        />

        <label
          htmlFor="decision"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Keputusan
        </label>
        <select
          id="decision"
          value={decision}
          onChange={(e) => setDecision(e.target.value)}
          className="w-full border rounded px-3 py-2 focus:outline-none focus:ring focus:border-blue-300 mb-4"
        >
          <option value="">-- Pilih Keputusan --</option>
          <option value="accepted">Accepted</option>
          <option value="mitigated">Mitigated</option>
        </select>

        {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

        <div className="flex justify-end gap-2">
          <button
            onClick={() => onClose(false)}
            className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
            disabled={loading}
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            disabled={loading}
          >
            {loading ? "Menyimpan..." : "Simpan"}
          </button>
        </div>
      </div>
    </div>
  );
}
