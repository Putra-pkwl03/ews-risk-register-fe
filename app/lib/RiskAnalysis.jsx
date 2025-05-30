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
