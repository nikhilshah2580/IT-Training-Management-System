import api from "./apiClient";

const profileRequestConfig = (data) =>
    data instanceof FormData
        ? { headers: { "Content-Type": "multipart/form-data" } }
        : {};

// ======================================================
// PUBLIC
// GET APPROVED INSTRUCTORS
// GET /instructor-profiles/approved
// ======================================================
export const getApprovedInstructors = async () => {
    const response = await api.get("/instructor-profiles/approved");

    return response.data;
};

// ======================================================
// PUBLIC
// GET SINGLE INSTRUCTOR PROFILE
// GET /instructor-profiles/:id
// ======================================================
export const getInstructorProfile = async (id) => {
    const response = await api.get(`/instructor-profiles/${id}`);

    return response.data;
};

// ======================================================
// INSTRUCTOR
// CREATE PROFILE
// POST /instructor-profiles
// ======================================================
export const createInstructorProfile = async (data) => {
    const response = await api.post(
        "/instructor-profiles",
        data,
        profileRequestConfig(data),
    );

    return response.data;
};

// ======================================================
// INSTRUCTOR
// GET MY PROFILE
// GET /instructor-profiles/me/profile
// ======================================================
export const getMyInstructorProfile = async () => {
    const response = await api.get("/instructor-profiles/me/profile");

    return response.data;
};

// ======================================================
// INSTRUCTOR
// UPDATE MY PROFILE
// PUT /instructor-profiles/me/profile
// ======================================================
export const updateInstructorProfile = async (data) => {
    const response = await api.put(
        "/instructor-profiles/me/profile",
        data,
        profileRequestConfig(data),
    );

    return response.data;
};

// ======================================================
// ADMIN
// GET ALL INSTRUCTOR PROFILES
// GET /instructor-profiles/admin/all
// ======================================================
export const getAllInstructorProfiles = async (params = {}) => {
    const response = await api.get("/instructor-profiles/admin/all", {
        params,
    });

    return response.data;
};

// ======================================================
// ADMIN
// APPROVE INSTRUCTOR
// PATCH /instructor-profiles/admin/:id/approve
// ======================================================
export const approveInstructorProfile = async (id) => {
    const response = await api.patch(`/instructor-profiles/admin/${id}/approve`);

    return response.data;
};

// ======================================================
// ADMIN
// REJECT INSTRUCTOR
// PATCH /instructor-profiles/admin/:id/reject
// ======================================================
export const rejectInstructorProfile = async (id) => {
    const response = await api.patch(`/instructor-profiles/admin/${id}/reject`);

    return response.data;
};

// ======================================================
// ADMIN
// DELETE INSTRUCTOR PROFILE
// DELETE /instructor-profiles/admin/:id
// ======================================================
export const deleteInstructorProfile = async (id) => {
    const response = await api.delete(`/instructor-profiles/admin/${id}`);

    return response.data;
};
