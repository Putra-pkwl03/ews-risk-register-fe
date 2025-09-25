import api from "./api";

// Save risk analysis data (POST for create, PUT for update)
export async function saveRiskAnalysis(data) {
  try {
    if (data.id) {
      const response = await api.put(`/risk-analysis/${data.id}`, data);
      return response.data;
    } else {
      const response = await api.post("/risk-analysis", data);
      return response.data;
    }
  } catch (error) {
    // Cek apakah error response dari axios ada
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Failed to save risk analysis data";

    throw new Error(message);
  }
}

// Get all risk analysis data (GET)
export async function getAllRiskAnalysis() {
  try {
    const response = await api.get("/risk-analysis");
    return response.data;
  } catch (error) {
    throw new Error("Failed to retrieve risk analysis data");
  }
}

// Get all risk analysis data without role restrictions
export async function getAllRiskAnalysisWithoutLimit() {
  try {
    const response = await api.get("/risk-analysis/all");
    return response.data;
  } catch (error) {
    throw new Error("Failed to retrieve all risk analysis data (without restrictions)");
  }
}


// Get risk analysis data by analysis ID
export async function fetchRiskAnalysisById(id) {
  try {
    const response = await api.get(`/risk-analysis/${id}`); 
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error("Failed to retrieve risk analysis data by analysis ID");
  }
}

export async function deleteRiskAnalysis(id) {
  try {
    const response = await api.delete(`/risk-analysis/${id}`);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || error.message || "Gagal menghapus data";
    throw new Error(message);
  }
}

// Send risk analysis to Risk Management Coordinator
export async function sendToMenris(id) {
  try {
    const response = await api.post(`/risk-analysis/${id}/send`);
    return response.data;
  } catch (error) {
    // Tangkap pesan error asli dari backend agar bisa digunakan di frontend
    const message =
      error.response?.data?.message ||
      error.message ||
      "Failed to send data to Risk Management Coordinator";
    throw new Error(message);
  }
}

// Ambil data analisis risiko dengan status pending dan approved
export async function getPendingAndApprovedRiskAnalysis() {
  try {
    const response = await api.get("/risk-analysis/pending-and-approved");
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message || error.response?.data?.error || error.message ||
      "Failed to fetch pending and approved risk analysis";
    throw new Error(message);
  }
}

// Fungsi untuk memvalidasi risiko (approve/reject)
export async function validateRisk(id, payload) {
  try {
    const response = await api.post(`/risks/${id}/validate`, payload);
    return response.data;
  } catch (error) {
    throw new Error("Gagal memvalidasi risiko");
  }
}

// Ambil data risiko dengan status validated_approved dan validated_rejected
export async function getValidatedRisks() {
  try {
    const response = await api.get("/risk-validations/validated");
    return response.data;
  } catch (error) {
    throw new Error("Gagal mengambil data risiko yang sudah divalidasi");
  }
}


// Simpan data risk appetite (POST)
export async function saveRiskAppetite(data) {
  try {
    const response = await api.post('/risk-appetite', data);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Gagal menyimpan data risk appetite';
    throw new Error(message);
  }
}

// Edit keputusan risk appetite (decision)
export async function editRiskAppetiteDecision(id, decision) {
  try {
    const response = await api.patch(`/risk-appetite/${id}/decision`, { decision });
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Gagal memperbarui keputusan risk appetite';
    throw new Error(message);
  }
}


// Edit nilai controllability risk appetite
export async function editRiskAppetiteControllability(id, controllability) {
  try {
    const response = await api.put(`/risk-appetite/${id}/controllability`, {
      controllability,
    });
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      'Gagal memperbarui controllability risk appetite';
    throw new Error(message);
  }
}
