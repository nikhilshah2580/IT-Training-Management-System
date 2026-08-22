import crypto from "crypto";
import PDFDocument from "pdfkit";
import Certificate from "../models/certificate.model.js";
import User from "../models/user.model.js";
import Course from "../models/course.model.js";
import Enrollment from "../models/enrollment.model.js";
import { notifyAdmins, notifyUser } from "../utils/notificationEvents.js";

export const generateCertificatePdf = async ({
  certificateNumber,
  verificationCode,
  student,
  course,
  issuedBy,
  issueDate,
  completionDate,
  grade,
}) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks = [];

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(28).text("Certificate of Completion", { align: "center" });
    doc.moveDown(1.5);
    doc.fontSize(14).text("This certifies that", { align: "center" });
    doc.moveDown(0.8);
    doc.fontSize(24).text(student?.fullName || "Student Name", {
      align: "center",
      bold: true,
    });
    doc.moveDown(0.8);
    doc
      .fontSize(14)
      .text(
        `has successfully completed the course "${course?.title || "Course Name"}".`,
        { align: "center" },
      );
    doc.moveDown(1.2);
    doc.fontSize(12).text(`Final Grade: ${grade ?? "N/A"} / 100`);
    doc.text(`Certificate No.: ${certificateNumber || "N/A"}`);
    doc.text(`Verification Code: ${verificationCode || "N/A"}`);
    doc.text(
      `Issued Date: ${issueDate ? new Date(issueDate).toLocaleDateString() : "N/A"}`,
    );
    doc.text(
      `Completion Date: ${completionDate ? new Date(completionDate).toLocaleDateString() : "N/A"}`,
    );
    doc.text(`Issued By: ${issuedBy?.fullName || "Platform"}`);

    doc.moveDown(2);
    doc
      .fontSize(10)
      .text("This certificate is issued by the training platform.", {
        align: "center",
      });

    doc.end();
  });
};

const generateCertificateNumber = () => {
  const year = new Date().getFullYear();

  const randomNumber = crypto.randomBytes(4).toString("hex").toUpperCase();

  return `SIP-${year}-${randomNumber}`;
};

const generateVerificationCode = () => {
  return crypto.randomBytes(16).toString("hex").toUpperCase();
};

// Create certificate
export const createCertificateService = async (data, issuedBy) => {
  const { student, course, completionDate, grade, certificateUrl } = data;

  const studentExists = await User.findById(student);

  if (!studentExists) {
    const error = new Error("Student not found");
    error.statusCode = 404;
    throw error;
  }

  if (studentExists.role !== "student") {
    const error = new Error("Certificate can only be issued to a student");
    error.statusCode = 400;
    throw error;
  }

  const courseExists = await Course.findById(course);

  if (!courseExists) {
    const error = new Error("Course not found");
    error.statusCode = 404;
    throw error;
  }

  const enrollment = await Enrollment.findOne({
    student,
    course,
  });

  if (!enrollment || enrollment.status !== "Completed") {
    const error = new Error(
      "Certificate can only be issued after course completion",
    );
    error.statusCode = 400;
    throw error;
  }

  if (issuedBy) {
    const issuer = await User.findById(issuedBy).select("role");
    if (!issuer || !["admin", "instructor"].includes(issuer.role)) {
      const error = new Error("Invalid certificate issuer");
      error.statusCode = 403;
      throw error;
    }
    if (
      issuer.role === "instructor" &&
      courseExists.instructor.toString() !== issuedBy.toString()
    ) {
      const error = new Error(
        "You can only issue certificates for your own courses",
      );
      error.statusCode = 403;
      throw error;
    }
  }

  const existingCertificate = await Certificate.findOne({
    student,
    course,
    status: "Issued",
  });

  if (existingCertificate) {
    const error = new Error("Certificate already issued for this course");
    error.statusCode = 400;
    throw error;
  }

  const certificate = await Certificate.create({
    certificateNumber: generateCertificateNumber(),
    verificationCode: generateVerificationCode(),
    student,
    course,
    issuedBy,
    completionDate: completionDate || new Date(),
    grade,
    certificateUrl: certificateUrl || "",
  });

  const populatedCertificate = await Certificate.findById(certificate._id)
    .populate("student", "fullName email photo")
    .populate("course", "title duration")
    .populate("issuedBy", "fullName email");

  await notifyUser({
    userId: student,
    sender: issuedBy,
    title: "Certificate issued",
    message: `Your certificate for ${courseExists.title} has been issued.`,
    type: "certificate",
    referenceId: certificate._id,
    referenceModel: "Certificate",
  });

  await notifyAdmins({
    sender: issuedBy,
    title: "Certificate issued",
    message: `${studentExists.fullName}'s certificate for ${courseExists.title} has been issued.`,
    type: "certificate",
    referenceId: certificate._id,
    referenceModel: "Certificate",
  });

  return populatedCertificate;
};

// Get all certificates
export const getCertificatesService = async ({
  page = 1,
  limit = 10,
  search = "",
  status,
  actor,
} = {}) => {
  page = Number(page);
  limit = Number(limit);

  const skip = (page - 1) * limit;

  const filter = {};

  if (actor?.role === "instructor") {
    const instructorCourses = await Course.find({
      instructor: actor._id,
    }).select("_id");
    filter.course = { $in: instructorCourses.map((course) => course._id) };
  }

  if (status) {
    filter.status = status;
  }

  if (search) {
    filter.certificateNumber = {
      $regex: search,
      $options: "i",
    };
  }

  const [certificates, total] = await Promise.all([
    Certificate.find(filter)
      .populate("student", "fullName email photo")
      .populate("course", "title duration")
      .populate("issuedBy", "fullName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Certificate.countDocuments(filter),
  ]);

  return {
    certificates,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// Get single certificate
export const getCertificateService = async (id, actor) => {
  const certificate = await Certificate.findById(id);

  if (!certificate) {
    return null;
  }

  if (
    actor?.role === "student" &&
    certificate.student.toString() !== actor._id.toString()
  ) {
    const error = new Error("You can only view your own certificates");
    error.statusCode = 403;
    throw error;
  }

  return Certificate.findById(id)
    .populate("student", "fullName email phone photo")
    .populate("course", "title description duration fee")
    .populate("issuedBy", "fullName email role");
};

// Get student's certificates
export const getStudentCertificatesService = async (studentId) => {
  return await Certificate.find({
    student: studentId,
  })
    .populate("course", "title duration description")
    .populate("issuedBy", "fullName")
    .sort({ issueDate: -1 });
};

export const getCertificateDownloadService = async (id, actor) => {
  const certificate = await Certificate.findById(id)
    .populate("student", "fullName email photo")
    .populate("course", "title description duration")
    .populate("issuedBy", "fullName email");

  if (!certificate) {
    const error = new Error("Certificate not found");
    error.statusCode = 404;
    throw error;
  }

  if (
    actor?.role === "student" &&
    certificate.student._id.toString() !== actor._id.toString()
  ) {
    const error = new Error("You can only download your own certificates");
    error.statusCode = 403;
    throw error;
  }

  return certificate;
};

// Verify certificate publicly
export const verifyCertificateService = async (verificationCode) => {
  const certificate = await Certificate.findOne({
    verificationCode,
    status: "Issued",
  })
    .populate("student", "fullName")
    .populate("course", "title duration")
    .populate("issuedBy", "fullName");

  return certificate;
};

// Update certificate
export const updateCertificateService = async (id, data, actor) => {
  const existingCertificate = await Certificate.findById(id).populate(
    "course",
    "instructor",
  );

  if (!existingCertificate) {
    return null;
  }

  if (
    actor?.role === "instructor" &&
    existingCertificate.course.instructor.toString() !== actor._id.toString()
  ) {
    const error = new Error(
      "You can only update certificates for your own courses",
    );
    error.statusCode = 403;
    throw error;
  }

  const allowedUpdates = {};

  if (data.grade !== undefined) {
    allowedUpdates.grade = data.grade;
  }

  if (data.completionDate !== undefined) {
    allowedUpdates.completionDate = data.completionDate;
  }

  if (data.certificateUrl !== undefined) {
    allowedUpdates.certificateUrl = data.certificateUrl;
  }

  if (data.status !== undefined) {
    allowedUpdates.status = data.status;
  }

  const certificate = await Certificate.findByIdAndUpdate(id, allowedUpdates, {
    returnDocument: "after",
    runValidators: true,
  })
    .populate("student", "fullName email")
    .populate("course", "title")
    .populate("issuedBy", "fullName");

  return certificate;
};

// Revoke certificate
export const revokeCertificateService = async (id) => {
  return await Certificate.findByIdAndUpdate(
    id,
    {
      status: "Revoked",
    },
    {
      returnDocument: "after",
    },
  );
};

// Delete certificate
export const deleteCertificateService = async (id) => {
  return await Certificate.findByIdAndDelete(id);
};
