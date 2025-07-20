import { useState } from "react";
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
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block mb-2 font-semibold">Klaster</label>
          <select
            name="klaster"
            value={formData.klaster}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Pilih Klaster --</option>
            {Object.keys(unitsByKlaster).map((klaster) => (
              <option key={klaster} value={klaster}>
                {klaster}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 font-semibold">Unit</label>
          <select
            name="unit"
            value={formData.unit}
            onChange={handleChange}
            disabled={!formData.klaster}
            className="w-full rounded-md border border-gray-300 px-4 py-2 disabled:bg-gray-100"
          >
            <option value="">-- Pilih Unit --</option>
            {formData.klaster &&
              unitsByKlaster[formData.klaster].map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
          </select>
        </div>

        <div>
          <label className="block mb-2 font-semibold">Nama Risiko</label>
          <input
            name="namaRisiko"
            value={formData.namaRisiko}
            onChange={handleChange}
            className="w-full rounded-md border border-gray-300 px-4 py-2"
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold">Kategori</label>
          <div className="flex items-center gap-2">
            <select
              name="kategori"
              value={formData.kategori}
              onChange={handleChange}
              className="flex-grow rounded-md border border-gray-300 px-4 py-2"
            >
              <option value="">-- Pilih Kategori --</option>
              {kategoriOptions.map((kat) => (
                <option key={kat} value={kat}>
                  {kat}
                </option>
              ))}
            </select>
            <img
              src="/icons/question.png"
              alt="info"
              className="h-5 w-5 opacity-60 cursor-pointer"
              onClick={handleOpenNoteModal}
            />
          </div>
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
      </div>

      {/* Penyebab Risiko dan Edit Modal langsung di dalamnya */}
      <PenyebabSection
        penyebabList={formData.penyebab}
        onAdd={handleAddPenyebab}
        onRemove={handleRemovePenyebab}
        onUpdate={handleUpdatePenyebab} // gunakan fungsi update
      />

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
