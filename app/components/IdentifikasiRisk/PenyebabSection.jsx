import { Plus, X } from "lucide-react";

export default function PenyebabSection({
  penyebabList = [],
  onRemove,
  onAdd,
  isEditMode = false,
}) {
  return (
    <div className="mt-6">
      <div className="flex justify-between items-center mb-3">
        <h4 className="text-xl font-semibold">Penyebab Risiko</h4>
        {!isEditMode && (
          <button
            type="button"
            onClick={onAdd}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold hover:cursor-pointer"
            aria-label="Tambah penyebab risiko"
          >
            <Plus size={20} />
            Add Causes
          </button>
        )}
      </div>

      {penyebabList.length === 0 && (
        <p className="text-gray-500 italic">Belum ada penyebab ditambahkan.</p>
      )}

      {penyebabList.map((p, idx) => (
        <div
          key={idx}
          className="mb-4 p-4 border border-gray-300 rounded-md bg-gray-50 relative"
        >
          <button
            onClick={() => onRemove(idx)}
            className="absolute top-2 right-2 text-red-500 hover:text-red-700"
            aria-label={`Hapus penyebab ${p.kategori}`}
          >
            <X size={20} />
          </button>

          <h5 className="font-semibold">{p.kategori || "-"}</h5>
          <p className="mt-1 mb-1 font-semibold">Deskripsi Utama:</p>
          <p className="text-gray-700 whitespace-pre-line">
            {p.deskripsiUtama || "-"}
          </p>

          {p.deskripsiSub && p.deskripsiSub.length > 0 && (
            <>
              <p className="mt-2 font-semibold">Deskripsi Sub:</p>
              <ul className="list-disc ml-5 text-gray-700">
                {p.deskripsiSub.map((sub, i) => (
                  <li key={i}>{sub}</li>
                ))}
              </ul>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
