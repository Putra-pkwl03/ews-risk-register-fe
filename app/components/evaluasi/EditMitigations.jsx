"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import SpinnerLoader from "../loadings/SpinnerLoader";
import { getUsers } from "../../lib/userApi";
import {
  getMitigationsByRiskId,
  updateRiskMitigation,
} from "../../lib/RiskMitigations";
import SuccessToast from "../modalconfirmasi/SuccessToast";
import ErrorToast from "../modalconfirmasi/ErrorToast";

export default function EditMitigationForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = searchParams.get("page") || "";
  const parts = page.split("/");
  const riskId = parts.length >= 2 ? parts[1] : null;
  const [mitigations, setMitigations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [forms, setForms] = useState([]);
  const [users, setUsers] = useState([]);
  const [successOpen, setSuccessOpen] = useState(false);
  const [errorOpen, setErrorOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (error) {
        console.error("Gagal memuat data users", error);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    const fetchMitigations = async () => {
      try {
        setLoading(true);
        const data = await getMitigationsByRiskId(riskId);
        setMitigations(data);
        const initialForms = data.map((mit) => ({
          id: mit.id,
          mitigation_type: mit.mitigation_type || "",
          pic_id: mit.pic_id || "",
          deadline: mit.deadline || "",
          descriptions: mit.descriptions || [{ description: "" }],
        }));
        setForms(initialForms);
        setError(null);
      } catch (err) {
        console.error("Gagal memuat mitigasi:", err);
        setError("Gagal memuat mitigasi.");
      } finally {
        setLoading(false);
      }
    };
    if (riskId) fetchMitigations();
  }, [riskId]);

  if (loading)
    return (
      <div className="fixed inset-0 flex justify-center items-center">
        <SpinnerLoader />
      </div>
    );
  if (error)
    return (
      <div className="text-red-600 p-4 text-center font-semibold">{error}</div>
    );
  if (!mitigations.length)
    return <div className="p-4 text-center">Data mitigasi tidak tersedia.</div>;

  const handleChange = (index, field, value) => {
    setForms((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const handleDescriptionChange = (mitIndex, descIndex, value) => {
    setForms((prev) => {
      const updated = [...prev];
      updated[mitIndex].descriptions[descIndex].description = value;
      return updated;
    });
  };

  const handleAddDescription = (mitIndex) => {
    setForms((prev) => {
      const updated = [...prev];
      updated[mitIndex].descriptions.push({ description: "" });
      return updated;
    });
  };

  const handleRemoveDescription = (mitIndex, descIndex) => {
    setForms((prev) => {
      const updated = [...prev];
      if (updated[mitIndex].descriptions.length > 1) {
        updated[mitIndex].descriptions.splice(descIndex, 1);
      }
      return updated;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await Promise.all(
        forms.map((mit) =>
          updateRiskMitigation(mit.id, {
            mitigation_type: mit.mitigation_type,
            pic_id: mit.pic_id,
            deadline: mit.deadline,
            descriptions: mit.descriptions.map((d) => d.description),
          })
        )
      );
      setToastMessage("Semua mitigasi berhasil diperbarui.");
      setSuccessOpen(true);
      setTimeout(() => {
        router.push("/dashboard?page=evaluasi-risiko");
      }, 1500);
    } catch (err) {
      console.error("Gagal update mitigasi:", err);
      setToastMessage(err.message || "Gagal memperbarui mitigasi.");
      setErrorOpen(true);
    }
  };

  return (
    <>
      <SuccessToast
        message={toastMessage}
        isOpen={successOpen}
        onClose={() => setSuccessOpen(false)}
      />
      <ErrorToast
        message={toastMessage}
        isOpen={errorOpen}
        onClose={() => setErrorOpen(false)}
      />
      <div className="flex gap-3 items-center mb-6 max-w-4xl mx-auto">
        <button
          onClick={() => router.push("/dashboard?page=evaluasi-risiko")}
          className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 cursor-pointer"
          aria-label="Kembali"
        >
          <ArrowLeftIcon className="h-5 w-5 hover:text-blue-500" />
        </button>
        <h2 className="text-xl font-semibold text-black">Edit Mitigasi</h2>
      </div>
      <div className="flex flex-col items-center py-5">
        <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-4xl">
          <div className="flex flex-col gap-4 text-black">
            {forms.map((form, mitIndex) => (
              <div
                key={form.id}
                className="w-full p-4 rounded shadow-md bg-white space-y-4"
              >
                <div className="space-y-2">
                  <div>
                    <label className="block text-sm font-medium">
                      Jenis Mitigasi:
                    </label>
                    <select
                      value={form.mitigation_type}
                      onChange={(e) =>
                        handleChange(
                          mitIndex,
                          "mitigation_type",
                          e.target.value
                        )
                      }
                      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:cursor-pointer"
                    >
                      {[
                        form.mitigation_type,
                        "regulasi",
                        "sdm",
                        "sarana_prasarana",
                      ]
                        .filter((v, i, arr) => arr.indexOf(v) === i)
                        .map((type) => (
                          <option key={type} value={type}>
                            {type === "regulasi"
                              ? "Regulasi"
                              : type === "sdm"
                              ? "SDM"
                              : type === "sarana_prasarana"
                              ? "Sarana Prasarana"
                              : type}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">PIC:</label>
                    <select
                      value={form.pic_id}
                      onChange={(e) =>
                        handleChange(mitIndex, "pic_id", e.target.value)
                      }
                      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 hover:cursor-pointer"
                    >
                      {users
                        .filter((u) => u.id === form.pic_id)
                        .map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.name}
                          </option>
                        ))}
                      {users
                        .filter((u) => u.id !== form.pic_id)
                        .map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.name}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium">
                      Deadline:
                    </label>
                    <input
                      type="date"
                      value={form.deadline}
                      onChange={(e) =>
                        handleChange(mitIndex, "deadline", e.target.value)
                      }
                      className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium">
                      Deskripsi:
                    </label>
                    {form.descriptions.map((desc, idx) => (
                      <textarea
                        key={idx}
                        value={desc.description}
                        onChange={(e) =>
                          handleDescriptionChange(mitIndex, idx, e.target.value)
                        }
                        className="w-full rounded-md border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2 resize-y min-h-[80px]"
                      />
                    ))}
                  </div>
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full text-blue-600 border-blue-500 hover:bg-blue-100 hover:cursor-pointer py-2 text-md rounded-lg border transition duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            ))}
          </div>
        </form>
      </div>
    </>
  );
}
