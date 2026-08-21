import {
  createCertificateService,
  getCertificatesService,
  getCertificateService,
  getStudentCertificatesService,
  verifyCertificateService,
  updateCertificateService,
  revokeCertificateService,
  deleteCertificateService,
} from "../services/certificate.service.js";

// Create certificate
export const createCertificate = async (req, res) => {
  const certificate = await createCertificateService(req.body, req.user._id);

  return res.status(201).json({
    success: true,
    message: "Certificate issued successfully",
    certificate,
  });
};

// Get all certificates
export const getCertificates = async (req, res) => {
  const { page, limit, search, status } = req.query;

  const result = await getCertificatesService({
    page,
    limit,
    search,
    status,
    actor: req.user,
  });

  return res.status(200).json({
    success: true,
    ...result,
  });
};

// Get single certificate
export const getCertificate = async (req, res) => {
  const certificate = await getCertificateService(req.params.id, req.user);

  if (!certificate) {
    const error = new Error("Certificate not found");
    error.statusCode = 404;
    throw error;
  }

  return res.status(200).json({
    success: true,
    certificate,
  });
};

// Get current student's certificates
export const getMyCertificates = async (req, res) => {
  const certificates = await getStudentCertificatesService(req.user._id);

  return res.status(200).json({
    success: true,
    certificates,
  });
};

// Public certificate verification
export const verifyCertificate = async (req, res) => {
  const certificate = await verifyCertificateService(
    req.params.verificationCode,
  );

  if (!certificate) {
    const error = new Error("Invalid or revoked certificate");
    error.statusCode = 404;
    throw error;
  }

  return res.status(200).json({
    success: true,
    message: "Certificate is valid",
    certificate,
  });
};

// Update certificate
export const updateCertificate = async (req, res) => {
  const certificate = await updateCertificateService(
    req.params.id,
    req.body,
    req.user,
  );

  if (!certificate) {
    const error = new Error("Certificate not found");
    error.statusCode = 404;
    throw error;
  }

  return res.status(200).json({
    success: true,
    message: "Certificate updated successfully",
    certificate,
  });
};

// Revoke certificate
export const revokeCertificate = async (req, res) => {
  const certificate = await revokeCertificateService(req.params.id);

  if (!certificate) {
    const error = new Error("Certificate not found");
    error.statusCode = 404;
    throw error;
  }

  return res.status(200).json({
    success: true,
    message: "Certificate revoked successfully",
    certificate,
  });
};

// Delete certificate
export const deleteCertificate = async (req, res) => {
  const certificate = await deleteCertificateService(req.params.id);

  if (!certificate) {
    const error = new Error("Certificate not found");
    error.statusCode = 404;
    throw error;
  }

  return res.status(200).json({
    success: true,
    message: "Certificate deleted successfully",
  });
};
