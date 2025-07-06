"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Layout from "./Layout";
import api from "../lib/api";

import ManageUsers from "../components/manage-users/ManageUsers";
import IdentifikasiRisikoTable from "../components/IdentifikasiRisk/IdentifikasiRisk";
import AnalisisRisiko from "../components/AnalisisRisiko/AnalisisRisiko";
import FormAnalisis from "../components/AnalisisRisiko/FormAnalisis";
import RiskActionMenris from "../components/AnalisisRisiko/RiskAnalysisMenris";
import PenangananRisiko from "../components/penangananrisiko/PenangananRisiko";
import EvaluasiRisiko from "../components/evaluasi/EvaluasiRisiko";
import AddMitigation from "../components/evaluasi/AddMitigations"; 
import EditMitigation from "../components/evaluasi/EditMitigations";
import DetailRiskMitigation from "../components/evaluasi/DetailRiskMitigation";
import Pnrisiko from "../components/pnrisiko/pnrisiko";
import Risikokepalapuskesmas from "../components/managementrisiko/RisikokepalaPuskesmas";
import DownloadLaporan from "../components/Laporan/DownloadLaporan";
import WelcomeDashboard from "../components/dashboard/WelcomeDashboard"; 


export default function Dashboard() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "";

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const [notifCount, setNotifCount] = useState(0);
  const [resetAt, setResetAt] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || token === "undefined" || token.trim() === "") {
      router.replace("/login");
    } else {
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      api
        .get("/me")
        .then((res) => {
          setUser(res.data);
          setLoading(false);
        })
        .catch(() => {
          router.replace("/login");
        });
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-white">
        <div className="flex flex-col items-center gap-4 animate-pulse">
          <div className="w-10 h-10 border-4 border-blue-500 border-dashed rounded-full animate-spin" />
          <p className="text-gray-700 text-sm">Memuat data pengguna...</p>
        </div>
      </div>
    );
  }

  // Parsing page untuk evaluasi-risiko
  if (page.startsWith("evaluasi-risiko")) {
    const parts = page.split("/");

    if (parts.length === 1) {
      return (
        <Layout
          notifCount={notifCount}
          setNotifCount={setNotifCount}
          resetAt={resetAt}
          setResetAt={setResetAt}
          role={user?.role}
        >
          <EvaluasiRisiko />
        </Layout>
      );
    }

    if (parts.length === 3 && parts[2] === "detail") {
      const riskId = parts[1];
      return (
        <Layout
          notifCount={notifCount}
          setNotifCount={setNotifCount}
          resetAt={resetAt}
          setResetAt={setResetAt}
          role={user?.role}
        >
          <DetailRiskMitigation riskId={riskId} />
        </Layout>
      );
    }

    if (parts.length === 4 && parts[2] === "edit-mitigations") {
      const mitigationId = parts[3];
      return (
        <Layout
          notifCount={notifCount}
          setNotifCount={setNotifCount}
          resetAt={resetAt}
          setResetAt={setResetAt}
          role={user?.role}
        >
          <EditMitigation mitigationId={mitigationId} />
        </Layout>
      );
    }

    if (parts.length === 3 && parts[2] === "add-mitigations") {
      const riskId = parts[1];
      return (
        <Layout
          notifCount={notifCount}
          setNotifCount={setNotifCount}
          resetAt={resetAt}
          setResetAt={setResetAt}
          role={user?.role}
        >
          <AddMitigation riskId={riskId} />
        </Layout>
      );
    }
  }

  // Mapping halaman utama lainnya
  return (
    <Layout
      notifCount={notifCount}
      setNotifCount={setNotifCount}
      resetAt={resetAt}
      setResetAt={setResetAt}
      role={user?.role}
    >
      {page === "manage-users" ? (
        <ManageUsers />
      ) : page === "identifikasi-risiko" ? (
        <IdentifikasiRisikoTable />
      ) : page === "analisis-risiko" ? (
        <AnalisisRisiko />
      ) : page === "form-analisis" ? (
        <FormAnalisis />
      ) : page === "analisis-risiko-menris" ? (
        <RiskActionMenris />
      ) : page === "penanganan-risiko" ? (
        <PenangananRisiko />
      ) : page === "menu-penanganan-risiko" ? (
        <Pnrisiko />
      ) : page === "manajemen-risiko" ? (
        <Risikokepalapuskesmas />
      ) : page === "download-laporan" ? (
        <DownloadLaporan />
      ) : (
        <WelcomeDashboard /> 
      )}
    </Layout>
  );
}
