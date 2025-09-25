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
  "Failed to fetch risk handling data";

    throw new Error(message);
  }
}

// Ambil semua data risk appetite untuk dahboard
export async function fetchRiskAppetites() {
  try {
    const response = await api.get("/risk-appetites");
    return response.data;
  } catch (error) {
    const message =
  error.response?.data?.message ||
  error.response?.data?.error ||
  error.message ||
  "Failed to fetch risk appetite data";

    throw new Error(message);
  }
}

// endpoin public dashboard 
export async function fetchRiskHandlingspublic() {
  try {
    const response = await api.get("/risk-handlings/all-public");
    return response.data;
  } catch (error) {
    const message =
  error.response?.data?.message ||
  error.response?.data?.error ||
  error.message ||
  "Failed to fetch risk handling data";

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
  "Failed to add risk handling data";

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
  "Failed to send notification to Health Center Head";

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
  "Failed to update risk handling data";

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
  "Failed to delete risk handling data";

    throw new Error(message);
  }
}
  
