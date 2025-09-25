import { useState } from "react";
import { Plus } from "lucide-react";
import PenyebabSection from "./PenyebabSection";
import RiskNoteModal from "./RiskNoteModal";

export default function RiskFormField({
  formData,
  handleChange,
  unitsByKlaster,
  kategoriOptions,
  onCancel,
  handleAddPenyebab,
  handleRemovePenyebab,
  isFormValid,
  isSaving,
  isEdit,
}) {
  const [showNoteModal, setShowNoteModal] = useState(false);
  const handleOpenNoteModal = () => setShowNoteModal(true);
  const handleCloseNoteModal = () => setShowNoteModal(false);

  const handleUpdatePenyebab = (updatedList) => {
    handleChange({
      target: {
        name: "penyebab",
        value: updatedList,
      },
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md text-gray-900 max-w-4xl mx-auto mt-8">
      <h3 className="text-2xl font-semibold mb-4">
        {isEdit ? "Edit Risiko" : "Tambah Risiko Baru"}
      </h3>

      {showNoteModal && <RiskNoteModal onClose={handleCloseNoteModal} />}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Cluster</label>
          <select
            value={formData.klaster}
            onChange={(e) =>
              handleChange({ target: { name: "klaster", value: e.target.value } })
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="">-- Select Cluster --</option>
            {Object.keys(unitsByKlaster).map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Unit</label>
          <select
            value={formData.unit}
            onChange={(e) =>
              handleChange({ target: { name: "unit", value: e.target.value } })
            }
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="">-- Select Unit --</option>
            {(unitsByKlaster[formData.klaster] || []).map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Risk Name</label>
          <input
            type="text"
            name="namaRisiko"
            value={formData.namaRisiko}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Category</label>
          <select
            name="kategori"
            value={formData.kategori}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="">-- Select Category --</option>
            {kategoriOptions.map((k) => (
              <option key={k} value={k}>
                {k}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 font-semibold">Dampak</label>
          <input
            name="dampak"
            type="text"
            value={formData.dampak}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-4 py-2"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">UC/C</label>
          <select
            name="ucc"
            value={formData.ucc}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-4 py-2"
          >
            <option value="">-- Pilih UC/C --</option>
            <option value="UC">UC</option>
            <option value="C">C</option>
          </select>
        </div>

        <div className="col-span-2">
          <label className="block mb-2 font-semibold">Deskripsi Risiko</label>
          <textarea
            name="deskripsi"
            value={formData.deskripsi}
            onChange={handleChange}
            rows={3}
            className="w-full rounded-md border border-gray-300 px-4 py-2 resize-none"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Causes</label>
          <div className="mt-2">
            <button
              type="button"
              onClick={handleAddPenyebab}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold"
            >
              <Plus size={18} />
              Add Cause
            </button>
          </div>
        </div>
      </div>

      {/* Note modal trigger */}
      <div className="mt-4">
        <button
          type="button"
          onClick={handleOpenNoteModal}
          className="text-sm text-gray-600 underline"
        >
          View Risk Categories
        </button>
      </div>

      <div className="flex justify-end gap-4 mt-6">
        <button
          onClick={onCancel}
          className="w-[90px] h-[42px] text-sm text-red-600 border border-red-400 rounded-lg hover:bg-red-100 hover:cursor-pointer"
          type="button"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!isFormValid || isSaving}
          className={`w-[90px] h-[42px] text-sm border rounded-lg flex items-center justify-center ${
            isFormValid && !isSaving
              ? "text-blue-600 border-blue-500 hover:bg-blue-100 hover:cursor-pointer"
              : "text-gray-400 border-gray-300 bg-gray-100 cursor-not-allowed"
          }`}
        >
          {isSaving ? (
            <span className="flex items-center gap-2">
              <svg
                className="w-4 h-4 animate-spin text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                />
              </svg>
              Loading...
            </span>
          ) : (
            "Save"
          )}
        </button>
      </div>
    </div>
  );
}
