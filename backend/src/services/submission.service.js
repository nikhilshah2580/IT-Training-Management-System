import Submission from "../models/submission.model.js";
import Assignment from "../models/assignment.model.js";
import Enrollment from "../models/enrollment.model.js";
import Course from "../models/course.model.js";
import {
  notifyAdmins,
  notifyCourseInstructor,
  notifyUser,
} from "../utils/notificationEvents.js";

// Create Submission
export const createSubmissionService = async ({
  assignmentId,
  studentId,
  file,
  description = "",
}) => {
  if (!file) {
    const error = new Error("Assignment file is required.");
    error.statusCode = 400;
    throw error;
  }

  const assignment = await Assignment.findById(assignmentId);

  if (!assignment) {
    const error = new Error("Assignment not found.");
    error.statusCode = 404;
    throw error;
  }

  const enrollment = await Enrollment.findOne({
    student: studentId,
    course: assignment.course,
    status: { $in: ["Active", "Completed"] },
  });

  if (!enrollment) {
    const error = new Error(
      "You must be enrolled in this course to submit the assignment.",
    );
    error.statusCode = 403;
    throw error;
  }

  if (assignment.status === "Closed") {
    const error = new Error("This assignment is closed.");
    error.statusCode = 400;
    throw error;
  }

  // Check deadline
  const now = new Date();

  const status =
    assignment.dueDate && now > assignment.dueDate ? "Late" : "Submitted";

  // Check existing submission
  const existingSubmission = await Submission.findOne({
    assignment: assignmentId,
    student: studentId,
  });

  if (existingSubmission) {
    const error = new Error("You have already submitted this assignment.");

    error.statusCode = 400;
    throw error;
  }

  const submission = await Submission.create({
    assignment: assignmentId,
    student: studentId,
    file,
    description: description.trim(),
    submittedAt: now,
    status,
  });

  const populatedSubmission = await Submission.findById(submission._id)
    .populate("student", "fullName email photo")
    .populate("assignment", "title description dueDate course");

  const submissionCourse = await Course.findById(assignment.course).select(
    "title instructor",
  );

  await notifyCourseInstructor({
    course: submissionCourse,
    sender: studentId,
    title: "Assignment submitted",
    message: `${populatedSubmission.student?.fullName || "A student"} submitted ${assignment.title}.`,
    type: "submission",
    referenceId: submission._id,
    referenceModel: "Submission",
  });

  await notifyAdmins({
    sender: studentId,
    title: "Assignment submitted",
    message: `${populatedSubmission.student?.fullName || "A student"} submitted ${assignment.title}.`,
    type: "submission",
    referenceId: submission._id,
    referenceModel: "Submission",
  });

  return populatedSubmission;
};

// Get Student's Submissions
export const getMySubmissionsService = async (studentId) => {
  return await Submission.find({
    student: studentId,
  })
    .populate("assignment", "title description dueDate course")
    .populate("gradedBy", "fullName email")
    .sort({ createdAt: -1 });
};

// Get Single Submission
export const getSubmissionService = async (id, actor) => {
  const submission = await Submission.findById(id).populate(
    "assignment",
    "title description dueDate course",
  );

  if (!submission) {
    return null;
  }

  if (actor?.role === "student") {
    if (submission.student.toString() !== actor._id.toString()) {
      const error = new Error("You can only view your own submission.");
      error.statusCode = 403;
      throw error;
    }
  } else if (actor?.role === "instructor") {
    const course = await Course.findById(submission.assignment.course).select(
      "instructor",
    );
    if (!course || course.instructor.toString() !== actor._id.toString()) {
      const error = new Error(
        "You can only view submissions for your own courses.",
      );
      error.statusCode = 403;
      throw error;
    }
  }

  return Submission.findById(id)
    .populate("student", "fullName email phone photo")
    .populate("assignment", "title description dueDate course")
    .populate("gradedBy", "fullName email");
};

// Get Submissions By Assignment
export const getSubmissionsByAssignmentService = async (
  assignmentId,
  actor,
) => {
  const assignment = await Assignment.findById(assignmentId);

  if (!assignment) {
    const error = new Error("Assignment not found.");
    error.statusCode = 404;
    throw error;
  }

  if (actor?.role === "instructor") {
    const course = await Course.findById(assignment.course).select(
      "instructor",
    );
    if (!course || course.instructor.toString() !== actor._id.toString()) {
      const error = new Error(
        "You can only view submissions for your own courses.",
      );
      error.statusCode = 403;
      throw error;
    }
  }

  return await Submission.find({
    assignment: assignmentId,
  })
    .populate("student", "fullName email phone photo")
    .populate("gradedBy", "fullName email")
    .sort({ createdAt: -1 });
};

// Grade Submission
export const gradeSubmissionService = async (
  id,
  grade,
  feedback,
  instructorId,
) => {
  if (grade === undefined || grade === null || grade === "") {
    const error = new Error("Grade is required.");
    error.statusCode = 400;
    throw error;
  }

  const numericGrade = Number(grade);

  if (Number.isNaN(numericGrade) || numericGrade < 0 || numericGrade > 100) {
    const error = new Error("Grade must be between 0 and 100.");

    error.statusCode = 400;
    throw error;
  }

  const submission = await Submission.findById(id);

  if (!submission) {
    const error = new Error("Submission not found.");

    error.statusCode = 404;
    throw error;
  }

  const assignment = await Assignment.findById(submission.assignment).select(
    "course",
  );
  const course = assignment
    ? await Course.findById(assignment.course).select("instructor")
    : null;

  if (!course) {
    const error = new Error("Course not found.");
    error.statusCode = 404;
    throw error;
  }

  if (course.instructor.toString() !== instructorId.toString()) {
    const error = new Error(
      "You can only grade submissions for your own courses.",
    );
    error.statusCode = 403;
    throw error;
  }

  submission.grade = numericGrade;
  submission.feedback = feedback || "";
  submission.status = "Graded";
  submission.gradedAt = new Date();
  submission.gradedBy = instructorId;

  await submission.save();

  const gradedSubmission = await Submission.findById(id)
    .populate("student", "fullName email phone photo")
    .populate("assignment", "title description dueDate course")
    .populate("gradedBy", "fullName email");

  await notifyUser({
    userId: submission.student,
    sender: instructorId,
    title: "Submission graded",
    message: `${gradedSubmission.assignment?.title || "Your assignment"} was graded: ${numericGrade}/100.`,
    type: "submission",
    referenceId: submission._id,
    referenceModel: "Submission",
  });

  return gradedSubmission;
};

// Delete Submission
export const deleteSubmissionService = async (id, studentId) => {
  const submission = await Submission.findById(id);

  if (!submission) {
    const error = new Error("Submission not found.");

    error.statusCode = 404;
    throw error;
  }

  // Student can delete only their own submission
  if (submission.student.toString() !== studentId.toString()) {
    const error = new Error("You can only delete your own submission.");

    error.statusCode = 403;
    throw error;
  }

  await Submission.findByIdAndDelete(id);

  return submission;
};

// Get All Submissions - Admin
export const getAllSubmissionsService = async ({
  page = 1,
  limit = 10,
  status,
}) => {
  page = Number(page);
  limit = Number(limit);

  const filter = {};

  if (status) {
    filter.status = status;
  }

  const skip = (page - 1) * limit;

  const [submissions, total] = await Promise.all([
    Submission.find(filter)
      .populate("student", "fullName email phone photo")
      .populate("assignment", "title dueDate course")
      .populate("gradedBy", "fullName email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Submission.countDocuments(filter),
  ]);

  return {
    submissions,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};
