import api from "./apiClient";

const courseRequestConfig = (data) =>
    data instanceof FormData
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : {};
// PUBLIC - GET ACTIVE COURSES
export const getCourses = async (params = {}) => {
    const response = await api.get("/courses", { params });
    return response.data;
};

// ADMIN - GET ALL COURSES
export const getAdminCourses = async (params = {}) => {
    const response = await api.get("/courses/admin/all", { params });
    return response.data;
};

// INSTRUCTOR - GET OWN COURSES
export const getMyCourses = async (params = {}) => {
    const response = await api.get("/courses/my", { params });
    return response.data;
};

// GET SINGLE COURSE
export const getCourseById = async (id) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
};

// INSTRUCTOR - CREATE COURSE
export const createCourse = async (data) => {
    const response = await api.post("/courses", data, courseRequestConfig(data));
    return response.data;
};

// ADMIN / INSTRUCTOR - UPDATE COURSE
export const updateCourse = async (id, data) => {
    const response = await api.put(`/courses/${id}`, data, courseRequestConfig(data));
    return response.data;
};

// ADMIN / INSTRUCTOR - DELETE COURSE
export const deleteCourse = async (id) => {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
};

// ADMIN - APPROVE COURSE
export const approveCourse = async (id) => {
    const response = await api.patch(`/courses/${id}/approve`);
    return response.data;
};

// ADMIN - REJECT COURSE
export const rejectCourse = async (id) => {
    const response = await api.patch(`/courses/${id}/reject`);
    return response.data;
};

// ADMIN - UPDATE COURSE STATUS
export const updateCourseStatus = async (id, status) => {
    const response = await api.patch(`/courses/${id}/status`, { status });
    return response.data;
};

