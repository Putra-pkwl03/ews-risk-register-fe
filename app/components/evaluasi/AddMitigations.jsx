"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import { X, Plus } from "lucide-react";
import { saveRiskMitigation } from "../../lib/RiskMitigations";
import { getUsers } from "../../lib/userApi";

export default function AddMitigation() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "";
  const riskId = page.split("/")[1];

  const [users, setUsers] = useState([]);
  const [mitigations, setMitigations] = useState([
    { mitigation_type: "", pic_id: "", deadline: "", descriptions: [""] },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    getUsers()
      .then((data) => setUsers(data))
      .catch(() => setUsers([]));
  }, []);

  const isLastMitigationFilled = () => {
    const last = mitigations[mitigations.length - 1];
    return (
      last.mitigation_type &&
      last.pic_id &&
      last.deadline &&
      last.descriptions.length > 0 &&
      last.descriptions.every((desc) => desc.trim() !== "")
    );
  };
        
  const allTypes = ["regulasi", "sdm", "sarana_prasarana"];

          
  const addMitigation = () => {
    if (mitigations.length >= 3) return;

    const usedTypes = mitigations.map((m) => m.mitigation_type);
    const unusedTypes = allTypes.filter((t) => !usedTypes.includes(t));

    setMitigations([
      ...mitigations,
      {
        mitigation_type: unusedTypes[0] || "", 
        pic_id: "",
        deadline: "",
        descriptions: [""],
      },
    ]);
  };
        
        

  const removeMitigation = (index) => {
    if (mitigations.length <= 1) return;
    const newMitigations = [...mitigations];
    newMitigations.splice(index, 1);
    setMitigations(newMitigations);
  };

  const updateMitigation = (index, key, value) => {
    const newMitigations = [...mitigations];
    newMitigations[index][key] = value;
    setMitigations(newMitigations);
  };

  const addDescription = (index) => {
    const newMitigations = [...mitigations];
    newMitigations[index].descriptions.push("");
    setMitigations(newMitigations);
  };

  const updateDescription = (mIndex, dIndex, value) => {
    const newMitigations = [...mitigations];
    newMitigations[mIndex].descriptions[dIndex] = value;
    setMitigations(newMitigations);
  };

  const removeDescription = (mIndex, dIndex) => {
    const newMitigations = [...mitigations];
    newMitigations[mIndex].descriptions.splice(dIndex, 1);
    setMitigations(newMitigations);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    for (const m of mitigations) {
      if (
        !m.mitigation_type ||
        !m.pic_id ||
        !m.deadline ||
        m.descriptions.length === 0 ||
        m.descriptions.some((desc) => !desc.trim())
      ) {
        setError("Semua field wajib diisi dan deskripsi tidak boleh kosong.");
        return;
      }
    }


        

    setLoading(true);
    try {
      for (const m of mitigations) {
        await saveRiskMitigation({
          risk_id: riskId,
          mitigation_type: m.mitigation_type,
          pic_id: m.pic_id,
          deadline: m.deadline,
          descriptions: m.descriptions,
        });
      }
      alert("Mitigasi risiko berhasil disimpan.");
      router.push("/dashboard?page=evaluasi-risiko");
    } catch (err) {
      setError(err.message || "Terjadi kesalahan saat menyimpan data.");
    } finally {
      setLoading(false);
    }
  };

  const isAllMitigationsFilled = () => {
    return mitigations.every((m) => {
      return (
        m.mitigation_type &&
        m.pic_id &&
        m.deadline &&
        m.descriptions.length > 0 &&
        m.descriptions.every((desc) => desc.trim() !== "")
      );
    });
  };

          
  return (
    <>
      <button
        onClick={() => router.push("/dashboard?page=evaluasi-risiko")}
        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 mb-6 cursor-pointer"
        aria-label="Kembali"
      >
        <ArrowLeftIcon className="h-5 w-5" />
      </button>

      <h3 className="text-xl font-semibold mb-2">Mitigasi Risiko</h3>

      {error && <div className="mb-4 text-red-600">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="flex flex-wrap gap-4">
          {mitigations.map((m, mIdx) => (
            <div
              key={mIdx}
              className="relative flex-1 min-w-[300px] p-4 rounded shadow-md"
            >
              {mIdx > 0 && (
                <button
                  type="button"
                  onClick={() => removeMitigation(mIdx)}
                  className="absolute top-0 right-0 text-red-600 hover:text-red-800 text-xl"
                  title="Hapus Mitigasi"
                >
                  <X size={18} />
                </button>
              )}
              <div className="mb-2">
                <label className="block font-semibold">Tipe Mitigasi</label>
                <select
                  value={m.mitigation_type}
                  onChange={(e) =>
                    updateMitigation(mIdx, "mitigation_type", e.target.value)
                  }
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:cursor-pointer"
                >
                  <option value="">-- Pilih Tipe --</option>
                  {allTypes
                    .filter((type) => {
                      const used = mitigations.map(
                        (mit, idx) => idx !== mIdx && mit.mitigation_type
                      );
                      return !used.includes(type) || m.mitigation_type === type;
                    })
                    .map((type) => (
                      <option key={type} value={type}>
                        {type === "regulasi"
                          ? "Regulasi"
                          : type === "sdm"
                          ? "SDM"
                          : "Sarana Prasarana"}
                      </option>
                    ))}
                </select>
              </div>
              <div className="mb-2">
                <label className="block font-semibold">Penanggung Jawab</label>
                <select
                  value={m.pic_id}
                  onChange={(e) =>
                    updateMitigation(mIdx, "pic_id", e.target.value)
                  }
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:cursor-pointer"
                >
                  <option value="">-- Pilih PIC --</option>
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-2">
                <label className="block font-semibold">Deadline</label>
                <input
                  type="date"
                  value={m.deadline}
                  onChange={(e) =>
                    updateMitigation(mIdx, "deadline", e.target.value)
                  }
                  className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block font-semibold">Deskripsi</label>
                {m.descriptions.map((desc, dIdx) => (
                  <div key={dIdx} className="flex gap-2 items-start mb-2">
                    <textarea
                      value={desc}
                      onChange={(e) =>
                        updateDescription(mIdx, dIdx, e.target.value)
                      }
                      placeholder={`Deskripsi ${dIdx + 1}`}
                      className="w-full rounded-md border border-gray-300 px-6 py-4 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    />
                    {dIdx > 0 && (
                      <button
                        type="button"
                        onClick={() => removeDescription(mIdx, dIdx)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded self-stretch cursor-pointer"
                      >
                        &times;
                      </button>
                    )}
                  </div>
                ))}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => addDescription(mIdx)}
                    disabled={
                      !m.descriptions[0] || m.descriptions[0].trim() === ""
                    }
                    className={`flex items-center gap-2 text-blue-600 hover:text-blue-800  mt-2 ${
                      !m.descriptions[0] || m.descriptions[0].trim() === ""
                        ? "opacity-50 cursor-not-allowed"
                        : "cursor-pointer"
                    }`}
                  >
                    <Plus size={20} />
                    Add Description
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {mitigations.length < 3 && (
          <div className="my-4">
            <button
              type="button"
              onClick={addMitigation}
              disabled={!isLastMitigationFilled()}
              className="flex items-center gap-2 hover:text-blue-800 text-blue-600 px-4 py-2 rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
            >
              <Plus size={20} />
              Add Mitigation
            </button>
          </div>
        )}

        <div className="mt-6 w-full">
          <button
            type="submit"
            disabled={!isAllMitigationsFilled() || loading}
            className="w-full text-blue-600 border-blue-500 hover:bg-blue-100 hover:cursor-pointer py-2 text-md rounded-lg border transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Menyimpan..." : "Save Mitigations"}
          </button>
        </div>
      </form>
    </>
  );
}
