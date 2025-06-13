"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";
import {
  saveRiskAnalysis,
  fetchRiskAnalysisById,
} from "../../lib/RiskAnalysis";
import SuccessToast from "../modalconfirmasi/SuccessToast";
import ErrorToast from "../modalconfirmasi/ErrorToast";

// 🔸 Menentukan warna berdasarkan grading
const getGradingClass = (grading) => {
  switch (grading) {
    case "Tinggi":
      return "bg-red-100 text-red-700 border border-red-300";
    case "Sedang":
      return "bg-yellow-100 text-yellow-800 border border-yellow-300";
    case "Rendah":
      return "bg-green-100 text-green-800 border border-green-300";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export default function FormAnalisis({
  id: propId,
  riskId: propRiskId,
  onClose,
  onSave,
  defaultSeverity = "",
  defaultProbability = "",
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showSuccess, setShowSuccess] = useState(false);
  const [riskAnalysisId, setRiskAnalysisId] = useState(null);
  const [riskId, setRiskId] = useState(propRiskId || "");
  const [isSaving, setIsSaving] = useState(false);
  const [form, setForm] = useState({
    severity: defaultSeverity,
    probability: defaultProbability,
  });
  const idFromQuery = searchParams.get("id");
  const riskIdFromQuery = searchParams.get("riskId");
  const [errorMessage, setErrorMessage] = useState("");
  const [showError, setShowError] = useState(false);

  // 🔸 Atur riskId dari parameter URL jika tidak ada dari props
  useEffect(() => {
    if (!riskId && riskIdFromQuery) {
      setRiskId(riskIdFromQuery);
    }
  }, [riskId, riskIdFromQuery]);

  const isBase64Encoded = (str) => {
    try {
      return btoa(atob(str)) === str;
    } catch {
      return false;
    }
  };

  // 🔸 Deteksi mode edit atau tambah
  useEffect(() => {
    const isEditMode = !!(propId || (!propRiskId && idFromQuery));
    if (isEditMode) {
      const rawId = propId || idFromQuery;
      const decodedId = isBase64Encoded(rawId) ? atob(rawId) : rawId;
      setRiskAnalysisId(decodedId);
    } else {
      setRiskAnalysisId(null);
    }
  }, [propId, propRiskId, idFromQuery]);

  // 🔸 Ambil data jika mode edit
  useEffect(() => {
    if (!riskAnalysisId) {
      setForm({
        severity: defaultSeverity,
        probability: defaultProbability,
      });
      return;
    }

    let isMounted = true;
    fetchRiskAnalysisById(riskAnalysisId)
      .then((data) => {
        if (!isMounted) return;
        if (!data) {
          setForm({
            severity: defaultSeverity,
            probability: defaultProbability,
          });
          setRiskAnalysisId(null);
          return;
        }
        setForm({
          severity: data.severity?.toString() || "",
          probability: data.probability?.toString() || "",
        });
        setRiskId(data.risk_id || "");
      })
      .catch(() => {
        setForm({
          severity: defaultSeverity,
          probability: defaultProbability,
        });
        setRiskAnalysisId(null);
      });

    return () => {
      isMounted = false;
    };
  }, [riskAnalysisId, defaultSeverity, defaultProbability]);

  // 🔸 Validasi input (1–5)
  const handleChange = (field, value) => {
    const intVal = parseInt(value);
    if (value === "" || (intVal >= 1 && intVal <= 5)) {
      setForm((prev) => ({ ...prev, [field]: value }));
    }
  };

  const isValid =
    form.severity !== "" && form.probability !== "" && riskId.trim() !== "";

  // 🔸 Hitung grading berdasarkan score
  const getBandsRisiko = (skor) => {
    if (skor >= 15) return "Tinggi";
    if (skor >= 8) return "Sedang";
    return "Rendah";
  };

  // 🔸 Fungsi simpan (tambah atau edit)
  const handleSave = useCallback(async () => {
    console.log("handleSave dipanggil, form:", form, "riskId:", riskId);
    if (!isValid) {
      alert("Isi semua data dengan benar dan pastikan Risk ID tersedia.");
      return;
    }

    const severity = parseInt(form.severity);
    const probability = parseInt(form.probability);
    const score = severity * probability;
    const grading = getBandsRisiko(score);

    const payload = {
      risk_id: riskId,
      severity,
      probability,
      score,
      grading,
    };

    if (riskAnalysisId) payload.id = riskAnalysisId;

    try {
      setIsSaving(true);
      const result = await saveRiskAnalysis(payload);

      if (onSave) onSave({ ...result, severity, probability, score, grading });

      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        if (onClose) onClose();
        // Redirect ke halaman dashboard setelah toast hilang
        router.push("/dashboard?page=analisis-risiko");
      }, 2000);
    } catch (error) {
      let message = "Data analisis risiko ini sudah ada";
      setErrorMessage(message);
      setShowError(true);
      setTimeout(() => {
        router.push("/dashboard?page=analisis-risiko");
      }, 1500);
    } finally {
      setIsSaving(false);
    }
  }, [form, isValid, riskId, riskAnalysisId, onSave, onClose, router]);

  // 🔸 Tombol batal
  const handleCancel = useCallback(() => {
    if (onClose) {
      onClose();
    } else if (window.history.length > 2) {
      router.back();
    } else {
      router.push("/dashboard?page=identifikasi-risiko");
    }
  }, [onClose, router]);

  const severity = parseInt(form.severity);
  const probability = parseInt(form.probability);
  const score = severity * probability;
  const grading = getBandsRisiko(score);

  return (
    <>
      <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-md relative max-h-[80vh] overflow-y-auto">
          <h4 className="text-lg font-bold mb-4 text-black">
            {riskAnalysisId ? "Edit" : "Tambah"} Analisis Risiko
          </h4>

          <div className="mb-4 text-gray-800">
            <label htmlFor="severity" className="block mb-2 font-semibold">
              Severity (1–5)
            </label>
            <input
              id="severity"
              type="number"
              min={1}
              max={5}
              value={form.severity}
              onChange={(e) => handleChange("severity", e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan angka 1 sampai 5"
            />
          </div>

          <div className="mb-4 text-gray-800">
            <label htmlFor="probability" className="block mb-2 font-semibold">
              Probability (1–5)
            </label>
            <input
              id="probability"
              type="number"
              min={1}
              max={5}
              value={form.probability}
              onChange={(e) => handleChange("probability", e.target.value)}
              className="border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Masukkan angka 1 sampai 5"
            />
          </div>

          {form.severity && form.probability && (
            <div className={`rounded p-3 mb-4 ${getGradingClass(grading)}`}>
              <p>
                <strong>Score:</strong> {score}
              </p>
              <p>
                <strong>Grading:</strong> {grading}
              </p>
            </div>
          )}

          <div className="flex justify-end mt-6 gap-2">
            <button
              type="button"
              onClick={handleCancel}
              className="w-[90px] h-[42px] text-sm text-red-600 border border-red-400 rounded-lg hover:bg-red-100 transition hover:cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={!isValid || isSaving}
              className={`w-[90px] h-[42px] text-sm rounded-lg border transition relative ${
                isValid && !isSaving
                  ? "text-blue-600 border-blue-500 hover:bg-blue-100 hover:cursor-pointer"
                  : "text-gray-400 border-gray-300 bg-gray-100 cursor-not-allowed"
              }`}
            >
              {isSaving ? "Saving..." : "Save"}
              {isSaving && (
                <span className="absolute bottom-0 left-0 w-full h-1 bg-blue-400" />
              )}
            </button>
          </div>
        </div>
      </div>
      {showSuccess && (
        <SuccessToast message="Data analisis risiko berhasil disimpan!" />
      )}
      {showError && (
        <ErrorToast
          message={errorMessage}
          isOpen={showError}
          onClose={() => setShowError(false)}
        />
      )}
    </>
  );
}
