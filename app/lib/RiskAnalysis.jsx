import api from "./api";

// Fungsi untuk simpan data analisis risiko (POST)
export async function saveRiskAnalysis(data) {
  try {
    const response = await api.post("/risk-analysis", data);
    return response.data;
  } catch (error) {
    throw new Error("Gagal menyimpan data analisis risiko");
  }
}

// Fungsi baru untuk ambil semua data analisis risiko (GET)
export async function getAllRiskAnalysis() {
  try {
    const response = await api.get("/risk-analysis");
    return response.data;
  } catch (error) {
    throw new Error("Gagal mengambil data analisis risiko");
  }
}

// Kirim analisis risiko ke Koordinator Manajemen Risiko
export async function sendToMenris(id) {
  try {
    const response = await api.post(`/risk-analysis/${id}/send`);
    return response.data;
  } catch (error) {
    throw new Error("Gagal mengirim data ke Koordinator Manajemen Risiko");
  }
}

// Ambil data analisis risiko dengan status pending dan approved
export async function getPendingAndApprovedRiskAnalysis() {
  try {
    const response = await api.get("/risk-analysis/pending-and-approved");
    return response.data;
  } catch (error) {
    throw new Error("Gagal mengambil data analisis risiko pending dan approved");
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


