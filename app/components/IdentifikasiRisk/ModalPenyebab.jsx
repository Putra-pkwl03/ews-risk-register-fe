import { X, Plus } from "lucide-react";

export default function ModalPenyebab({
  penyebabBaru,
  onClose,
  onSave,
  onChange,
  kategoriPenyebab,
  onSubChange,
  onAddSub,
  onRemoveSub,
}) {
  const isValid =
    penyebabBaru.kategori.trim() !== "" &&
    penyebabBaru.deskripsiUtama.trim() !== "";
  const handleUpdatePenyebab = (index, updatedItem) => {
    const updatedList = [...penyebabList];
    updatedList[index] = updatedItem;
    setPenyebabList(updatedList);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center text-gray-900 justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-lg relative max-h-[80vh] overflow-y-auto">
        <h4 className="text-lg font-bold mb-4">
          {penyebabBaru.id ? "Edit Cause" : "Add Cause"}
        </h4>

        {/* Category */}
        <label className="block mb-2 font-semibold">Category</label>
        <select
          value={penyebabBaru.kategori}
          onChange={(e) => onChange("kategori", e.target.value)}
          className="form-select mb-4 w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">-- Select Category --</option>
          {kategoriPenyebab.map((kat) => (
            <option key={kat} value={kat}>
              {kat}
            </option>
          ))}
        </select>

        {/* Main Description */}
        <label className="block mb-2 font-semibold">Main Description</label>
        <textarea
          rows={3}
          value={penyebabBaru.deskripsiUtama}
          onChange={(e) => onChange("deskripsiUtama", e.target.value)}
          className="form-input mb-4 w-full border border-gray-300 rounded px-3 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter main description"
        />

        {/* Sub Causes */}
        {penyebabBaru.deskripsiSub.length > 0 && (
          <>
            <label className="block font-semibold">Sub Causes</label>
            {penyebabBaru.deskripsiSub.map((desc, idx) => (
              <div key={idx} className="flex gap-2 items-start mb-2">
                <textarea
                  value={desc}
                  onChange={(e) => onSubChange(idx, e.target.value)}
                  placeholder={`Description ${idx + 1}`}
                  className="w-full rounded-md border border-gray-300 px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />

                <button
                  type="button"
                  onClick={() => onRemoveSub(idx)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded self-stretch cursor-pointer"
                >
                  &times;
                </button>
              </div>
            ))}
          </>
        )}

        {/* Add sub button */}
        <button
          type="button"
          onClick={onAddSub}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold hover:cursor-pointer mt-2"
        >
          <Plus size={20} />
          Add Sub Causes
        </button>

        {/* Action buttons */}
        <div className="flex justify-end mt-6 gap-2">
          <button
            type="button"
            onClick={onClose}
            className="w-[90px] h-[42px] hover:cursor-pointer text-sm text-red-600 border border-red-400 rounded-lg hover:bg-red-100 transition duration-300 ease-in-out"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            disabled={!isValid}
            className={`w-[90px] h-[42px] text-sm rounded-lg border transition duration-300 ease-in-out ${
              isValid
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
