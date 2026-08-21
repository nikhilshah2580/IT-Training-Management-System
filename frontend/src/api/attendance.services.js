import api from "./apiClient";

export const markAttendance = async (data) => {
  const response = await api.post("/attendance", data);
  return response.data;
};

export const getAttendance = async (params = {}) => {
  const response = await api.get("/attendance", { params });
  return response.data;
};

export const getAttendanceById = async (id) => {
  const response = await api.get(`/attendance/${id}`);
  return response.data;
};

export const updateAttendance = async (id, data) => {
  const response = await api.put(`/attendance/${id}`, data);
  return response.data;
};

export const deleteAttendance = async (id) => {
  const response = await api.delete(`/attendance/${id}`);
  return response.data;
};

export const getMyAttendance = async (params = {}) => {
  const response = await api.get("/attendance/my", { params });
  return response.data;
};

export const getAttendancePercentage = async (params = {}) => {
  const response = await api.get("/attendance/my/percentage", { params });
  return response.data;
};
