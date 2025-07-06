import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoadingSkeleton from "../loadings/LoadingSkeleton";
import { getAllRiskAnalysis } from "../../lib/RiskAnalysis";

export default function RisikoTable({
  isLoading,
  displayedData,
  paginatedData,
  setSelectedRisk,
  setIsDetailMode,
  handleEdit,
  openDeleteModal,
  addedRiskIds,
  setAddedRiskIds,
}) {
  const router = useRouter();

  useEffect(() => {
    const stored = localStorage.getItem("addedRiskIds");
    if (stored) {
      setAddedRiskIds(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("addedRiskIds", JSON.stringify(addedRiskIds));
  }, [addedRiskIds]);

  function generateRandomString(length = 8) {
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  return (
    <table className="w-full text-sm sm:text-base">
      <thead className="bg-gray-100 text-[#5932EA] text-left border-b">
        <tr>
          <th className="p-2">Klaster</th>
          <th className="p-2">Unit</th>
          <th className="p-2">Nama Risiko</th>
          <th className="p-2">Kategori</th>
          <th className="p-2">Deskripsi</th>
          <th className="p-2">Penyebab</th>
          <th className="p-2">Dampak</th>
          <th className="p-2 text-center">UC/C</th>
          <th className="p-2 text-center">Aksi</th>
        </tr>
      </thead>
      <tbody>
        {isLoading ? (
          <tr>
            <td colSpan={9} className="py-4 text-center">
              <LoadingSkeleton />
            </td>
          </tr>
        ) : displayedData.length === 0 ? (
          <tr>
            <td colSpan={9} className="text-center py-4 text-gray-400">
              Tidak ada data ditemukan.
            </td>
          </tr>
        ) : (
          paginatedData.map((item, idx) => {
            const status = item.status;
            const isDisabled =
              addedRiskIds.includes(item.id) ||
              status === "pending" ||
              status === "validated_approved";

            return (
              <tr
                key={item.id}
                className={`text-[12px] text-[#292D32] transition-colors border-b border-gray-200 ${
                  idx % 2 === 0 ? "bg-gray-50" : "bg-gray-100"
                } hover:bg-gray-100`}
              >
                <td className="p-2">{item.cluster}</td>
                <td className="p-2">{item.unit}</td>
                <td className="p-2">{item.name}</td>
                <td className="p-2">{item.category}</td>
                <td className="p-2 max-w-[100px]">
                  <div className="truncate max-w-[200px]">
                    {item.description}
                  </div>
                </td>
                <td className="p-2 text-xs max-w-[250px]">
                  {item.causes?.map((cause) => (
                    <div key={cause.id} className="mb-2">
                      <p>
                        <strong>Kategori :</strong> {cause.category || "Man"}
                      </p>
                      <p className="truncate" title={cause.main_cause}>
                        <strong>Utama :</strong> {cause.main_cause}
                      </p>
                      <p
                        className="truncate"
                        title={cause.sub_causes
                          ?.map((sub) => sub.sub_cause)
                          .join(", ")}
                      >
                        <strong>Sub :</strong>{" "}
                        {cause.sub_causes
                          ?.map((sub) => sub.sub_cause)
                          .join(", ")}
                      </p>
                    </div>
                  ))}
                </td>
                <td className="p-2">{item.impact}</td>
                <td className="p-2 text-center">
                  {item.uc_c === 1 ? "C" : item.uc_c === 0 ? "UC" : item.uc_c}
                </td>
                <td className="p-2 text-sm">
                  <div className="flex flex-row justify-center items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedRisk(item);
                        setIsDetailMode(true);
                        const randomRef = generateRandomString();
                        const params = new URLSearchParams(
                          window.location.search
                        );
                        params.set("ref", randomRef);
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
                        className="h-5 w-5 min-w-[20px] min-h-[20px] hover:opacity-80 hover:cursor-pointer"
                      />
                    </button>
                    <button
                      onClick={() => handleEdit(item)}
                      title="Edit"
                      disabled={isDisabled}
                      className={`${
                        isDisabled ? "cursor-not-allowed opacity-40" : ""
                      }`}
                    >
                      <img
                        src="/icons/edit.svg"
                        alt="Edit Icon"
                        className="h-5 w-5 min-w-[20px] min-h-[20px] hover:opacity-80"
                      />
                    </button>
                    <button
                      onClick={() => openDeleteModal(item.id)}
                      title="Delete"
                      disabled={isDisabled}
                      className={`${
                        isDisabled ? "cursor-not-allowed opacity-40" : ""
                      }`}
                    >
                      <img
                        src="/icons/hapus.svg"
                        alt="Delete Icon"
                        className="h-5 w-5 min-w-[20px] min-h-[20px] hover:opacity-80"
                      />
                    </button>
                    <button
                      onClick={() => {
                        if (isDisabled) return;
                        const updatedIds = [...addedRiskIds, item.id];
                        setAddedRiskIds(updatedIds);
                        const params = new URLSearchParams();
                        params.set("page", "form-analisis");
                        params.set("mode", "add");
                        params.set("riskId", item.id);
                        router.push(`/dashboard?${params.toString()}`);
                      }}
                      title={
                        isDisabled
                          ? "Risiko ini sudah dianalisis atau sedang menunggu persetujuan"
                          : "Tambah Risiko"
                      }
                      disabled={isDisabled}
                      className={`flex items-center gap-1 text-sm px-3 py-1.5 rounded-md border transition-all duration-150 ${
                        isDisabled
                          ? "bg-gray-200 text-gray-400 border-gray-300 cursor-not-allowed"
                          : "border-green-500 text-green-500 hover:bg-green-100 hover:cursor-pointer"
                      }`}
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
                    </button>
                  </div>
                </td>
              </tr>
            );
          })
        )}
      </tbody>
    </table>
  );
}
