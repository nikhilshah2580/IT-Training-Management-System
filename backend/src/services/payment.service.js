import Payment from "../models/payment.model.js";
import Course from "../models/course.model.js";
import User from "../models/user.model.js";
import Enrollment from "../models/enrollment.model.js";

const generateInvoiceNumber = () => {
  const timestamp = Date.now();

  const random = Math.floor(1000 + Math.random() * 9000);

  return `INV-${timestamp}-${random}`;
};

// Create payment
export const createPaymentService = async ({
  studentId,
  courseId,
  amount,
  paymentMethod,
  transactionId,
  paymentStatus,
  notes,
}) => {
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

  const existingTransaction = await Payment.findOne({
    transactionId: transactionId.trim(),
  });

  if (existingTransaction) {
    const error = new Error("Transaction ID already exists.");

    error.statusCode = 400;
    throw error;
  }

  const invoiceNumber = generateInvoiceNumber();

  // Payment is pending until an actual gateway/admin confirmation.
  const finalPaymentStatus = "Pending";
  const paidAt = null;

  const payment = await Payment.create({
    student: studentId,
    course: courseId,
    amount,
    paymentMethod,
    transactionId,
    paymentStatus: finalPaymentStatus,
    invoiceNumber,
    paidAt,
    notes,
  });

  return await Payment.findById(payment._id)
    .populate("student", "fullName email phone photo")
    .populate("course", "title fee duration instructor");
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

  return await Payment.findById(id)
    .populate("student", "fullName email phone photo")
    .populate("course", "title fee duration");
};

// Delete payment
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
