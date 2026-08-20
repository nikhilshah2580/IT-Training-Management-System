import api from "./apiClient";

export const getAuditLogs = async (params = {}) => {
  const response = await api.get("/audit-logs", { params });
  return response.data;
};
