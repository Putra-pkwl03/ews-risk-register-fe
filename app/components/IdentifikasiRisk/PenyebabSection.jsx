import { Plus, X, Pencil } from "lucide-react";
import { useState } from "react";
import ModalPenyebab from "./ModalPenyebab";

export default function PenyebabSection({
  penyebabList = [],
  onRemove,
  onAdd,
  onUpdate,
  isEditMode = false,
  kategoriPenyebab = [],
}) {
  const [editIndex, setEditIndex] = useState(null);
  const [editData, setEditData] = useState(null);

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditData({ ...penyebabList[index] });
  };

  const handleChange = (field, value) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubChange = (index, value) => {
    const newSub = [...editData.deskripsiSub];
    newSub[index] = value;
    setEditData({ ...editData, deskripsiSub: newSub });
  };

  const handleAddSub = () => {
    setEditData({
      ...editData,
      deskripsiSub: [...editData.deskripsiSub, ""],
    });
  };

  const handleRemoveSub = (index) => {
    const newSub = [...editData.deskripsiSub];
    newSub.splice(index, 1);
    setEditData({ ...editData, deskripsiSub: newSub });
  };

  const handleSaveEdit = () => {
    const updated = [...penyebabList];
    updated[editIndex] = editData;
    onUpdate(updated);
    setEditIndex(null);
    setEditData(null);
  };

  const daftarKategori = [
    "machine",
    "man",
    "material",
    "method",
    "environment",
  ];

  const handleCloseModal = () => {
    setEditIndex(null);
    setEditData(null);
  };

  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-xl font-semibold">Causes</h4>
        {!isEditMode && (
          <button
            type="button"
            onClick={onAdd}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold hover:cursor-pointer"
            aria-label="Add cause"
          >
            <Plus size={20} />
            Add Causes
          </button>
        )}
      </div>

      {penyebabList.length === 0 && (
        <p className="text-gray-500 italic">No causes added yet.</p>
      )}

      {penyebabList.map((p, idx) => (
        <div
          key={idx}
          className="mb-4 p-4 border border-gray-300 rounded-md bg-gray-50 relative"
        >
          <div className="absolute top-2 right-2 flex gap-2">
            <button
              onClick={() => handleEdit(idx)}
              className="w-[40px] h-[40px] bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center justify-center hover:cursor-pointer"
              aria-label={`Edit cause ${p.kategori}`}
            >
              <Pencil size={18} />
            </button>
            <button
              onClick={() => onRemove(idx)}
              className="w-[40px] h-[40px] bg-red-600 hover:bg-red-700 text-white rounded-md flex items-center justify-center hover:cursor-pointer"
              aria-label={`Remove cause ${p.kategori}`}
            >
              <X size={18} />
            </button>
          </div>

          <h5 className="font-semibold capitalize">{p.kategori || "-"}</h5>
          <p className="mt-1 mb-1 font-semibold">Main Description:</p>
          <p className="text-gray-700 whitespace-pre-line">
            {p.deskripsiUtama || "-"}
          </p>

          {p.deskripsiSub && p.deskripsiSub.length > 0 && (
            <>
              <p className="mt-2 font-semibold">Sub Descriptions:</p>
              <div className="space-y-2">
                {p.deskripsiSub.map((sub, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <textarea
                      value={sub}
                      readOnly
                      className="w-full rounded-md border border-gray-300 px-4 py-3 bg-gray-100 text-gray-700 resize-none"
                    />
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      ))}

      {/* Modal Edit Sub Causes */}
      {editData && (
        <ModalPenyebab
          penyebabBaru={editData}
          onChange={handleChange}
          onSubChange={handleSubChange}
          onAddSub={handleAddSub}
          onRemoveSub={handleRemoveSub}
          onClose={handleCloseModal}
          onSave={handleSaveEdit}
          kategoriPenyebab={daftarKategori}
        />
      )}
    </div>
  );
}
