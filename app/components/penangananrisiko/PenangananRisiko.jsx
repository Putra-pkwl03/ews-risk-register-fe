"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  getValidatedRisks,
  editRiskAppetiteDecision,
} from "../../lib/RiskAnalysis";
import RiskDetail from "../../components/penangananrisiko/RiskValidatedDetil";
import RiskList from "../../components/penangananrisiko/RiskList";

export default function PenangananRisiko() {
  const [risks, setRisks] = useState([]);
  const [selectedRisk, setSelectedRisk] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const router = useRouter();
  const searchParams = useSearchParams();

  // Fungsi fetch ulang data risiko
  const fetchValidatedRisks = async () => {
    try {
      const data = await getValidatedRisks();
      console.log(data)
      setRisks(data);
    } catch (error) {
      console.error(error.message);
    }
  };

  useEffect(() => {
    fetchValidatedRisks();
  }, []);

  const handleCloseModal = (updated, updatedRisk) => {
    setModalOpen(false);
    setSelectedRisk(null);
    if (updated) {
      fetchValidatedRisks();
    }
  };

  const handleDetailClick = (risk) => {
    setSelectedRisk(risk);
    const randomStr = Math.random().toString(36).substring(2, 10);
    router.push(`?page=penanganan-risiko&detail=${risk.id}-${randomStr}`);
  };

  const handleBackFromDetail = () => {
    setSelectedRisk(null);
    router.push(`?page=penanganan-risiko`);
  };

  const handleOpenControlibility = (risk) => {
    setSelectedRisk(risk);
    setModalOpen(true);
  };

  const handleDecisionChange = async (riskAppetiteId, decision) => {
    try {
      await editRiskAppetiteDecision(riskAppetiteId, decision);
      if (decision === "mitigated") {
        router.push("/dashboard?page=evaluasi-risiko");
        return;
      }

      const updatedRisks = await getValidatedRisks();
      setRisks(updatedRisks);
    } catch (error) {
      console.error("Gagal mengubah keputusan:", error.message);
    }
  };

  if (selectedRisk && !modalOpen) {
    return (
      <div className="p-4">
        <RiskDetail risk={selectedRisk} onBack={handleBackFromDetail} />
      </div>
    );
  }

  return (
    <RiskList
      risks={risks}
      onDetailClick={handleDetailClick}
      onOpenControlibility={handleOpenControlibility}
      selectedRisk={selectedRisk}
      modalOpen={modalOpen}
      onCloseModal={handleCloseModal}
      onDecisionChange={handleDecisionChange}
    />
  );
}
