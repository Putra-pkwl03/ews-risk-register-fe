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
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [searchTerm, setSearchTerm] = useState("");
  const [kategoriFilter, setKategoriFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("");

  const filteredData = risks.filter((item) => {
    const matchSearch = [
      item?.name,
      item?.unit,
      item?.cluster,
      item?.category,
    ].some((field) => field?.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchKategori =
      kategoriFilter === "All" ||
      item.risk_appetite?.decision === kategoriFilter;

    return matchSearch && matchKategori;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (sortOrder === "Ascending") return a.risk_appetite?.scoring - b.risk_appetite?.scoring;
    if (sortOrder === "Descending")
      return b.risk_appetite?.scoring - a.risk_appetite?.scoring;

    return new Date(b.created_at) - new Date(a.created_at);
  });

  const totalItems = filteredData.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const paginatedRisks = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Function to re-fetch validated risks
  const fetchValidatedRisks = async () => {
    setIsLoading(true); // start loading
    try {
      const data = await getValidatedRisks();
      console.log(data);
      setRisks(data);
    } catch (error) {
      console.error(error.message);
    } finally {
      setIsLoading(false); // finished loading
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
        router.push("/dashboard?page=evaluasi-risk");
        return;
      }

      const updatedRisks = await getValidatedRisks();
      setRisks(updatedRisks);
    } catch (error) {
      console.error("Failed to change decision:", error.message);
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
      risks={sortedData}
      onDetailClick={handleDetailClick}
      onOpenControlibility={handleOpenControlibility}
      selectedRisk={selectedRisk}
      modalOpen={modalOpen}
      onCloseModal={handleCloseModal}
      onDecisionChange={handleDecisionChange}
      isLoading={isLoading}
      currentPage={currentPage}
      totalPages={totalPages}
      setCurrentPage={setCurrentPage}
      itemsPerPage={itemsPerPage}
      totalItems={filteredData.length} // sesuai hasil filter
      // Tambahan untuk search + filter
      searchTerm={searchTerm}
      kategoriFilter={kategoriFilter}
      sortOrder={sortOrder}
      setSearchTerm={setSearchTerm}
      setKategoriFilter={setKategoriFilter}
      setSortOrder={setSortOrder}
    />
  );
}
