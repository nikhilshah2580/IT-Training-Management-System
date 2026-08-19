import api from "./apiClient";

// ======================================================
// CREATE RESOURCE
// Instructor adds a resource
// ======================================================
export const createResource = async (data) => {
    const response = await api.post("/resources", data);

    return response.data;
};

// ======================================================
// GET ALL RESOURCES
// ======================================================
export const getResources = async (params = {}) => {
    const response = await api.get("/resources", {
        params,
    });

    return response.data;
};

// ======================================================
// GET COURSE RESOURCES
// ======================================================
export const getCourseResources = async (courseId) => {
    const response = await api.get(`/resources/course/${courseId}`);

    return response.data;
};

// ======================================================
// GET SINGLE RESOURCE
// ======================================================
export const getResourceById = async (id) => {
    const response = await api.get(`/resources/${id}`);

    return response.data;
};

// ======================================================
// UPDATE RESOURCE
// ======================================================
export const updateResource = async (id, data) => {
    const response = await api.put(`/resources/${id}`, data);

    return response.data;
};

// ======================================================
// DELETE RESOURCE
// ======================================================
export const deleteResource = async (id) => {
    const response = await api.delete(`/resources/${id}`);

    return response.data;
};
