import api from "./apiClient";

// ======================================================
// CREATE / ISSUE CERTIFICATE
// ======================================================
export const createCertificate = async (data) => {
    const response = await api.post("/certificates", data);

    return response.data;
};

// ======================================================
// GET ALL CERTIFICATES
// Admin
// ======================================================
export const getCertificates = async (params = {}) => {
    const response = await api.get("/certificates", {
        params,
    });

    return response.data;
};

// ======================================================
// GET SINGLE CERTIFICATE
// ======================================================
export const getCertificateById = async (id) => {
    const response = await api.get(`/certificates/${id}`);

    return response.data;
};

// ======================================================
// GET MY CERTIFICATES
// Student
// ======================================================
export const getMyCertificates = async () => {
    const response = await api.get("/certificates/my");

    return response.data;
};

// ======================================================
// VERIFY CERTIFICATE
// Public certificate verification
// ======================================================
export const verifyCertificate = async (verificationCode) => {
    const response = await api.get(`/certificates/verify/${verificationCode}`);

    return response.data;
};

// ======================================================
// UPDATE CERTIFICATE
// ======================================================
export const updateCertificate = async (id, data) => {
    const response = await api.put(`/certificates/${id}`, data);

    return response.data;
};

// ======================================================
// DELETE CERTIFICATE
// ======================================================
export const deleteCertificate = async (id) => {
    const response = await api.delete(`/certificates/${id}`);

    return response.data;
};
