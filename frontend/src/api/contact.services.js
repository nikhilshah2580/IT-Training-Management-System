import api from "./apiClient";

// ======================================================
// SEND CONTACT MESSAGE
// Public user
// ======================================================
export const createContact = async (data) => {
    const response = await api.post("/contacts", data);

    return response.data;
};

// ======================================================
// GET ALL CONTACT MESSAGES
// Admin
// ======================================================
export const getContacts = async (params = {}) => {
    const response = await api.get("/contacts", {
        params,
    });

    return response.data;
};

// ======================================================
// GET SINGLE CONTACT MESSAGE
// Admin
// ======================================================
export const getContactById = async (id) => {
    const response = await api.get(`/contacts/${id}`);

    return response.data;
};

// ======================================================
// UPDATE CONTACT STATUS
// Admin
// ======================================================
export const updateContactStatus = async (id, status) => {
    const response = await api.patch(`/contacts/${id}/status`, { status });

    return response.data;
};

// ======================================================
// DELETE CONTACT MESSAGE
// Admin
// ======================================================
export const deleteContact = async (id) => {
    const response = await api.delete(`/contacts/${id}`);

    return response.data;
};
