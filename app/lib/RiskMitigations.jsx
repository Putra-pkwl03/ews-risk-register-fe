import api from "./api";

// Save risk mitigation (create new mitigation)
export async function saveRiskMitigation(data) {
  try {
    const response = await api.post("/risk-mitigations", data);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Failed to save risk mitigation";

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
      "Failed to retrieve risk mitigation data";

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
      "Failed to retrieve risk mitigation";
    throw new Error(message);
  }
}


// Update risk mitigation by id
export async function updateRiskMitigation(id, data) {
  try {
    const response = await api.put(`/risk-mitigations/${id}`, data);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to update risk mitigation";
    throw new Error(message);
  }
}


// Get complete risk data along with its analysis by analysis ID
export async function getCompleteRiskAnalysisById(riskId) {
  try {
    const response = await api.get(`/risk-analysis/by-risk/${riskId}/complete`);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to retrieve complete risk analysis data";
    throw new Error(message);
  }
}

// Delete risk mitigation by id
export async function deleteRiskMitigation(id) {
  try {
    const response = await api.delete(`/risk-mitigations/${id}`);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Gagal menghapus mitigasi";
    throw new Error(message);
  }
}

