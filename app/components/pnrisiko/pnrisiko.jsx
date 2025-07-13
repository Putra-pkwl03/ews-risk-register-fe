// File: app/dashboard/pnrisiko/page.js
"use client";

import { useEffect, useState } from "react";
import {
  fetchRiskHandlings,
  createRiskHandling,
  sendToKepala,
  updateRiskHandling,
  deleteRiskHandling,
} from "../../lib/pnrisiko";
import AddEffectivenessModal from "../pnrisiko/EffectivitasModal";
import DetailRiskHandling from "../pnrisiko/DetailRiskHandling";
import ConfirmSendModal from "../../components/modalconfirmasi/SentKepalapuskesmasModal";
import ConfirmDeleteModal from "../../components/modalconfirmasi/DeleteModal";
import ReviewNoteModal from "../managementrisiko/RiviewNoteModal"; 

import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  PaperAirplaneIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";

export default function Pnrisiko() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [risks, setRisks] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [confirmSendOpen, setConfirmSendOpen] = useState(false);
  const [sendItemId, setSendItemId] = useState(null);
    const [editingItem, setEditingItem] = useState(null);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [deleteItemId, setDeleteItemId] = useState(null);
    const [noteModalOpen, setNoteModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [detailMitigasi, setDetailMitigasi] = useState([]);


  // useEffect(() => {
  //   console.log(data)
  //   fetchRiskHandlings()
  //     .then((res) => setData(res.data))
  //     .catch((err) => setError(err.message))
  //     .finally(() => setLoading(false));
  // }, []);

  useEffect(() => {
    fetchRiskHandlings()
      .then((res) => {
        setData(res.data);
         console.log("? Data hasil fetchRiskHandlings:", res.data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (selectedItem) {
    return (
      <DetailRiskHandling
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
      />
    );
  }

// INFO START LOGIC
  const risikoBelumDitangani = data.filter((item) => {
    if (!item || !item.effectiveness || item.is_sent === 0) {
      return true;
    }
    return false;
  });

  const totalRisiko = data.length;
  const totalBelumDitangani = risikoBelumDitangani.length;
  const persen = Math.round((totalBelumDitangani / totalRisiko) * 100);

const today = new Date();

const mitigasiLewatDeadline = data.filter((item) => {
  const risk = item.risk;
  if (!risk || !Array.isArray(risk.mitigations)) return false;

  return risk.mitigations.some((mitigasi) => {
    const deadline = new Date(mitigasi.deadline);
    return deadline < today;
  });
});
  const totalMitigasiTerlambat = mitigasiLewatDeadline.length;
  // INFO END

const handleShowDetail = () => {
  const detail = [];

  mitigasiLewatDeadline.forEach((item) => {
    const risk = item.risk;
    if (!risk || !Array.isArray(risk.mitigations)) return;

    risk.mitigations.forEach((mitigasi) => {
      const deadline = new Date(mitigasi.deadline);
      if (deadline < today) {
        detail.push({
          name: risk.name,
          unit: risk.unit,
          cluster: risk.cluster,
          deadline: mitigasi.deadline, 
        });
      }
    });
  });

  setDetailMitigasi(detail);
  setShowModal(true);
};



  return (
    <div className="bg-white rounded-sm shadow-gray-200 shadow-xl p-4 mb-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
        <h5 className="text-[20px] text-black font-semibold">
          Penanganan Risiko
        </h5>
        <button
          onClick={() => {
            const uniqueRisks = data
              .map((item) => item.risk)
              .filter(
                (risk, index, self) =>
                  index === self.findIndex((r) => r.id === risk.id)
              );
            setRisks(uniqueRisks);
            setModalOpen(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 w-full sm:w-auto cursor-pointer"
        >
          + Add Efektivitas
        </button>
      </div>

      {loading && <p>Memuat data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && data.length === 0 && (
        <p className="text-gray-500">Belum ada data penanganan risiko.</p>
      )}

      {/* INFO START*/}
      {totalBelumDitangani > 0 && (
        <div className="animate-pulse  bg-red-50 text-red-700 px-2 py-1 rounded-lg shadow mb-4 flex items-center justify-between w-full max-w-sm">
          <div>
            <strong className="block text-sm font-semibold">
              {totalBelumDitangani} Risiko Belum Ditangani
            </strong>
            <span className="text-xs">
              Segera isi penanganan ({persen}% dari total)
            </span>
          </div>
          <span className="text-xs bg-red-100 text-red-600 font-bold px-2 py-1 rounded-full">
            {persen}%
          </span>
        </div>
      )}
      {totalMitigasiTerlambat > 0 && (
        <button
          onClick={handleShowDetail}
          className="text-left  bg-yellow-50 text-yellow-800 px-2 py-1 rounded-lg shadow mb-4 flex items-center justify-between w-full max-w-sm hover:bg-yellow-200 transition cursor-pointer"
        >
          <div>
            <strong className="block text-sm font-semibold">
              {totalMitigasiTerlambat} Risiko yang Mitigasinya Lewat dari Deadline
            </strong>
            <div className="ml-3">
              <span className="text-xs">
                {/* Melebihi tanggal: {today.toISOString().slice(0, 10)} */}
              </span>
              <p className="text-[11px] text-gray-400 italic">
                Klik untuk Detailnya
              </p>
            </div>
          </div>
          <span className="bg-yellow-100 text-yellow-700 font-bold p-1 rounded-full">
            <ExclamationTriangleIcon className="w-5 h-5" />
          </span>
        </button>
      )}
      {/* END INFO HERE */}

      {data.length > 0 && (
        <table className="w-full text-sm sm:text-base">
          <thead className="bg-gray-100 text-[#5932EA] text-left border-b">
            <tr>
              <th className="p-2">No</th>
              <th className="p-2">Risiko</th>
              <th className="p-2">Unit</th>
              <th className="p-2">Efektivitas</th>
              <th className="p-2">Signature</th>
              <th className="p-2">Handled By</th>
              <th className="p-2">Reviewer</th>
              <th className="p-2">Catatan</th>
              <th className="p-2">Tanggal</th>
              <th className="p-2 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="p-2">{i + 1}</td>
                <td className="p-2">{item.risk?.name}</td>
                <td className="p-2">{item.risk?.unit}</td>
                <td className="p-2">{item.effectiveness}</td>
                <td className="p-2">
                  {item.approval_signature ? (
                    <img
                      src={item.approval_signature}
                      alt="Signature"
                      className="h-12 object-contain"
                    />
                  ) : (
                    "-"
                  )}
                </td>
                <td className="py-2 ">{item.handler?.name || "-"}</td>
                <td className="py-2 ">{item.reviewer?.name || "-"}</td>
                <td className="py-2 ">
                  {item.review_notes ? (
                    <button
                      className="text-red-600 hover:underline cursor-pointer"
                      onClick={() => {
                        setSelectedNote(item.review_notes);
                        setNoteModalOpen(true);
                      }}
                    >
                      {item.review_notes.split(" ").slice(0, 3).join(" ") +
                        "..."}
                    </button>
                  ) : (
                    "-"
                  )}
                </td>
                <td className="py-2">
                  {new Date(item.created_at).toLocaleString()}
                </td>
                <td className="p-2 text-sm m:p-3">
                  <div className="flex flex-row justify-center items-center gap-2">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="text-blue-600 hover:text-blue-800 cursor-pointer"
                      title="Detail"
                    >
                      <EyeIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        const uniqueRisks = data
                          .map((item) => item.risk)
                          .filter(
                            (risk, index, self) =>
                              index === self.findIndex((r) => r.id === risk.id)
                          );
                        setRisks(uniqueRisks);
                        setEditingItem(item);
                        setModalOpen(true);
                      }}
                      disabled={
                        item.is_sent &&
                        !(item.is_approved === false || item.is_approved === 0)
                      }
                      className={`text-yellow-500 hover:text-yellow-700 ${
                        item.is_sent &&
                        !(item.is_approved === false || item.is_approved === 0)
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                      title="Edit"
                    >
                      <PencilSquareIcon className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => {
                        setDeleteItemId(item.id);
                        setConfirmDeleteOpen(true);
                      }}
                      disabled={
                        item.is_sent &&
                        !(item.is_approved === false || item.is_approved === 0)
                      }
                      className={`text-red-600 hover:text-red-800 ${
                        item.is_sent &&
                        !(item.is_approved === false || item.is_approved === 0)
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                      title="Hapus"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>

                    <button
                      onClick={() => {
                        setSendItemId(item.id);
                        setConfirmSendOpen(true);
                      }}
                      disabled={item.is_sent && !item.review_notes}
                      className={`text-green-600 hover:text-green-800 ${
                        item.is_sent && !item.review_notes
                          ? "opacity-50 cursor-not-allowed"
                          : "cursor-pointer"
                      }`}
                      title="Kirim ke Kepala Puskesmas"
                    >
                      <PaperAirplaneIcon className="w-5 h-5 rotate-45" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* MODAL INFO START */}
      {showModal && (
        <div
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center"
          onClick={() => setShowModal(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 w-full max-w-md shadow-lg transition-transform transform scale-100 hover:scale-100"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold mb-4 text-gray-800 flex items-center gap-2">
              <ExclamationTriangleIcon className="w-5 h-5 text-yellow-500" />
              Mitigasi Lewat Deadline
            </h3>

            <ul className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {detailMitigasi.map((item, index) => (
                <li
                  key={index}
                  className="text-sm text-gray-700 border-b pb-2 flex flex-col gap-1"
                >
                  <span className="font-semibold text-gray-800">
                    {item.name}
                  </span>
                  <span className="text-xs text-gray-500 italic">
                    {item.unit} / {item.cluster}
                  </span>
                  <span className="text-xs text-red-600 font-medium">
                    Deadline: {item.deadline}
                  </span>
                </li>
              ))}
            </ul>

            <p className="text-[11px] text-center text-gray-400 mt-4 italic">
              Klik di luar area untuk menutup
            </p>
          </div>
        </div>
      )}
      {/* MODAL END */}

      <AddEffectivenessModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingItem(null);
        }}
        editingItem={editingItem}
        onSubmit={async (formData) => {
          try {
            if (editingItem) {
              await updateRiskHandling(editingItem.id, formData);
            } else {
              await createRiskHandling(formData);
            }

            const updated = await fetchRiskHandlings();
            setData(updated.data);
          } catch (err) {
            alert(err.message);
          } finally {
            setModalOpen(false);
            setEditingItem(null);
          }
        }}
      />

      <ConfirmSendModal
        isOpen={confirmSendOpen}
        onClose={() => {
          setConfirmSendOpen(false);
          setSendItemId(null);
        }}
        onConfirm={async () => {
          try {
            await sendToKepala(sendItemId);
            alert("Notifikasi berhasil dikirim ke kepala puskesmas.");
            const updated = await fetchRiskHandlings();
            setData(updated.data);
          } catch (err) {
            alert(err.message);
          } finally {
            setConfirmSendOpen(false);
            setSendItemId(null);
          }
        }}
      />

      <ConfirmDeleteModal
        isOpen={confirmDeleteOpen}
        onClose={() => {
          setConfirmDeleteOpen(false);
          setDeleteItemId(null);
        }}
        onConfirm={async () => {
          try {
            await deleteRiskHandling(deleteItemId);
            const updated = await fetchRiskHandlings();
            setData(updated.data);
          } catch (err) {
            alert(err.message);
          } finally {
            setConfirmDeleteOpen(false);
            setDeleteItemId(null);
          }
        }}
      />

      <ReviewNoteModal
        isOpen={noteModalOpen}
        onClose={() => setNoteModalOpen(false)}
        note={selectedNote}
      />
    </div>
  );
}
