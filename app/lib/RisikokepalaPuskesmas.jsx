// File: /lib/pnrisiko/index.js
import api from "../lib/api";

export async function reviewRiskHandling(id, payload) {
  try {
    const res = await api.post(`/risk-handlings/${id}/review`, payload);
    return res.data;
  } catch (error) {
    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Gagal meninjau penanganan risiko";
    throw new Error(message);
  }
}