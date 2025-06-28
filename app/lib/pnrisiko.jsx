// File: /lib/pnrisiko/index.js
import api from "../lib/api";

// Ambil semua data penanganan risiko
export async function fetchRiskHandlings() {
  try {
    const response = await api.get("/risk-handlings");
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Gagal mengambil data penanganan risiko";

    throw new Error(message);
  }
}

export async function createRiskHandling(data) {
  try {
    const response = await api.post("/risk-handlings", data);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Gagal menambahkan data penanganan risiko";

    throw new Error(message);
  }
}

export async function sendToKepala(id) {
  try {
    const response = await api.post(`/risk-handlings/${id}/send`);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Gagal mengirim notifikasi ke kepala puskesmas";

    throw new Error(message);
  }
}

export async function updateRiskHandling(id, data) {
  try {
    const response = await api.put(`/risk-handlings/${id}`, data);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Gagal mengupdate data penanganan risiko";

    throw new Error(message);
  }
}

export async function deleteRiskHandling(id) {
  try {
    const response = await api.delete(`/risk-handlings/${id}`);
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Gagal menghapus data penanganan risiko";

    throw new Error(message);
  }
}
  
