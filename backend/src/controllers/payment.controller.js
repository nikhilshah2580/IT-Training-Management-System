import {
  createPaymentService,
  getPaymentsService,
  getPaymentService,
  getMyPaymentsService,
  updatePaymentStatusService,
  deletePaymentService,
  getPaymentReportService,
} from "../services/payment.service.js";

// Student creates payment
export const createPayment = async (req, res) => {
  const payment = await createPaymentService({
    studentId: req.user._id,
    ...req.body,
  });

  return res.status(201).json({
    success: true,
    message: "Payment created successfully.",
    payment,
  });
};

// Admin gets all payments
export const getPayments = async (req, res) => {
  const { status, paymentMethod, page, limit } = req.query;

  const result = await getPaymentsService({
    status,
    paymentMethod,
    page,
    limit,
  });

  return res.status(200).json({
    success: true,
    ...result,
  });
};

// Get single payment
export const getPayment = async (req, res) => {
  const payment = await getPaymentService(req.params.id);

  if (!payment) {
    const error = new Error("Payment not found.");

    error.statusCode = 404;
    throw error;
  }

  return res.status(200).json({
    success: true,
    payment,
  });
};

// Student gets own payments
export const getMyPayments = async (req, res) => {
  const payments = await getMyPaymentsService(req.user._id);

  return res.status(200).json({
    success: true,
    payments,
  });
};

// Admin updates payment status
export const updatePaymentStatus = async (req, res) => {
  const { paymentStatus } = req.body;

  const allowedStatuses = ["Pending", "Paid", "Failed"];

  if (!allowedStatuses.includes(paymentStatus)) {
    const error = new Error("Invalid payment status.");

    error.statusCode = 400;
    throw error;
  }

  const payment = await updatePaymentStatusService(
    req.params.id,
    paymentStatus,
  );

  if (!payment) {
    const error = new Error("Payment not found.");

    error.statusCode = 404;
    throw error;
  }

  return res.status(200).json({
    success: true,
    message: "Payment status updated successfully.",
    payment,
  });
};

// Admin deletes payment
export const deletePayment = async (req, res) => {
  const payment = await deletePaymentService(req.params.id);

  if (!payment) {
    const error = new Error("Payment not found.");

    error.statusCode = 404;
    throw error;
  }

  return res.status(200).json({
    success: true,
    message: "Payment deleted successfully.",
  });
};

// Admin financial report
export const getPaymentReport = async (req, res) => {
  const report = await getPaymentReportService();

  return res.status(200).json({
    success: true,
    report,
  });
};
