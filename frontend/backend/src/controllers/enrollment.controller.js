import {
  createEnrollmentService,
  getEnrollmentsService,
  getEnrollmentService,
  getMyEnrollmentsService,
  updateEnrollmentStatusService,
  updateEnrollmentPaymentStatusService,
  updateEnrollmentProgressService,
  cancelEnrollmentService,
} from "../services/enrollment.service.js";

/*
|--------------------------------------------------------------------------
| STUDENT CREATE ENROLLMENT
|--------------------------------------------------------------------------
*/

export const createEnrollment = async (req, res) => {
  const enrollment = await createEnrollmentService(req.user._id, req.body.courseId);

  return res.status(201).json({
    success: true,
    message: "Course enrollment created successfully",
    enrollment,
  });
};

/*
|--------------------------------------------------------------------------
| ADMIN GET ALL ENROLLMENTS
|--------------------------------------------------------------------------
*/

export const getEnrollments = async (req, res) => {
  const { status, page, limit } = req.query;

  const result = await getEnrollmentsService({
    status,
    page,
    limit,
  });

  return res.status(200).json({
    success: true,
    ...result,
  });
};

/*
|--------------------------------------------------------------------------
| GET SINGLE ENROLLMENT
|--------------------------------------------------------------------------
*/

export const getEnrollment = async (req, res) => {
  const enrollment = await getEnrollmentService(req.params.id);

  return res.status(200).json({
    success: true,
    enrollment,
  });
};

/*
|--------------------------------------------------------------------------
| STUDENT GET OWN ENROLLMENTS
|--------------------------------------------------------------------------
*/

export const getMyEnrollments = async (req, res) => {
  const enrollments = await getMyEnrollmentsService(req.user._id);

  return res.status(200).json({
    success: true,
    enrollments,
  });
};

/*
|--------------------------------------------------------------------------
| ADMIN UPDATE ENROLLMENT STATUS
|--------------------------------------------------------------------------
*/

export const updateEnrollmentStatus = async (req, res) => {
  const enrollment = await updateEnrollmentStatusService(req.params.id, req.body.status);

  return res.status(200).json({
    success: true,
    message: "Enrollment status updated successfully",
    enrollment,
  });
};

/*
|--------------------------------------------------------------------------
| ADMIN UPDATE PAYMENT STATUS
|--------------------------------------------------------------------------
*/

export const updateEnrollmentPaymentStatus = async (req, res) => {
  const enrollment = await updateEnrollmentPaymentStatusService(req.params.id, req.body.paymentStatus);

  return res.status(200).json({
    success: true,
    message: "Enrollment payment status updated successfully",
    enrollment,
  });
};

/*
|--------------------------------------------------------------------------
| UPDATE COURSE PROGRESS
|--------------------------------------------------------------------------
*/

export const updateEnrollmentProgress = async (req, res) => {
  const enrollment = await updateEnrollmentProgressService(req.params.id, req.body.progress);

  return res.status(200).json({
    success: true,
    message: "Course progress updated successfully",
    enrollment,
  });
};

/*
|--------------------------------------------------------------------------
| CANCEL ENROLLMENT
|--------------------------------------------------------------------------
*/

export const cancelEnrollment = async (req, res) => {
  const enrollment = await cancelEnrollmentService(req.params.id);

  return res.status(200).json({
    success: true,
    message: "Enrollment cancelled successfully",
    enrollment,
  });
};
