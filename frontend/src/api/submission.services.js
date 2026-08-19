import api from "./apiClient";

// ======================================================
// CREATE SUBMISSION
// Student submits an assignment
// ======================================================
export const createSubmission = async (data) => {
    const response = await api.post("/submissions", data);

    return response.data;
};

// ======================================================
// GET MY SUBMISSIONS
// Student gets their own submissions
// ======================================================
export const getMySubmissions = async (params = {}) => {
    const response = await api.get("/submissions/my-submissions", {
        params,
    });

    return response.data;
};

// ======================================================
// GET SUBMISSIONS FOR ASSIGNMENT
// Instructor gets submissions for an assignment
// ======================================================
export const getAssignmentSubmissions = async (assignmentId) => {
    const response = await api.get(`/submissions/assignment/${assignmentId}`);

    return response.data;
};

// ======================================================
// GET SINGLE SUBMISSION
// ======================================================
export const getSubmissionById = async (id) => {
    const response = await api.get(`/submissions/${id}`);

    return response.data;
};

// ======================================================
// UPDATE / GRADE SUBMISSION
// Instructor updates student's submission
// ======================================================
export const updateSubmission = async (id, data) => {
    const response = await api.put(`/submissions/${id}`, data);

    return response.data;
};

// ======================================================
// DELETE SUBMISSION
// ======================================================
export const deleteSubmission = async (id) => {
    const response = await api.delete(`/submissions/${id}`);

    return response.data;
};
