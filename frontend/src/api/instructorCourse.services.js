import api from "./apiClient";

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
    const response = await api.post("/courses", data);
    return response.data;
};

// INSTRUCTOR - UPDATE OWN COURSE
export const updateCourse = async (id, data) => {
    const response = await api.put(`/courses/${id}`, data);
    return response.data;
};

// INSTRUCTOR - DELETE OWN COURSE
export const deleteCourse = async (id) => {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
};
