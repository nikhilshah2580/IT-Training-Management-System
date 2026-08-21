import api from "./apiClient";

export const getDashboard = async () => {
  const response = await api.get("/dashboard");
  return response.data;
};

export const getInstructorDashboard = async () => {
  const response = await api.get("/dashboard/instructor");
  return response.data;
};
