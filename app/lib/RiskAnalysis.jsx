import api from "./api";

// Simpan data analisis risiko (POST untuk create, PUT untuk update)
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
      "Gagal menyimpan data analisis risiko";

    throw new Error(message);
  }
}

// Ambil semua data analisis risiko (GET)
export async function getAllRiskAnalysis() {
  try {
    const response = await api.get("/risk-analysis");
    return response.data;
  } catch (error) {
    throw new Error("Gagal mengambil data analisis risiko");
  }
}

// Ambil data analisis risiko berdasarkan ID analisis
export async function fetchRiskAnalysisById(id) {
  try {
    const response = await api.get(`/risk-analysis/${id}`); // pastikan endpoint-nya sesuai
    console.log(response.data);
    return response.data;
  } catch (error) {
    throw new Error("Gagal mengambil data analisis risiko berdasarkan ID analisis");
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

// Kirim analisis risiko ke Koordinator Manajemen Risiko
export async function sendToMenris(id) {
  try {
    const response = await api.post(`/risk-analysis/${id}/send`);
    return response.data;
  } catch (error) {
    // Tangkap pesan error asli dari backend agar bisa digunakan di frontend
    const message =
      error.response?.data?.message ||
      error.message ||
      "Gagal mengirim data ke Koordinator Manajemen Risiko";
    throw new Error(message);
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