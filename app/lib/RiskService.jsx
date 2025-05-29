// services/riskService.js

import api from "./api"; 

const RiskService = {
  getAll: async () => {
    const response = await api.get("/risks");
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/risks/${id}`);
    return response.data;
  },

  create: async (data) => {
    const response = await api.post("/risks", data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/risks/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/risks/${id}`);
    return response.data;
  },
};

export default RiskService;