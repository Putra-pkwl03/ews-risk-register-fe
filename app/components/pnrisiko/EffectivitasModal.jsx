"use client";

import { useState, useEffect } from "react";
import RiskService from "../../lib/RiskService";

export default function AddEffectivenessModal({
  isOpen,
  onClose,
  onSubmit,
  editingItem,
}) {
  const [riskId, setRiskId] = useState("");
  const [effectiveness, setEffectiveness] = useState("TE");
  const [loading, setLoading] = useState(false);
  const [risks, setRisks] = useState([]);
  const [barrier, setBarrier] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const fetchRisks = async () => {
      try {
        const allRisks = await RiskService.getAll();

        const filteredRisks = editingItem
          ? allRisks
          : allRisks.filter(
              (risk) => !risk.handlings || risk.handlings.length === 0
            );

        setRisks(filteredRisks || []);
      } catch (err) {
        console.error("Gagal memuat daftar risiko:", err);
      }
    };

    fetchRisks();
  }, [isOpen, editingItem]);

  useEffect(() => {
    if (editingItem) {
      setRiskId(editingItem.risk_id);
      setEffectiveness(editingItem.effectiveness);
      setBarrier(editingItem.barrier || ""); // Tambahan ini
    } else {
      setRiskId("");
      setEffectiveness("TE");
      setBarrier(""); // Reset saat tambah baru
    }
  }, [editingItem]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await onSubmit({ risk_id: riskId, effectiveness, barrier });
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
              className="w-full border rounded px-3 py-2 hover:cursor-pointer"
              required
              disabled={!!editingItem}
            >
              <option value="" disabled>
                Pilih Risiko
              </option>
              {risks.map((risk) => (
                <option key={risk.id} value={risk.id}>
                  {risk.name} - {risk.unit}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">
              Efektivitas
            </label>
            <select
              value={effectiveness}
              onChange={(e) => setEffectiveness(e.target.value)}
              className="w-full border rounded px-3 py-2 hover:cursor-pointer"
              required
            >
              <option value="TE">Tidak Efektif</option>
              <option value="KE">Kurang Efektif</option>
              <option value="E">Efektif</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Hambatan</label>
            <textarea
              value={barrier}
              onChange={(e) => setBarrier(e.target.value)}
              className="w-full border rounded px-3 py-2 resize-none"
              rows={3}
              placeholder="Masukkan hambatan jika ada"
            />
          </div>
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="w-[90px] h-[42px] hover:cursor-pointer text-sm text-red-600 border border-red-400 rounded-lg hover:bg-red-100 transition duration-300 ease-in-out"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-[90px] h-[42px] text-sm border rounded-lg transition duration-300 ease-in-out flex items-center justify-center text-blue-600 border-blue-500 hover:bg-blue-100 hover:text-blue-700 hover:cursor-pointer"
            >
              {loading ? "Menyimpan..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
