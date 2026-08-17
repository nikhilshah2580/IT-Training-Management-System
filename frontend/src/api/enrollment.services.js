import api from "./apiClient";

// STUDENT - CREATE ENROLLMENT

export const createEnrollment = async (courseId) => {
    const response = await api.post("/enrollments", {
        courseId,
    });

    return response.data;
};

// STUDENT - GET MY ENROLLMENTS

export const getMyEnrollments = async () => {
    const response = await api.get("/enrollments/my");

    return response.data;
};


// INSTRUCTOR GET ENROLLMENTS
export const getInstructorEnrollments = async (params = {}) => {
    const response = await api.get("/enrollments/instructor", {params, });

    return response.data;
};

// ADMIN - GET ALL ENROLLMENTS

export const getEnrollments = async (params = {}) => {
    const response = await api.get("/enrollments", {
        params,
    });

    return response.data;
};


// ADMIN - GET SINGLE ENROLLMENT

export const getEnrollmentById = async (id) => {
    const response = await api.get(`/enrollments/${id}`);

    return response.data;
};


// ADMIN - UPDATE ENROLLMENT STATUS

export const updateEnrollmentStatus = async (id, status) => {
    const response = await api.patch(`/enrollments/${id}/status`, {
        status,
    });

    return response.data;
};


// ADMIN - UPDATE PAYMENT STATUS

export const updateEnrollmentPaymentStatus = async (id, paymentStatus) => {
    const response = await api.patch(`/enrollments/${id}/payment-status`, {
        paymentStatus,
    });

    return response.data;
};

// ADMIN / INSTRUCTOR - UPDATE PROGRESS

export const updateEnrollmentProgress = async (id, progress) => {
    const response = await api.patch(`/enrollments/${id}/progress`, {
        progress,
    });

    return response.data;
};


// ADMIN - CANCEL ENROLLMENT

export const cancelEnrollment = async (id) => {
    const response = await api.patch(`/enrollments/${id}/cancel`);

    return response.data;
};
