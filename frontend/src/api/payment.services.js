import api from "./apiClient";

// STUDENT - CREATE PAYMENT

export const createPayment = async (data) => {
    try {
        const response = await api.post("/payments", data);

        return response.data;
    } catch (error) {
        console.error("Create payment failed:", error.response?.data || error.message);

        throw error;
    }
};

// STUDENT - GET MY PAYMENTS

export const getMyPayments = async () => {
    try {
        const response = await api.get("/payments/my-payments");

        return response.data;
    } catch (error) {
        console.error("Get my payments failed:", error.response?.data || error.message);

        throw error;
    }
};

// ADMIN - GET ALL PAYMENTS

export const getPayments = async (params = {}) => {
    try {
        const response = await api.get("/payments", {
            params,
        });

        return response.data;
    } catch (error) {
        console.error("Get payments failed:", error.response?.data || error.message);

        throw error;
    }
};

// ADMIN - GET SINGLE PAYMENT

export const getPayment = async (id) => {
    try {
        const response = await api.get(`/payments/${id}`);

        return response.data;
    } catch (error) {
        console.error("Get payment failed:", error.response?.data || error.message);

        throw error;
    }
};


// ADMIN - UPDATE PAYMENT STATUS

export const updatePaymentStatus = async (id, paymentStatus) => {
    try {
        const response = await api.patch(`/payments/${id}/status`, {
            paymentStatus,
        });

        return response.data;
    } catch (error) {
        console.error("Update payment status failed:", error.response?.data || error.message);

        throw error;
    }
};


// ADMIN - DELETE PAYMENT

export const deletePayment = async (id) => {
    try {
        const response = await api.delete(`/payments/${id}`);

        return response.data;
    } catch (error) {
        console.error("Delete payment failed:", error.response?.data || error.message);

        throw error;
    }
};

// ADMIN - PAYMENT REPORT

export const getPaymentReport = async () => {
    try {
        const response = await api.get("/payments/report");

        return response.data;
    } catch (error) {
        console.error("Get payment report failed:", error.response?.data || error.message);

        throw error;
    }
};
