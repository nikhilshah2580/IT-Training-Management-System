import crypto from "crypto";
import PDFDocument from "pdfkit";
import Payment from "../models/payment.model.js";
import Course from "../models/course.model.js";
import User from "../models/user.model.js";
import Enrollment from "../models/enrollment.model.js";
import { notifyAdmins, notifyCourseInstructor, notifyUser } from "../utils/notificationEvents.js";

export const generateInvoicePdf = async ({
  invoiceNumber,
  student,
  course,
  amount,
  paymentMethod,
  transactionId,
  paymentStatus,
  paidAt,
}) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(26).text("Invoice", { align: "center" });
    doc.moveDown(1.2);
    doc.fontSize(12).text(`Invoice No: ${invoiceNumber || "N/A"}`);
    doc.text(`Status: ${paymentStatus || "Pending"}`);
    doc.text(`Student: ${student?.fullName || "Student"}`);
    doc.text(`Course: ${course?.title || "Course"}`);
    doc.text(`Payment Method: ${paymentMethod || "N/A"}`);
    doc.text(`Transaction ID: ${transactionId || "N/A"}`);
    doc.text(`Amount: Rs. ${Number(amount || 0).toFixed(2)}`);
    doc.text(
      `Paid At: ${paidAt ? new Date(paidAt).toLocaleString() : "Not paid yet"}`,
    );
    doc.moveDown(1.5);
    doc.text("Thank you for your payment." , { align: "center" });
    doc.end();
  });
};

const generateInvoiceNumber = () => {
  const timestamp = Date.now();
  const random = Math.floor(1000 + Math.random() * 9000);

  return `INV-${timestamp}-${random}`;
};

const generateEsewaTransactionUuid = (studentId) => {
  const timestamp = Date.now();
  const random = crypto.randomBytes(6).toString("hex");

  return `ESEWA-${timestamp}-${studentId.toString().slice(-6)}-${random}`;
};

const getEsewaConfig = () => ({
  endpoint:
    process.env.ESEWA_PAYMENT_URL ||
    "https://rc-epay.esewa.com.np/api/epay/main/v2/form",
  productCode: process.env.ESEWA_PRODUCT_CODE || "EPAYTEST",
  secretKey: process.env.ESEWA_SECRET_KEY || "8gBm/:&EnhH.1/q",
  frontendUrl: process.env.FRONTEND_URL || "http://localhost:5173",
});

const signEsewaPayload = ({ totalAmount, transactionUuid, productCode }) => {
  const { secretKey } = getEsewaConfig();
  const message = `total_amount=${totalAmount},transaction_uuid=${transactionUuid},product_code=${productCode}`;

  return crypto.createHmac("sha256", secretKey).update(message).digest("base64");
};

const decodeEsewaData = (data) => {
  try {
    return JSON.parse(Buffer.from(data, "base64").toString("utf8"));
  } catch {
    const error = new Error("Invalid eSewa response data.");
    error.statusCode = 400;
    throw error;
  }
};

const verifyEsewaResponseSignature = (responseData) => {
  const { secretKey } = getEsewaConfig();
  const signedFieldNames = responseData.signed_field_names;
  const signature = responseData.signature;

  if (!signedFieldNames || !signature) {
    const error = new Error("eSewa signature data is missing.");
    error.statusCode = 400;
    throw error;
  }

  const message = signedFieldNames
    .split(",")
    .map((fieldName) => `${fieldName}=${responseData[fieldName] ?? ""}`)
    .join(",");
  const expectedSignature = crypto
    .createHmac("sha256", secretKey)
    .update(message)
    .digest("base64");

  if (signature !== expectedSignature) {
    const error = new Error("Invalid eSewa payment signature.");
    error.statusCode = 400;
    throw error;
  }
};

const assertStudentCanPayCourse = async ({ studentId, courseId }) => {
  const student = await User.findById(studentId);

  if (!student) {
    const error = new Error("Student not found.");
    error.statusCode = 404;
    throw error;
  }

  if (student.role !== "student") {
    const error = new Error("Only students can make course payments.");
    error.statusCode = 403;
    throw error;
  }

  const course = await Course.findById(courseId);

  if (!course) {
    const error = new Error("Course not found.");
    error.statusCode = 404;
    throw error;
  }

  if (course.status !== "Active") {
    const error = new Error("Payment cannot be made for an inactive course.");
    error.statusCode = 400;
    throw error;
  }

  const enrollment = await Enrollment.findOne({
    student: studentId,
    course: courseId,
  });

  if (!enrollment) {
    const error = new Error(
      "You must enroll in this course before making a payment.",
    );
    error.statusCode = 400;
    throw error;
  }

  if (enrollment.status === "Cancelled") {
    const error = new Error("Cancelled enrollments cannot be paid.");
    error.statusCode = 400;
    throw error;
  }

  return { course, enrollment, student };
};

// Create payment
export const createPaymentService = async ({
  studentId,
  courseId,
  amount,
  paymentMethod,
  transactionId,
  notes,
}) => {
  const { course } = await assertStudentCanPayCourse({ studentId, courseId });

  if (!transactionId?.trim()) {
    const error = new Error("Transaction ID is required.");
    error.statusCode = 400;
    throw error;
  }

  if (Number(amount) !== Number(course.fee)) {
    const error = new Error("Payment amount must match the course fee.");
    error.statusCode = 400;
    throw error;
  }

  const existingTransaction = await Payment.findOne({
    transactionId: transactionId.trim(),
  });

  if (existingTransaction) {
    const error = new Error("Transaction ID already exists.");
    error.statusCode = 400;
    throw error;
  }

  const invoiceNumber = generateInvoiceNumber();

  const payment = await Payment.create({
    student: studentId,
    course: courseId,
    amount,
    paymentMethod,
    transactionId,
    paymentStatus: "Pending",
    invoiceNumber,
    paidAt: null,
    notes,
  });

  return await Payment.findById(payment._id)
    .populate("student", "fullName email phone photo")
    .populate("course", "title fee duration instructor");
};

export const initiateEsewaPaymentService = async ({ studentId, courseId }) => {
  const { course } = await assertStudentCanPayCourse({ studentId, courseId });
  const amount = Number(course.fee || 0);
  const { endpoint, productCode, frontendUrl } = getEsewaConfig();
  const totalAmount = amount.toFixed(2);

  const paidPayment = await Payment.findOne({
    student: studentId,
    course: courseId,
    paymentStatus: "Paid",
  });

  if (paidPayment) {
    const error = new Error("This course payment is already completed.");
    error.statusCode = 400;
    throw error;
  }

  const transactionUuid = generateEsewaTransactionUuid(studentId);
  const invoiceNumber = generateInvoiceNumber();

  const payment = await Payment.create({
    student: studentId,
    course: courseId,
    amount,
    paymentMethod: "eSewa",
    transactionId: transactionUuid,
    paymentStatus: "Pending",
    invoiceNumber,
    notes: "eSewa payment initiated.",
  });

  const formData = {
    amount: totalAmount,
    tax_amount: "0",
    total_amount: totalAmount,
    transaction_uuid: transactionUuid,
    product_code: productCode,
    product_service_charge: "0",
    product_delivery_charge: "0",
    success_url: `${frontendUrl}/student/payment/success`,
    failure_url: `${frontendUrl}/student/payment/failure?paymentId=${payment._id}`,
    signed_field_names: "total_amount,transaction_uuid,product_code",
    signature: signEsewaPayload({
      totalAmount,
      transactionUuid,
      productCode,
    }),
  };

  return {
    payment,
    esewa: {
      endpoint,
      formData,
    },
  };
};
export const verifyEsewaPaymentService = async ({ data }) => {
  if (!data) {
    const error = new Error("eSewa response data is required.");
    error.statusCode = 400;
    throw error;
  }

  const responseData = decodeEsewaData(data);
  verifyEsewaResponseSignature(responseData);

  const transactionId = responseData.transaction_uuid;
  const status = String(responseData.status || "").toUpperCase();

  if (!transactionId) {
    const error = new Error("Transaction UUID missing from eSewa response.");
    error.statusCode = 400;
    throw error;
  }

  const payment = await Payment.findOne({ transactionId });

  if (!payment) {
    const error = new Error("Payment not found.");
    error.statusCode = 404;
    throw error;
  }

  const nextStatus = status === "COMPLETE" ? "Paid" : "Failed";

  return await updatePaymentStatusService(payment._id, nextStatus);
};

// Get all payments
export const getPaymentsService = async ({
  status,
  paymentMethod,
  page = 1,
  limit = 10,
}) => {
  const query = {};

  if (status) {
    query.paymentStatus = status;
  }

  if (paymentMethod) {
    query.paymentMethod = paymentMethod;
  }

  const pageNumber = Math.max(Number(page) || 1, 1);
  const limitNumber = Math.min(Math.max(Number(limit) || 10, 1), 100);
  const skip = (pageNumber - 1) * limitNumber;

  const [payments, total] = await Promise.all([
    Payment.find(query)
      .populate("student", "fullName email phone photo")
      .populate("course", "title fee duration")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber),

    Payment.countDocuments(query),
  ]);

  return {
    payments,
    pagination: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    },
  };
};

// Get single payment
export const getPaymentService = async (id) => {
  return await Payment.findById(id)
    .populate("student", "fullName email phone photo")
    .populate("course", "title fee duration instructor");
};

// Get logged-in student's payments
export const getMyPaymentsService = async (studentId) => {
  return await Payment.find({
    student: studentId,
  })
    .populate("course", "title fee duration instructor")
    .sort({ createdAt: -1 });
};

// Update payment status
export const updatePaymentStatusService = async (id, paymentStatus) => {
  const payment = await Payment.findById(id);

  if (!payment) {
    return null;
  }

  payment.invoiceNumber = payment.invoiceNumber || generateInvoiceNumber();
  payment.paymentStatus = paymentStatus;

  if (paymentStatus === "Paid") {
    payment.paidAt = payment.paidAt || new Date();
  } else {
    payment.paidAt = null;
  }

  await payment.save();

  const enrollment = await Enrollment.findOne({
    student: payment.student,
    course: payment.course,
  });

  if (enrollment) {
    enrollment.paymentStatus = paymentStatus;
    if (paymentStatus === "Paid" && enrollment.status !== "Completed") {
      enrollment.status = "Active";
    }
    if (paymentStatus === "Failed" && enrollment.status === "Active") {
      enrollment.status = "Pending";
    }
    await enrollment.save();
  }

  const populatedPayment = await Payment.findById(id)
    .populate("student", "fullName email phone photo")
    .populate("course", "title fee duration instructor");

  const studentName = populatedPayment?.student?.fullName || "A student";
  const courseTitle = populatedPayment?.course?.title || "a course";
  const statusText = paymentStatus === "Paid" ? "successful" : "failed";

  await notifyUser({
    userId: payment.student,
    title: paymentStatus === "Paid" ? "Payment successful" : "Payment failed",
    message: `Your payment for ${courseTitle} was ${statusText}.`,
    type: "payment",
    referenceId: payment._id,
    referenceModel: "Payment",
  });

  await notifyAdmins({
    sender: payment.student,
    title: paymentStatus === "Paid" ? "Payment received" : "Payment failed",
    message: `${studentName}'s payment for ${courseTitle} was ${statusText}.`,
    type: "payment",
    referenceId: payment._id,
    referenceModel: "Payment",
  });

  await notifyCourseInstructor({
    course: populatedPayment?.course,
    sender: payment.student,
    title: paymentStatus === "Paid" ? "Student payment completed" : "Student payment failed",
    message: `${studentName}'s payment for ${courseTitle} was ${statusText}.`,
    type: "payment",
    referenceId: payment._id,
    referenceModel: "Payment",
  });

  return populatedPayment;
};

// Delete payment
export const getPaymentInvoiceService = async (id, actor) => {
  const payment = await Payment.findById(id)
    .populate("student", "fullName email photo")
    .populate("course", "title fee duration")
    .populate("course.instructor", "fullName");

  if (!payment) {
    const error = new Error("Payment not found.");
    error.statusCode = 404;
    throw error;
  }

  if (actor?.role === "student") {
    if (payment.student._id.toString() !== actor._id.toString()) {
      const error = new Error("You can only view your own payment invoice.");
      error.statusCode = 403;
      throw error;
    }
  }

  return payment;
};

export const deletePaymentService = async (id) => {
  return await Payment.findByIdAndDelete(id);
};

// Financial report
export const getPaymentReportService = async () => {
  const [
    totalPayments,
    paidPayments,
    pendingPayments,
    failedPayments,
    revenueResult,
  ] = await Promise.all([
    Payment.countDocuments(),

    Payment.countDocuments({
      paymentStatus: "Paid",
    }),

    Payment.countDocuments({
      paymentStatus: "Pending",
    }),

    Payment.countDocuments({
      paymentStatus: "Failed",
    }),

    Payment.aggregate([
      {
        $match: {
          paymentStatus: "Paid",
        },
      },
      {
        $group: {
          _id: null,
          totalRevenue: {
            $sum: "$amount",
          },
        },
      },
    ]),
  ]);

  return {
    totalPayments,
    paidPayments,
    pendingPayments,
    failedPayments,
    totalRevenue: revenueResult[0]?.totalRevenue || 0,
  };
};




