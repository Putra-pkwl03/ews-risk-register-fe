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
        console.error("Failed to load risk list:", err);
      }
    };

    fetchRisks();
  }, [isOpen, editingItem]);

  // Fill form when editing, reset when adding new
  useEffect(() => {
    if (editingItem) {
      setRiskId(editingItem.risk_id);
      setEffectiveness(editingItem.effectiveness);
      setBarrier(editingItem.barrier || "");
    } else {
      setRiskId("");
      setEffectiveness("TE");
      setBarrier("");
    }
  }, [editingItem]);

  // Reset form when add-new modal opens
  useEffect(() => {
    if (isOpen && !editingItem) {
      setRiskId("");
      setEffectiveness("TE");
      setBarrier("");
    }
  }, [isOpen, editingItem]);

  if (!isOpen) return null;

  const isBarrierRequired =
    (effectiveness === "TE" || effectiveness === "KE") && barrier.trim() === "";

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
          {editingItem ? "Edit Effectiveness" : "Add Effectiveness"}
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Risk</label>
            <select
              value={riskId}
              onChange={(e) => setRiskId(e.target.value)}
              className="w-full border rounded px-3 py-2 hover:cursor-pointer"
              required
              disabled={!!editingItem}
            >
              <option value="" disabled>
                Select Risk
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
              Effectiveness
            </label>
            <select
              value={effectiveness}
              onChange={(e) => setEffectiveness(e.target.value)}
              className="w-full border rounded px-3 py-2 hover:cursor-pointer"
              required
            >
              <option value="TE">Not Effective</option>
              <option value="KE">Less Effective</option>
              <option value="E">Effective</option>
            </select>
          </div>

          {effectiveness !== "E" && (
            <div className="mb-4">
              <label className="block mb-1 text-sm font-medium">Barrier</label>
              <textarea
                value={barrier}
                onChange={(e) => setBarrier(e.target.value)}
                className={`w-full border rounded px-3 py-2 resize-none ${
                  isBarrierRequired ? "border-red-500" : ""
                }`}
                rows={3}
                placeholder="Enter barrier if any"
              />
              {isBarrierRequired && (
                <p className="text-red-500 text-xs mt-1">
                  Barrier is required for Not Effective or Less Effective results.
                </p>
              )}
            </div>
          )}

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
              disabled={loading || isBarrierRequired}
              className="w-[90px] h-[42px] text-sm border rounded-lg transition duration-300 ease-in-out flex items-center justify-center text-blue-600 border-blue-500 hover:bg-blue-100 hover:text-blue-700 hover:cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
