import api from "./apiClient";

// STUDENT - CREATE PAYMENT
export const createPayment = async (data) => {
  const response = await api.post("/payments", data);
  return response.data;
};

// STUDENT - GET OWN PAYMENTS
export const getMyPayments = async () => {
  const response = await api.get("/payments/my-payments");
  return response.data;
};

// ADMIN - GET ALL PAYMENTS
export const getPayments = async (params = {}) => {
  const response = await api.get("/payments", { params });
  return response.data;
};

// ADMIN - GET SINGLE PAYMENT
export const getPaymentById = async (id) => {
  const response = await api.get(`/payments/${id}`);
  return response.data;
};

// ADMIN - UPDATE PAYMENT STATUS
export const updatePaymentStatus = async (id, paymentStatus) => {
  const response = await api.patch(`/payments/${id}/status`, {
    paymentStatus,
  });
  return response.data;
};

// ADMIN - DELETE PAYMENT
export const deletePayment = async (id) => {
  const response = await api.delete(`/payments/${id}`);
  return response.data;
};

// ADMIN - PAYMENT REPORT
export const getPaymentReport = async () => {
  const response = await api.get("/payments/report");
  return response.data;
};
