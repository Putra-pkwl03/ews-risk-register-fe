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

import {
  EyeIcon,
  PencilSquareIcon,
  TrashIcon,
  PaperAirplaneIcon,
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

  useEffect(() => {
    fetchRiskHandlings()
      .then((res) => setData(res.data))
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

  return (
    <div className="p-6 bg-white rounded shadow-md overflow-x-auto relative">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Penanganan Risiko</h1>
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
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          + Add Efektivitas
        </button>
      </div>

      {loading && <p>Memuat data...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && data.length === 0 && (
        <p className="text-gray-500">Belum ada data penanganan risiko.</p>
      )}

      {data.length > 0 && (
        <table className="min-w-full bg-white text-sm text-left border rounded">
          <thead className="bg-gray-100 text-gray-700 uppercase">
            <tr>
              <th className="px-4 py-2 border">No</th>
              <th className="px-4 py-2 border">Risiko</th>
              <th className="px-4 py-2 border">Unit</th>
              <th className="px-4 py-2 border">Efektivitas</th>
              <th className="px-4 py-2 border">Signature</th>
              <th className="px-4 py-2 border">Handled By</th>
              <th className="px-4 py-2 border">Reviewer</th>
              <th className="px-4 py-2 border">Tanggal</th>
              <th className="px-4 py-2 border text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, i) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 border">{i + 1}</td>
                <td className="px-4 py-2 border">{item.risk?.name}</td>
                <td className="px-4 py-2 border">{item.risk?.unit}</td>
                <td className="px-4 py-2 border">{item.effectiveness}</td>
                <td className="px-4 py-2 border">
                  {item.approval_signature || "-"}
                </td>
                <td className="px-4 py-2 border">
                  {item.handler?.name || "-"}
                </td>
                <td className="px-4 py-2 border">
                  {item.reviewer?.name || "-"}
                </td>
                <td className="px-4 py-2 border">
                  {new Date(item.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-2 border text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <button
                      onClick={() => setSelectedItem(item)}
                      className="text-blue-600 hover:text-blue-800"
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
                        setEditingItem(item); // ? kirim item ke modal
                        setModalOpen(true);
                      }}
                      className="text-yellow-500 hover:text-yellow-700"
                      title="Edit"
                    >
                      <PencilSquareIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        setDeleteItemId(item.id);
                        setConfirmDeleteOpen(true);
                      }}
                      className="text-red-600 hover:text-red-800"
                      title="Hapus"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => {
                        setSendItemId(item.id);
                        setConfirmSendOpen(true);
                      }}
                      className="text-green-600 hover:text-green-800"
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
    </div>
  );
}
