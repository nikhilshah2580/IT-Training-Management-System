import api from "./apiClient";

// Get instructor's courses
export const getMyCourses = async (params = {}) => {
    const response = await api.get("/courses", {
        params,
    });

    return response.data;
};

// Get single course
export const getCourseById = async (id) => {
    const response = await api.get(`/courses/${id}`);

    return response.data;
};

// Create course
export const createCourse = async (data) => {
    const response = await api.post(
        "/courses",
        data
    );

    return response.data;
};

// Update course
export const updateCourse = async (id, data) => {
    const response = await api.put(
        `/courses/${id}`,
        data
    );

    return response.data;
};

// Delete course
export const deleteCourse = async (id) => {
    const response = await api.delete(
        `/courses/${id}`
    );

    return response.data;
};