import api from "./apiClient";

// ======================================================
// CREATE ASSIGNMENT
// Instructor creates an assignment for a course
// ======================================================
export const createAssignment = async (data) => {
    const response = await api.post("/assignments", data);

    return response.data;
};

// ======================================================
// GET MY ASSIGNMENTS
// Student gets assignments assigned to them
// ======================================================
export const getMyAssignments = async (params = {}) => {
    const response = await api.get("/assignments/my-assignments", {
        params,
    });

    return response.data;
};

// ======================================================
// GET COURSE ASSIGNMENTS
// Get assignments belonging to a specific course
// ======================================================
export const getCourseAssignments = async (courseId) => {
    const response = await api.get(
        `/assignments/course/${courseId}`
    );

    return response.data;
};

// ======================================================
// GET SINGLE ASSIGNMENT
// ======================================================
export const getAssignmentById = async (id) => {
    const response = await api.get(
        `/assignments/${id}`
    );

    return response.data;
};

// ======================================================
// UPDATE ASSIGNMENT
// Instructor updates an assignment
// ======================================================
export const updateAssignment = async (id, data) => {
    const response = await api.put(
        `/assignments/${id}`,
        data
    );

    return response.data;
};

// ======================================================
// DELETE ASSIGNMENT
// Instructor deletes an assignment
// ======================================================
export const deleteAssignment = async (id) => {
    const response = await api.delete(
        `/assignments/${id}`
    );

    return response.data;
};