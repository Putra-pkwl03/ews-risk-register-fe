import api from "./api";

// Simpan mitigasi risiko (create new mitigation)
export async function saveRiskMitigation(data) {
  try {
    const response = await api.post("/risk-mitigations", data);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Gagal menyimpan mitigasi risiko";

    throw new Error(message);
  }
}


export async function getAllRiskMitigations() {
  try {
    const response = await api.get("/risk-mitigations");
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Gagal mengambil data mitigasi risiko";

    throw new Error(message);
  }
}

//get mitigationby riskid
export async function getMitigationsByRiskId(riskId) {
  try {
    const response = await api.get(`/risk-mitigations/risk/${riskId}`);
    return response.data; 
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Gagal mengambil mitigasi risiko";
    throw new Error(message);
  }
}


// Update mitigasi risiko by id
export async function updateRiskMitigation(id, data) {
  try {
    const response = await api.put(`/risk-mitigations/${id}`, data);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Gagal memperbarui mitigasi risiko";
    throw new Error(message);
  }
}


// Ambil data lengkap risk beserta analisisnya by analysis ID
export async function getCompleteRiskAnalysisById(riskId) {
  try {
    const response = await api.get(`/risk-analysis/by-risk/${riskId}/complete`);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Gagal mengambil data analisis risiko lengkap";
    throw new Error(message);
  }
}


