import api from "./apiClient";

export const getJobPlacements = async (params = {}) => {
    const response = await api.get("/job-placements", { params });
    return response.data;
};

export const getMyJobPlacements = async () => {
    const response = await api.get("/job-placements/my");
    return response.data;
};

export const getJobPlacement = async (id) => {
    const response = await api.get(`/job-placements/${id}`);
    return response.data;
};

export const createJobPlacement = async (data) => {
    const response = await api.post("/job-placements", data);
    return response.data;
};

export const updateJobPlacement = async (id, data) => {
    const response = await api.put(`/job-placements/${id}`, data);
    return response.data;
};

export const deleteJobPlacement = async (id) => {
    const response = await api.delete(`/job-placements/${id}`);
    return response.data;
};

export const updateJobPlacementStatus = async (id, status) => {
    const response = await api.patch(`/job-placements/${id}/status`, { status });
    return response.data;
};
