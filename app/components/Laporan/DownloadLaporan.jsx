"use client";

import React, { useState, useEffect } from "react";
import RiskService from "../../lib/RiskService";
import { getAllRiskAnalysis } from "../../lib/RiskAnalysis";
import { getAllRiskMitigations } from "../../lib/RiskMitigations";
import { FILE_LABELS } from "../../utils/laporanUtils";
import SpinnerLoader from "../loadings/SpinnerLoader";
import LaporanSection from "./LaporanSection";

const laporanList = [
  {
    key: "identifikasi-risiko",
    dataKey: "identifikasi",
  },
  {
    key: "analisis-risiko",
    dataKey: "analisis",
  },
  {
    key: "evaluasi-risiko",
    dataKey: "mitigasi",
  },
];

const DownloadLaporan = () => {
  const [laporanData, setLaporanData] = useState({
    identifikasi: [],
    analisis: [],
    mitigasi: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const risksRes = await RiskService.getAll();
        const risks = risksRes?.data ?? [];

        const analysisRes = await getAllRiskAnalysis();
        const analysis = analysisRes?.data ?? [];

        const mitigasiRes = await getAllRiskMitigations();
        const mitigasi = mitigasiRes?.data ?? [];

        console.log("Identifikasi:", risks);
        console.log("Analisis:", analysis);
        console.log("Mitigasi:", mitigasi);

        setLaporanData({
          identifikasi: risks,
          analisis: analysis,
          mitigasi: mitigasi,
        });
      } catch (error) {
        console.error("Gagal ambil data laporan:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAll();
  }, []);  

  if (loading) {
    return (
      <div className="fixed inset-0 flex justify-center items-center bg-white overflow-hidden">
        <SpinnerLoader />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-10 space-y-12 text-black">
      <h1 className="text-2xl font-bold text-black mb-6">Laporan Risiko</h1>

      {laporanList.map((laporan) => (
        <LaporanSection
          key={laporan.key}
          title={FILE_LABELS[laporan.key]}
          data={laporanData[laporan.dataKey] || []}
          filename={laporan.key}
        />
      ))}
    </div>
  );
};

export default DownloadLaporan;
