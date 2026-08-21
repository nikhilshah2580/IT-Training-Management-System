import api from "./apiClient";

const assignmentRequestConfig = (data) =>
  data instanceof FormData
    ? { headers: { "Content-Type": "multipart/form-data" } }
    : {};

export const createSubmission = async (data) => {
  const response = await api.post(
    "/submissions",
    data,
    assignmentRequestConfig(data),
  );
  return response.data;
};

export const getMySubmissions = async () => {
  const response = await api.get("/submissions/my");
  return response.data;
};

export const getAssignmentSubmissions = async (assignmentId) => {
  const response = await api.get(`/submissions/assignment/${assignmentId}`);
  return response.data;
};

export const getSubmissionById = async (id) => {
  const response = await api.get(`/submissions/${id}`);
  return response.data;
};

export const gradeSubmission = async (id, data) => {
  const response = await api.patch(`/submissions/${id}/grade`, data);
  return response.data;
};

export const updateSubmission = gradeSubmission;

export const deleteSubmission = async (id) => {
  const response = await api.delete(`/submissions/${id}`);
  return response.data;
};
