"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { getCompleteRiskAnalysisById } from "../../lib/RiskMitigations";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import SpinnerLoader from "../loadings/SpinnerLoader";
import FishboneModal from "../diagram/FishboneModal";
import FishboneChart from "../diagram/FishboneChart";

const gradingColors = {
  "sangat tinggi": "bg-red-800 text-white",
  tinggi: "bg-red-500 text-white",
  sedang: "bg-yellow-400 text-white",
  rendah: "bg-green-700 text-white",
  "sangat rendah": "bg-green-400 text-white",
};

export default function DetailRiskMitigation() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pageParam = searchParams.get("page");
  const riskId = pageParam?.split("/")[1];

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  const [showFishbone, setShowFishbone] = useState(false);

  useEffect(() => {
    if (!riskId) {
      console.warn("riskId tidak ditemukan di URL");
      return;
    }

    setLoading(true);
    setError(null);

    getCompleteRiskAnalysisById(riskId)
      .then((response) => {
        if (!response || !response.risk) {
          setError("Data tidak ditemukan.");
          setData(null);
        } else {
          setData(response);
        }
      })
      .catch(() => {
        setError("Terjadi kesalahan saat mengambil data.");
        setData(null);
      })
      .finally(() => setLoading(false));
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
  if (!data) return <div className="p-4 text-center">Data tidak tersedia.</div>;

  const {
    severity,
    probability,
    score,
    grading,
    risk: {
      name,
      cluster,
      unit,
      category,
      description,
      impact,
      causes = [],
      mitigations = [],
      validations = [],
      risk_appetite,
    },
  } = data;

  const gradingColorClass =
    gradingColors[grading?.toLowerCase()] || "bg-gray-400 text-white";

  return (
    <div className="relative bg-white rounded-xl shadow-md max-w-5xl p-6 mx-auto">
      <button
        onClick={() => router.push("/dashboard?page=evaluasi-risiko")}
        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 mb-6 cursor-pointer"
        aria-label="Kembali"
      >
        <ArrowLeftIcon className="h-5 w-5" />
      </button>

      <h2 className="text-xl font-bold text-gray-800 mb-6 text-center">
        Detail Risiko & Mitigasi
      </h2>

      <div className="grid grid-cols-3 gap-4 text-sm text-gray-700 mb-8">
        {/* Baris 1 */}
        <DetailItem label="Nama Risiko" value={name} />
        <DetailItem label="Klaster" value={cluster} />
        <DetailItem label="Unit" value={unit} />

        {/* Baris 2 */}
        <DetailItem label="Kategori" value={category} />
        <DetailItem label="Dampak" value={impact || "-"} />
        <DetailItem label="Severity" value={severity ?? "-"} />

        {/* Baris 3 */}
        <DetailItem label="Probability" value={probability ?? "-"} />
        <DetailItem label="Score" value={score ?? "-"} />
        <DetailItem
          label="Grading"
          custom={
            <span
              className={`capitalize text-[12px] font-medium px-2 py-2 flex justify-center items-center rounded-md border ${gradingColorClass}`}
            >
              {grading || "-"}
            </span>
          }
        />

        {/* Baris 4 - Deskripsi full */}
        <DetailItem label="Deskripsi" value={description || "-"} spanFull />
      </div>

      {/* Risk Appetite section */}
      {risk_appetite && (
        <div className="mb-8">
          <h3 className="font-semibold text-gray-800 mb-2">Selera Risiko</h3>
          <div className="grid grid-cols-3 gap-4 text-sm text-gray-700">
            <DetailItem label="Scoring" value={risk_appetite.scoring} />
            <DetailItem label="Ranking" value={risk_appetite.ranking} />
            <DetailItem label="Keputusan" value={risk_appetite.decision} />
          </div>
        </div>
      )}

      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-gray-800">Penyebab</h3>
          <button
            onClick={() => setShowFishbone(true)}
            className="text-md px-3 py-1  text-blue-500 hover:text-blue-700"
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
                <div className="mb-2">
                  <strong className="text-[16px] font-semibold">
                    Kategori:
                  </strong>{" "}
                  <span className="capitalize text-[14px]">
                    {cause.category}
                  </span>
                </div>
                <div className="mb-2">
                  <strong className="text-[16px] font-semibold">
                    Penyebab Utama:
                  </strong>{" "}
                  <span className="capitalize text-[14px]">
                    {cause.main_cause}
                  </span>
                </div>
                {cause.sub_causes && cause.sub_causes.length > 0 && (
                  <div className="ml-4 mt-3 text-[14px] text-gray-600 font-semibold">
                    <strong>Sub Penyebab:</strong>
                    <ul className="list-disc list-inside mt-1 space-y-1 text-[14px]">
                      {cause.sub_causes.map((sub) => (
                        <li key={sub.id}>{sub.sub_cause}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mb-6">
        <h3 className="mb-2 font-semibold text-gray-800">Mitigasi</h3>
        {mitigations.length === 0 ? (
          <p className="text-gray-500">Tidak ada mitigasi yang tercatat.</p>
        ) : (
          <div className="space-y-4">
            {/* Baris pertama: 2 card */}
            <div className="flex justify-center gap-4">
              {mitigations.slice(0, 2).map((m) => (
                <div
                  key={m.id}
                  className="w-full max-w-xl p-4 border border-gray-200 rounded-lg bg-gray-50"
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

            {mitigations.length > 2 && (
              <div className="flex justify-center">
                <div
                  key={mitigations[2].id}
                  className="w-full max-w-xl p-4 border border-gray-200 rounded-lg bg-gray-50"
                >
                  <p>
                    <strong>Type:</strong> {mitigations[2].mitigation_type}
                  </p>
                  <p>
                    <strong>Penanggung Jawab:</strong>{" "}
                    {mitigations[2].pic?.name || "-"}
                  </p>
                  <p>
                    <strong>Deadline:</strong> {mitigations[2].deadline || "-"}
                  </p>
                  <ul className="list-disc ml-4 mt-1">
                    {(mitigations[2].descriptions || []).map((desc) => (
                      <li key={desc.id}>{desc.description}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <button
        onClick={() => router.push("/dashboard?page=evaluasi-risiko")}
        className="mt-6 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl w-full hover:cursor-pointer"
      >
        Tutup Detail
      </button>

      {/* {validations.length > 0 && (
        <div>
          <h3 className="mb-2 font-semibold text-gray-800">Validasi</h3>
          {validations.map((val) => (
            <div
              key={val.id}
              className="p-3 border border-gray-200 rounded-lg mb-3 bg-gray-50"
            >
              <p>
                <strong>Validator:</strong> {val.validator?.name || "-"}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                {val.is_approved ? (
                  <span className="text-green-600 font-semibold">
                    Disetujui
                  </span>
                ) : (
                  <span className="text-red-600 font-semibold">Ditolak</span>
                )}
              </p>
              {val.notes && (
                <p>
                  <strong>Catatan:</strong> {val.notes}
                </p>
              )}
            </div>
          ))}
        </div>
      )} */}

      <FishboneModal
        isOpen={showFishbone}
        onClose={() => setShowFishbone(false)}
      >
        <FishboneChart causes={causes} riskName={name} />
      </FishboneModal>
    </div>
  );
}

function DetailItem({ label, value, custom, spanFull = false }) {
  return (
    <div className={`${spanFull ? "md:col-span-2" : ""}`}>
      <div className="text-gray-500 font-medium mb-1">{label}</div>
      {custom ? (
        custom
      ) : (
        <div className="p-3 bg-gray-100 rounded-xl">{value ?? "-"}</div>
      )}
    </div>
  );
}
