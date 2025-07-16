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
import Pagination from "../manage-users/Pagenations";
import SuccessToast from "../modalconfirmasi/SuccessToast";
import ErrorToast from "../modalconfirmasi/ErrorToast";

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
  const [loadingId, setLoadingId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;
  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const [filterEfektivitas, setFilterEfektivitas] = useState("All");
  const [sortOrder, setSortOrder] = useState("");
  const [errorToast, setErrorToast] = useState({ isOpen: false, message: "" });
  const [successToast, setSuccessToast] = useState({
    isOpen: false,
    message: "",
  });
  const filteredData = data.filter((item) => {
    if (filterEfektivitas === "All") return true;
    return (
      item.effectiveness &&
      item.effectiveness.trim().toLowerCase() ===
        filterEfektivitas.trim().toLowerCase()
    );
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortOrder === "Ascending") {
      return a.effectiveness.localeCompare(b.effectiveness);
    } else if (sortOrder === "Descending") {
      return b.effectiveness.localeCompare(a.effectiveness);
    }
    return 0;
  });

  // Data yang ditampilkan di halaman saat ini:
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

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
  const handleEfektivitasChange = (e) => {
    setFilterEfektivitas(e.target.value);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  };

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
        <h5 className="text-[18px] sm:text-[20px] text-black font-semibold">
          Penanganan Risiko
        </h5>

        <div className="flex flex-wrap items-center gap-3">
          {/* Filter Efektivitas */}
          <div className="relative inline-flex items-center gap-1 text-sm text-gray-400">
            <span>Filter:</span>
            <select
              value={filterEfektivitas}
              onChange={handleEfektivitasChange}
              className="border border-gray-300 bg-white rounded-md px-2 py-1 text-[12px] text-black text-center hover:cursor-pointer appearance-none focus:outline-none pr-6"
            >
              <option value="All">All</option>
              <option value="Efektif">Efektif</option>
              <option value="Tidak Efektif">Tidak Efektif</option>
              <option value="Kurang Efektif">Kurang Efektif</option>
            </select>
            <img
              src="/icons/chevron-down.svg"
              alt="Filter Icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none"
            />
          </div>

          {/* Sorting */}
          <div className="relative inline-flex items-center gap-1 text-sm text-gray-400">
            <span>Sorting:</span>
            <select
              value={sortOrder}
              onChange={handleSortChange}
              className="border border-gray-300 bg-white rounded-md px-2 py-1 text-[12px] text-black text-center hover:cursor-pointer appearance-none focus:outline-none pr-6"
            >
              <option value="">Default</option>
              <option value="Ascending">Ascending</option>
              <option value="Descending">Descending</option>
            </select>
            <img
              src="/icons/chevron-down.svg"
              alt="Sort Icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 pointer-events-none"
            />
          </div>

          {/* Tombol Add Efektivitas */}
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
            className="flex items-center gap-1 text-xs sm:text-sm border border-green-500 text-green-500 hover:bg-green-100 px-3 py-1.5 rounded-md cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Add Efektivitas
          </button>
        </div>
      </div>

      {error && <p className="text-red-500">{error}</p>}

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
              {totalMitigasiTerlambat} Risiko yang Mitigasinya Lewat dari
              Deadline
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
              <th className="p-2 whitespace-nowrap text-xs sm:text-sm">No</th>
              <th className="p-2 whitespace-nowrap text-xs sm:text-sm">
                Risiko
              </th>
              <th className="p-2 whitespace-nowrap text-xs sm:text-sm">Unit</th>
              <th className="p-2 whitespace-nowrap text-xs sm:text-sm">
                Efektivitas
              </th>
              <th className="p-2 whitespace-nowrap text-xs sm:text-sm">
                Hambatan
              </th>
              <th className="p-2 whitespace-nowrap text-xs sm:text-sm">
                Signature
              </th>
              <th className="p-2 whitespace-nowrap text-xs sm:text-sm">
                Handled By
              </th>
              <th className="p-2 whitespace-nowrap text-xs sm:text-sm">
                Reviewer
              </th>
              <th className="p-2 whitespace-nowrap text-xs sm:text-sm">
                Catatan
              </th>
              <th className="p-2 whitespace-nowrap text-xs sm:text-sm text-center">
                Tanggal
              </th>
              <th className="p-2 whitespace-nowrap text-xs sm:text-sm text-center">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, rowIndex) => (
                <tr key={rowIndex} className="animate-pulse">
                  {Array.from({ length: 10 }).map((_, colIndex) => (
                    <td key={colIndex} className="p-2">
                      <div className="h-4 bg-gray-200 rounded w-full"></div>
                    </td>
                  ))}
                </tr>
              ))
            ) : paginatedData.length === 0 ? (
              <tr className="text-[12px] sm:text-sm">
                <td
                  colSpan={10}
                  className="text-center py-4 text-[12px] text-gray-500"
                >
                  Belum ada data penanganan risiko.
                </td>
              </tr>
            ) : (
              paginatedData.map((item, i) => (
                <tr key={item.id} className="hover:bg-gray-50 text-black">
                  <td className="p-2 text-center text-[12px] sm:text-sm">
                    {(currentPage - 1) * itemsPerPage + i + 1}
                  </td>
                  <td className="p-2 text-[12px] sm:text-sm">
                    {item.risk?.name}
                  </td>
                  <td className="p-2 text-[12px] sm:text-sm">
                    {item.risk?.unit}
                  </td>
                  <td className="p-2 text-center text-[12px] sm:text-sm">
                    {item.effectiveness}
                  </td>
                  <td className="p-2 text-[12px] sm:text-sm">
                    {item.barrier || "-"}
                  </td>
                  <td className="p-2 text-[12px] sm:text-sm">
                    {item.approval_signature ? (
                      <img
                        src={item.approval_signature}
                        alt="Signature"
                        className="h-4 object-contain"
                      />
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="py-2 text-center text-[12px] sm:text-sm">
                    {item.handler?.name || "-"}
                  </td>
                  <td className="py-2 text-center text-[12px] sm:text-sm">
                    {item.reviewer?.name || "-"}
                  </td>
                  <td className="py-2">
                    {item.review_notes ? (
                      <button
                        className="text-red-600 hover:underline cursor-pointer text-[12px] sm:text-sm"
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
                  <td className="py-2 text-center text-[12px] sm:text-sm">
                    {new Date(item.created_at).toLocaleString()}
                  </td>
                  <td className="p-2 text-sm m:p-3 text-center">
                    <div className="flex flex-row justify-center items-center text-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          const params = new URLSearchParams(
                            window.location.search
                          );
                          const newUrl = `${
                            window.location.pathname
                          }?${params.toString()}`;
                          window.history.pushState({}, "", newUrl);
                        }}
                        title="Detail"
                      >
                        <img
                          src="/icons/detail.svg"
                          alt="Detail Icon"
                          className="h-5 w-5 hover:opacity-80 hover:cursor-pointer"
                        />
                      </button>
                      <button
                        onClick={() => {
                          const uniqueRisks = data
                            .map((item) => item.risk)
                            .filter(
                              (risk, index, self) =>
                                index ===
                                self.findIndex((r) => r.id === risk.id)
                            );
                          setRisks(uniqueRisks);
                          setEditingItem(item);
                          setModalOpen(true);
                        }}
                        disabled={
                          item.is_sent &&
                          !(
                            item.is_approved === false || item.is_approved === 0
                          )
                        }
                        title="Edit"
                      >
                        <img
                          src="/icons/edit.svg"
                          alt="Edit Icon"
                          className={`h-5 w-5 ${
                            item.is_sent &&
                            !(
                              item.is_approved === false ||
                              item.is_approved === 0
                            )
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:cursor-pointer"
                          }`}
                        />
                      </button>
                      <button
                        onClick={() => {
                          setDeleteItemId(item.id);
                          setConfirmDeleteOpen(true);
                        }}
                        disabled={
                          item.is_sent &&
                          !(
                            item.is_approved === false || item.is_approved === 0
                          )
                        }
                        title="Delete"
                      >
                        <img
                          src="/icons/hapus.svg"
                          alt="Delete Icon"
                          className={`h-5 w-5 ${
                            item.is_sent &&
                            !(
                              item.is_approved === false ||
                              item.is_approved === 0
                            )
                              ? "opacity-50 cursor-not-allowed"
                              : "hover:cursor-pointer"
                          }`}
                        />
                      </button>
                      <button
                        onClick={() => {
                          setSendItemId(item.id);
                          setConfirmSendOpen(true);
                        }}
                        disabled={
                          (item.is_sent && !item.review_notes) ||
                          loadingId === item.id
                        }
                        title="Kirim ke Kepala Puskesmas"
                        className={`${
                          (item.is_sent && !item.review_notes) ||
                          loadingId === item.id
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:cursor-pointer"
                        }`}
                      >
                        <img
                          src="/icons/sent.svg"
                          alt="Sent"
                          className="h-4 w-4 hover:opacity-80"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
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

      {/* Modal */}
      <AddEffectivenessModal
        isOpen={modalOpen}
        onClose={() => {}}
        editingItem={editingItem}
        onSubmit={async (formData) => {
          try {
            if (editingItem) {
              await updateRiskHandling(editingItem.id, formData);
              setSuccessToast({
                isOpen: true,
                message: "Data berhasil diperbarui",
              });
            } else {
              await createRiskHandling(formData);
              setSuccessToast({
                isOpen: true,
                message: "Data berhasil ditambahkan",
              });
            }
            const updated = await fetchRiskHandlings();
            setData(updated.data);
          } catch (err) {
            setErrorToast({ isOpen: true, message: err.message });
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
            setLoadingId(sendItemId);
            await sendToKepala(sendItemId);
            setSuccessToast({
              isOpen: true,
              message: "Notifikasi berhasil dikirim ke kepala puskesmas.",
            });
            const updated = await fetchRiskHandlings();
            setData(updated.data);
          } catch (err) {
            setErrorToast({ isOpen: true, message: err.message });
          } finally {
            setLoadingId(null);
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
            setSuccessToast({
              isOpen: true,
              message: "Data berhasil dihapus.",
            });
            const updated = await fetchRiskHandlings();
            setData(updated.data);
          } catch (err) {
            setErrorToast({ isOpen: true, message: err.message });
          } finally {
            setConfirmDeleteOpen(false);
            setDeleteItemId(null);
          }
        }}
      />
      <SuccessToast
        message={successToast.message}
        isOpen={successToast.isOpen}
        onClose={() => setSuccessToast({ isOpen: false, message: "" })}
      />
      <ErrorToast
        message={errorToast.message}
        isOpen={errorToast.isOpen}
        onClose={() => setErrorToast({ isOpen: false, message: "" })}
      />
      <ReviewNoteModal
        isOpen={noteModalOpen}
        onClose={() => setNoteModalOpen(false)}
        note={selectedNote}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
        itemsPerPage={itemsPerPage}
        totalItems={totalItems}
      />
    </div>
  );
}
