import path from "path";
import {
  createSubmissionService,
  getMySubmissionsService,
  getSubmissionService,
  getSubmissionsByAssignmentService,
  gradeSubmissionService,
  deleteSubmissionService,
  getAllSubmissionsService,
} from "../services/submission.service.js";

// Student - Create Submission
export const createSubmission = async (req, res) => {
  if (!req.file) {
    const error = new Error("Assignment file is required.");

    error.statusCode = 400;
    throw error;
  }

  const submission = await createSubmissionService({
    assignmentId: req.body.assignment,
    studentId: req.user._id,
    file: req.file.path,
    description: req.body.description,
  });

  return res.status(201).json({
    success: true,
    message: "Assignment submitted successfully.",
    submission,
  });
};

export const submitAssignment = createSubmission;

// Student - Get My Submissions
export const getMySubmissions = async (req, res) => {
  const submissions = await getMySubmissionsService(req.user._id);

  return res.status(200).json({
    success: true,
    submissions,
  });
};

// Get Single Submission
export const getSubmission = async (req, res) => {
  const submission = await getSubmissionService(req.params.id, req.user);

  if (!submission) {
    const error = new Error("Submission not found.");

    error.statusCode = 404;
    throw error;
  }

  return res.status(200).json({
    success: true,
    submission,
  });
};

// Download/Open Submission File
export const getSubmissionFile = async (req, res) => {
  const submission = await getSubmissionService(req.params.id, req.user);

  if (!submission) {
    const error = new Error("Submission not found.");
    error.statusCode = 404;
    throw error;
  }

  if (!submission.file) {
    const error = new Error("Submission file not found.");
    error.statusCode = 404;
    throw error;
  }

  const filePath =
    /^([A-Za-z]:[\\/]|\/)/.test(submission.file) || submission.file.startsWith(".")
      ? submission.file
      : path.resolve(submission.file);

  return res.sendFile(filePath, {
    headers: {
      "Content-Disposition": "inline",
    },
  });
};
// Instructor - Get Assignment Submissions
export const getSubmissionsByAssignment = async (req, res) => {
  const submissions = await getSubmissionsByAssignmentService(
    req.params.assignmentId,
    req.user,
  );

  return res.status(200).json({
    success: true,
    submissions,
  });
};

// Instructor - Grade Submission
export const gradeSubmission = async (req, res) => {
  const { grade, feedback } = req.body;

  const submission = await gradeSubmissionService(
    req.params.id,
    grade,
    feedback,
    req.user._id,
  );

  return res.status(200).json({
    success: true,
    message: "Submission graded successfully.",
    submission,
  });
};

// Student - Delete Submission
export const deleteSubmission = async (req, res) => {
  await deleteSubmissionService(req.params.id, req.user._id);

  return res.status(200).json({
    success: true,
    message: "Submission deleted successfully.",
  });
};

// Admin - Get All Submissions
export const getAllSubmissions = async (req, res) => {
  const { page, limit, status } = req.query;

  const result = await getAllSubmissionsService({
    page,
    limit,
    status,
  });

  return res.status(200).json({
    success: true,
    ...result,
  });
};


