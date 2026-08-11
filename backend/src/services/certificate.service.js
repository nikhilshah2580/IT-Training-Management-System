import crypto from "crypto";
import Certificate from "../models/certificate.model.js";
import User from "../models/user.model.js";
import Course from "../models/course.model.js";

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

  return await Certificate.findById(certificate._id)
    .populate("student", "fullName email photo")
    .populate("course", "title duration")
    .populate("issuedBy", "fullName email");
};

// Get all certificates
export const getCertificatesService = async ({ page = 1, limit = 10, search = "", status } = {}) => {
  page = Number(page);
  limit = Number(limit);

  const skip = (page - 1) * limit;

  const filter = {};

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
export const getCertificateService = async (id) => {
  return await Certificate.findById(id)
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
export const updateCertificateService = async (id, data) => {
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
    new: true,
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
      new: true,
    },
  );
};

// Delete certificate
export const deleteCertificateService = async (id) => {
  return await Certificate.findByIdAndDelete(id);
};
