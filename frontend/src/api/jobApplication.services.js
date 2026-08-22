import api from "./apiClient";

export const createJobApplication = async (data) => {
  const response = await api.post("/job-applications", data, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const getJobApplications = async (params = {}) => {
  const response = await api.get("/job-applications", { params });
  return response.data;
};

export const updateJobApplicationStatus = async (id, status) => {
  const response = await api.patch(`/job-applications/${id}/status`, { status });
  return response.data;
};

export const deleteJobApplication = async (id) => {
  const response = await api.delete(`/job-applications/${id}`);
  return response.data;
};
