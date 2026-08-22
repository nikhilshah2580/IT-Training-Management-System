import {
  createPaymentService,
  initiateEsewaPaymentService,
  verifyEsewaPaymentService,
  getPaymentsService,
  getPaymentService,
  getMyPaymentsService,
  getPaymentInvoiceService,
  deletePaymentService,
  getPaymentReportService,
  generateInvoicePdf,
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

export const initiateEsewaPayment = async (req, res) => {
  const result = await initiateEsewaPaymentService({
    studentId: req.user._id,
    courseId: req.body.courseId,
  });

  return res.status(201).json({
    success: true,
    message: "eSewa payment initiated successfully.",
    ...result,
  });
};

export const verifyEsewaPayment = async (req, res) => {
  const payment = await verifyEsewaPaymentService({
    data: req.body.data,
  });

  return res.status(200).json({
    success: true,
    message: "eSewa payment verified successfully.",
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

export const downloadPaymentInvoice = async (req, res) => {
  const payment = await getPaymentInvoiceService(req.params.id, req.user);

  const pdfBuffer = await generateInvoicePdf({
    invoiceNumber: payment.invoiceNumber,
    student: payment.student,
    course: payment.course,
    amount: payment.amount,
    paymentMethod: payment.paymentMethod,
    transactionId: payment.transactionId,
    paymentStatus: payment.paymentStatus,
    paidAt: payment.paidAt,
  });

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename="invoice-${payment.invoiceNumber || payment._id}.pdf"`,
  );

  return res.send(pdfBuffer);
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
