import api from "./apiClient";

// GET ALL COURSES
export const getCourses = async (params = {}) => {
    const response = await api.get("/courses", {
        params,
    });

    return response.data;
};

// GET SINGLE COURSE
export const getCourseById = async (id) => {
    const response = await api.get(`/courses/${id}`);

    return response.data;
};

// CREATE COURSE
export const createCourse = async (data) => {
    const response = await api.post("/courses", data);

    return response.data;
};

// UPDATE COURSE
export const updateCourse = async (id, data) => {
    const response = await api.put(`/courses/${id}`, data);

    return response.data;
};

// DELETE COURSE
export const deleteCourse = async (id) => {
    const response = await api.delete(`/courses/${id}`);

    return response.data;
};

// APPROVE COURSE
export const approveCourse = async (id) => {
    const response = await api.patch(`/courses/${id}/approve`);

    return response.data;
};

// REJECT COURSE
export const rejectCourse = async (id) => {
    const response = await api.patch(`/courses/${id}/reject`);

    return response.data;
};

// UPDATE COURSE STATUS
export const updateCourseStatus = async (id, status) => {
    const response = await api.patch(`/courses/${id}/status`, { status });

    return response.data;
};
