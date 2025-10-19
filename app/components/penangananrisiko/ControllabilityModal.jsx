import { useState, useEffect } from "react";
import {
  saveRiskAppetite,
  editRiskAppetiteControllability,
} from "../../lib/RiskAnalysis";
import SuccessToast from "../modalconfirmasi/SuccessToast";
import ErrorToast from "../modalconfirmasi/ErrorToast";

export default function ControlabilityModal({ isOpen, onClose, risk }) {
  const [controllability, setControllability] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [decision, setDecision] = useState("");
  // ✅ simple validation
  const isFormValid = [1, 2, 3, 4].includes(controllability) && decision !== "";
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

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
    if (!isFormValid) {
      setError("Please fill out all fields correctly.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (risk.risk_appetite?.id) {
        await editRiskAppetiteControllability(
          risk.risk_appetite.id,
          controllability
        );
      } else {
        const payload = {
          risk_id: String(risk.id),
          controllability: Number(controllability),
          decision,
        };
        await saveRiskAppetite(payload);
      }

  setToastMessage("Controllability saved successfully.");
      setShowSuccess(true);

      setTimeout(() => {
        onClose(true, {
          ...risk,
          risk_appetite: {
            ...(risk.risk_appetite || {}),
            controllability,
            decision,
          },
        });
      }, 1000);
    } catch (err) {
      const message = err.response?.data?.message || "Failed to save";
      setToastMessage(message);
      setShowError(true);
      console.error(err);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={() => onClose(false)}
    >
      <div
        className="bg-white text-[#292D32] rounded-lg shadow-lg max-w-md w-full p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
  <h2 className="text-lg font-semibold mb-4">Risk Controllability</h2>

        <label
          htmlFor="controllability"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Controllability Value (1-4)
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
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />

        <label
          htmlFor="decision"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
    Decision
        </label>
        <select
          id="decision"
          value={decision}
          onChange={(e) => setDecision(e.target.value)}
          className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 hover:cursor-pointer"
        >
          <option value="">-- Select Decision --</option>
          <option value="accepted">Accepted</option>
          <option value="mitigated">Mitigated</option>
        </select>

  {error && <p className="text-red-600 text-sm mb-3 ">{error}</p>}

        <div className="flex justify-end gap-2">
          <button
            onClick={() => onClose(false)}
            className="w-[90px] h-[42px] text-sm text-red-600 border border-red-400 rounded-lg hover:bg-red-100 transition hover: cursor-pointer"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className={`w-[90px] h-[42px] text-sm border rounded-lg transition flex items-center justify-center ${
              isFormValid && !loading
                ? "text-blue-600 border-blue-500 hover:bg-blue-100 hover:cursor-pointer"
                : "text-gray-400 border-gray-300 bg-gray-100 cursor-not-allowed"
            }`}
            disabled={loading || !isFormValid}
          >
            {loading ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
      <SuccessToast
        message={toastMessage}
        isOpen={showSuccess}
        onClose={() => setShowSuccess(false)}
      />
      <ErrorToast
        message={toastMessage}
        isOpen={showError}
        onClose={() => setShowError(false)}
      />
    </div>
  );
}
