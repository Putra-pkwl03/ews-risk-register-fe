"use client";

import { useState, useEffect } from "react";
import RiskService from "../../lib/RiskService"; 

export default function AddEffectivenessModal({ isOpen, onClose, onSubmit, editingItem }) {
  const [riskId, setRiskId] = useState("");
  const [effectiveness, setEffectiveness] = useState("TE");
  const [loading, setLoading] = useState(false);
  const [risks, setRisks] = useState([]);

  useEffect(() => {
    if (!isOpen) return;

    // Ambil daftar risiko 
    const fetchRisks = async () => {
        try {
          const risks = await RiskService.getAll();
          setRisks(risks || []);                  
        } catch (err) {
          console.error("Gagal memuat daftar risiko", err);
        }
      };

    fetchRisks();
  }, [isOpen]);

  useEffect(() => {
    if (editingItem) {
      setRiskId(editingItem.risk_id);
      setEffectiveness(editingItem.effectiveness);
    } else {
      setRiskId("");
      setEffectiveness("TE");
    }
  }, [editingItem]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit({ risk_id: riskId, effectiveness });
    setLoading(false);
    setRiskId("");
    setEffectiveness("TE");
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center text-gray-900 justify-center z-50">
      <div className="bg-white rounded p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold mb-4">
          {editingItem ? "Edit Efektivitas" : "Tambah Efektivitas"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Risiko</label>
            <select
              value={riskId}
              onChange={(e) => setRiskId(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
              disabled={!!editingItem}
            >
              <option value="" disabled>Pilih Risiko</option>
              {risks.map((risk) => (
                <option key={risk.id} value={risk.id}>
                  {risk.name} - {risk.unit}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Efektivitas</label>
            <select
              value={effectiveness}
              onChange={(e) => setEffectiveness(e.target.value)}
              className="w-full border rounded px-3 py-2"
              required
            >
              <option value="TE">Tidak Efektif</option>
              <option value="KE">Kurang Efektif</option>
              <option value="E">Efektif</option>
            </select>
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded"
            >
              {loading ? "Menyimpan..." : "Simpan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
