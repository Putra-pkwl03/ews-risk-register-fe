"use client";

import { useEffect, useState } from "react";
import { fetchRiskHandlings } from "../../lib/pnrisiko";
import DetailRiskHandling from "../pnrisiko/DetailRiskHandling";
import ReviewModal from "../managementrisiko/ReviewModal"; 
import ReviewNoteModal from "../managementrisiko/RiviewNoteModal"; 
import { EyeIcon, CheckCircleIcon } from "@heroicons/react/24/outline";

export default function Risikokepalapuskesmas() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedReviewItem, setSelectedReviewItem] = useState(null);
  const [noteModalOpen, setNoteModalOpen] = useState(false);
const [selectedNote, setSelectedNote] = useState("");


  useEffect(() => {
    fetchRiskHandlings()
      .then((res) => {
        const filtered = res.data.filter((item) => item.is_sent);
        setData(filtered);
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

  return (
    <div className="p-6 bg-white rounded shadow-md overflow-x-auto relative">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Manajemen Risiko</h1>
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
              <th className="px-4 py-2 border">Catatan</th>
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
                  {item.approval_signature ? (
                    <img
                      src={item.approval_signature}
                      alt="Tanda Tangan"
                      className="h-10 object-contain"
                    />
                  ) : (
                    "-"
                  )}
                </td>
                <td className="px-4 py-2 border">
                  {item.handler?.name || "-"}
                </td>
                <td className="px-4 py-2 border">
                  {item.reviewer?.name || "-"}
                </td>
                <td className="px-4 py-2 border">
                  {item.review_notes ? (
                    <button
                      className="text-red-600 hover:underline "
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

                <td className="px-4 py-2 border">
                  {new Date(item.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-2 border text-center">
                  <button
                    onClick={() => setSelectedItem(item)}
                    className="text-blue-600 hover:text-blue-800 cursor-pointer"
                    title="Detail"
                  >
                    <EyeIcon className="w-5 h-5 mx-auto" />
                  </button>
                  <button
                    onClick={() => {
                      setSelectedReviewItem(item);
                      setReviewModalOpen(true);
                    }}
                    className={`${
                      (item.is_approved === null ||
                        item.is_approved === false) &&
                      item.is_sent
                        ? "text-green-700 hover:text-green-900 cursor-pointer"
                        : "text-gray-400 cursor-not-allowed"
                    }`}
                    title="Tindak Lanjut"
                    disabled={
                      !(
                        (item.is_approved === null ||
                          item.is_approved === false) &&
                        item.is_sent
                      )
                    }
                  >
                    <CheckCircleIcon className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <ReviewModal
        isOpen={reviewModalOpen}
        onClose={() => {
          setReviewModalOpen(false);
          setSelectedReviewItem(null);
          fetchRiskHandlings()
            .then((res) => {
              const filtered = res.data.filter((item) => item.is_sent);
              setData(filtered);
            })
            .catch((err) => setError(err.message));
        }}
        item={selectedReviewItem}
      />

      <ReviewNoteModal
        isOpen={noteModalOpen}
        onClose={() => setNoteModalOpen(false)}
        note={selectedNote}
      />
    </div>
  );
}
