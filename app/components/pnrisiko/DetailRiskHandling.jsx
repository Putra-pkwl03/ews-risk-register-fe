"use client";

import { useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import SpinnerLoader from "../loadings/SpinnerLoader";
import FishboneModal from "../diagram/FishboneModal";
import FishboneChart from "../diagram/FishboneChart";

export default function DetailRiskHandling({ item, onClose }) {
  const [showFishbone, setShowFishbone] = useState(false);
  const [loading, setLoading] = useState(false);

  if (loading)
    return (
      <div className="fixed inset-0 flex justify-center items-center">
        <SpinnerLoader />
      </div>
    );

  const {
    risk,
    effectiveness,
    approval_signature,
    handler,
    reviewer,
    review_notes,
    created_at,
  } = item;

  const causes = risk?.causes || [];
  const mitigations = risk?.mitigations || [];
  const risk_appetite = risk?.risk_appetite;

  return (
    <div className="relative bg-white rounded-xl shadow-md max-w-5xl p-6 mx-auto mt-3">
      <button
        onClick={onClose}
        className="flex items-center text-gray-600 hover:text-gray-800 mb-4 cursor-pointer"
      >
        <ArrowLeftIcon className="w-5 h-5 mr-2 cursor-pointer" />
      </button>

      <h2 className="text-xl font-bold text-center text-gray-800 mb-6">
        Detail Penanganan Risiko
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
        <div className="grid grid-cols-1 gap-4">
          <DetailItem label="Nama Risiko" value={risk?.name} />
          <DetailItem label="Unit" value={risk?.unit} />
          <DetailItem label="Klaster Risiko" value={risk?.cluster} />
        </div>
        <div className="grid grid-cols-1 gap-4">
          <DetailItem label="Kategori Risiko" value={risk?.category} />
          <DetailItem label="Dampak Risiko" value={risk?.impact} />
          <DetailItem label="Deskripsi Risiko" value={risk?.description} />
        </div>
      </div>

      {risk_appetite && (
        <div className="mt-6 mb-4">
          <h3 className="font-semibold text-gray-800 mb-2">Selera Risiko</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
            <DetailItem label="Scoring" value={risk_appetite.scoring} />
            <DetailItem label="Ranking" value={risk_appetite.ranking} />
            <DetailItem label="Keputusan" value={risk_appetite.decision} />
          </div>
        </div>
      )}

      {/* Penyebab */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-800">Penyebab</h3>
          <button
            onClick={() => setShowFishbone(true)}
            className="text-md px-3 py-1 text-blue-500 hover:text-blue-700"
          >
            Lihat Fishbone
          </button>
        </div>
        {causes.length === 0 ? (
          <p className="text-gray-500">Tidak ada penyebab yang tercatat.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {causes.map((cause) => (
              <div
                key={cause.id}
                className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-gray-800"
              >
                <p>
                  <strong>Kategori:</strong> {cause.category}
                </p>
                <p>
                  <strong>Penyebab Utama:</strong> {cause.main_cause}
                </p>
                {cause.sub_causes && cause.sub_causes.length > 0 && (
                  <>
                    <strong>Sub Penyebab:</strong>
                    <ul className="list-disc list-inside mt-1 space-y-1 text-sm">
                      {cause.sub_causes.map((sub) => (
                        <li key={sub.id}>{sub.sub_cause}</li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Mitigasi */}
      <div className="mb-6">
        <h3 className="font-semibold text-gray-800 mb-2">Mitigasi</h3>
        {mitigations.length === 0 ? (
          <p className="text-gray-500">Tidak ada mitigasi yang tercatat.</p>
        ) : (
          <div className="space-y-4">
            {mitigations.map((m) => (
              <div
                key={m.id}
                className="w-full p-4 border border-gray-200 rounded-lg bg-gray-50"
              >
                <p>
                  <strong>Type:</strong> {m.mitigation_type}
                </p>
                <p>
                  <strong>Penanggung Jawab:</strong> {m.pic?.name || "-"}
                </p>
                <p>
                  <strong>Deadline:</strong> {m.deadline || "-"}
                </p>
                <ul className="list-disc ml-4 mt-1">
                  {(m.descriptions || []).map((desc) => (
                    <li key={desc.id}>{desc.description}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 mt-4">
        <div className="grid grid-cols-1 gap-4">
          <DetailItem label="Efektivitas" value={effectiveness} />
          <DetailItem label="Signature" value={approval_signature} />
          <DetailItem label="Handled By" value={handler?.name} />
        </div>
        <div className="grid grid-cols-1 gap-4">
          <DetailItem label="Reviewer" value={reviewer?.name} />
          <DetailItem
            label="Tanggal Penanganan"
            value={new Date(created_at).toLocaleString()}
          />
          <DetailItem label="Review Notes" value={review_notes || "-"} />
        </div>
      </div>
      </div>

      <button
        onClick={onClose}
        className="mt-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl w-full cursor-pointer"
      >
        Tutup Detail
      </button>

      <FishboneModal isOpen={showFishbone} onClose={() => setShowFishbone(false)}>
        <FishboneChart causes={causes} riskName={risk?.name} />
      </FishboneModal>
    </div>
  );
}

function DetailItem({ label, value, spanFull = false }) {
  const isImage =
    typeof value === "string" &&
    (value.startsWith("http") ||
      value.startsWith("/") ||
      value.startsWith("data:image/"));

  return (
    <div className={`${spanFull ? "md:col-span-2" : ""}`}>
      <div className="text-gray-500 font-medium mb-1">{label}</div>
      <div className="p-3 bg-gray-100 rounded-xl">
        {isImage ? (
          <img
            src={value}
            alt={label}
            className="max-h-10"
          />
        ) : (
          value ?? "-"
        )}
      </div>
    </div>
  );
}


