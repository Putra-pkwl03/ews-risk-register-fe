"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { saveRiskAnalysis } from "../../lib/RiskAnalysis";

export default function FormAnalisis({
  id: propId,
  name,
  unit,
  cluster,
  onClose,
  onSave,
  defaultSeverity = "",
  defaultProbability = "",
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idFromPropOrQuery = propId || searchParams.get("id");


  const [form, setForm] = useState({
    severity: defaultSeverity,
    probability: defaultProbability,
  });

  const [id, setId] = useState(idFromPropOrQuery);


  const isBase64 = (str) => {
    try {
      return btoa(atob(str)) === str;
    } catch {
      return false;
    }
  };

  useEffect(() => {
    setForm({
      severity: defaultSeverity,
      probability: defaultProbability,
    });


    try {
      if (idFromPropOrQuery) {
        const decodedId = isBase64(idFromPropOrQuery)
          ? atob(idFromPropOrQuery)
          : idFromPropOrQuery;
        setId(decodedId);
      }
    } catch (err) {
      console.error("Gagal decode ID:", err);
      setId(idFromPropOrQuery); 
    }
  }, [defaultSeverity, defaultProbability, idFromPropOrQuery]);


  const handleChange = (field, value) => {
    const intVal = parseInt(value);
    if (value === "" || (intVal >= 1 && intVal <= 5)) {
      setForm((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };


  const isValid = form.severity !== "" && form.probability !== "";


  const getGrading = (score) => {
    if (score >= 15) return "Extreme";
    if (score >= 10) return "High";
    if (score >= 5) return "Medium";
    return "Low";
  };

  // Simpan data ke backend
  const handleSave = async () => {
    if (!isValid || !id) return; 

    const severity = parseInt(form.severity);
    const probability = parseInt(form.probability);

    const payload = {
      risk_id: id,
      severity,
      probability,
    };

    try {
      const result = await saveRiskAnalysis(payload);
      if (onSave) onSave(result);

      const params = new URLSearchParams();
      params.set("page", "analisis-risiko");
      params.set("id", id);

      router.push(`/dashboard?${params.toString()}`);
    } catch (error) {
      console.error(
        "Error saving risk analysis:",
        error.response?.data || error.message
      );
    }
  };

  // Cancel action handler
  const handleCancel = () => {
    if (onClose) {
      onClose();
    } else if (window.history.length > 2) {
      router.back();
    } else {
      router.push("/dashboard?page=identifikasi-risiko");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center text-gray-900 justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative max-h-[80vh] overflow-y-auto">
        <h4 className="text-lg font-bold mb-4">Hitung Analisis</h4>

        <label className="block mb-2 font-semibold">Severity (1–5)</label>
        <input
          type="number"
          min={1}
          max={5}
          value={form.severity}
          onChange={(e) => handleChange("severity", e.target.value)}
          className="form-input mb-4 w-full"
          placeholder="Masukkan angka 1 sampai 5"
        />

        <label className="block mb-2 font-semibold">Probability (1–5)</label>
        <input
          type="number"
          min={1}
          max={5}
          value={form.probability}
          onChange={(e) => handleChange("probability", e.target.value)}
          className="form-input mb-4 w-full"
          placeholder="Masukkan angka 1 sampai 5"
        />

        <div className="flex justify-end mt-6 gap-2">
          <button
            type="button"
            onClick={handleCancel}
            className="w-[90px] h-[42px] hover:cursor-pointer text-sm text-red-600 border border-red-400 rounded-lg hover:bg-red-100 transition duration-300 ease-in-out"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={!isValid || !id}
            className={`w-[90px] h-[42px] text-sm rounded-lg border transition duration-300 ease-in-out ${
              isValid && id
                ? "text-blue-600 border-blue-500 hover:bg-blue-100 hover:cursor-pointer"
                : "text-gray-400 border-gray-300 cursor-not-allowed bg-gray-100"
            }`}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
