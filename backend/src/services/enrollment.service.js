import Enrollment from "../models/enrollment.model.js";
import Course from "../models/course.model.js";
import User from "../models/user.model.js";
import {
  notifyAdmins,
  notifyCourseInstructor,
  notifyUser,
} from "../utils/notificationEvents.js";

//CREATE ENROLLMENT

export const createEnrollmentService = async (studentId, courseId) => {
  const student = await User.findById(studentId);

  if (!student) {
    const error = new Error("Student not found");
    error.statusCode = 404;
    throw error;
  }

  if (student.role !== "student") {
    const error = new Error("Only students can enroll in courses");
    error.statusCode = 403;
    throw error;
  }

  const course = await Course.findById(courseId);

  if (!course) {
    const error = new Error("Course not found");
    error.statusCode = 404;
    throw error;
  }

  if (course.status !== "Active") {
    const error = new Error("This course is currently inactive");
    error.statusCode = 400;
    throw error;
  }

  if (
    course.enrollmentDeadline &&
    new Date() > new Date(course.enrollmentDeadline)
  ) {
    const error = new Error("Enrollment deadline has passed");
    error.statusCode = 400;
    throw error;
  }

  const existingEnrollment = await Enrollment.findOne({
    student: studentId,
    course: courseId,
  });

  if (existingEnrollment) {
    const error = new Error("You are already enrolled in this course");
    error.statusCode = 400;
    throw error;
  }

  const enrollment = await Enrollment.create({
    student: studentId,
    course: courseId,
  });

  // Keep the course enrollment summary in sync.
  const alreadyListed = course.enrolledStudents.some(
    (id) => id.toString() === studentId.toString(),
  );

  if (!alreadyListed) {
    course.enrolledStudents.push(studentId);
    course.totalStudents = course.enrolledStudents.length;
    await course.save();
  }

  const populatedEnrollment = await Enrollment.findById(enrollment._id)
    .populate("student", "fullName email phone photo")
    .populate("course", "title description duration fee instructor");

  await notifyAdmins({
    sender: studentId,
    title: "New course enrollment",
    message: `${student.fullName} enrolled in ${course.title}.`,
    type: "enrollment",
    referenceId: enrollment._id,
    referenceModel: "Enrollment",
  });

  await notifyCourseInstructor({
    course,
    sender: studentId,
    title: "New student enrolled",
    message: `${student.fullName} enrolled in your course ${course.title}.`,
    type: "enrollment",
    referenceId: enrollment._id,
    referenceModel: "Enrollment",
  });

  await notifyUser({
    userId: studentId,
    title: "Enrollment created",
    message: `You enrolled in ${course.title}. Complete payment to activate access.`,
    type: "enrollment",
    referenceId: enrollment._id,
    referenceModel: "Enrollment",
  });

  return populatedEnrollment;
};

//GET ALL ENROLLMENTS

export const getEnrollmentsService = async ({
  status,
  page = 1,
  limit = 10,
}) => {
  const currentPage = Math.max(Number(page) || 1, 1);
  const currentLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);

  const skip = (currentPage - 1) * currentLimit;

  const filter = {};

  if (status) {
    filter.status = status;
  }

  const [enrollments, total] = await Promise.all([
    Enrollment.find(filter)
      .populate("student", "fullName email phone photo")
      .populate("course", "title duration fee instructor")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(currentLimit),

    Enrollment.countDocuments(filter),
  ]);

  return {
    enrollments,
    pagination: {
      total,
      page: currentPage,
      limit: currentLimit,
      totalPages: Math.ceil(total / currentLimit),
    },
  };
};

//GET SINGLE ENROLLMENT

export const getEnrollmentService = async (id) => {
  const enrollment = await Enrollment.findById(id)
    .populate("student", "fullName email phone photo")
    .populate("course", "title description duration fee instructor");

  if (!enrollment) {
    const error = new Error("Enrollment not found");
    error.statusCode = 404;
    throw error;
  }

  return enrollment;
};

//GET MY ENROLLMENTS

export const getMyEnrollmentsService = async (studentId) => {
  return await Enrollment.find({
    student: studentId,
    paymentStatus: "Paid",
  })
    .populate("course", "title description duration fee instructor courseImage")
    .sort({ createdAt: -1 });
};

// GET INSTRUCTOR ENROLLMENTS
// Instructor can only see students enrolled in courses created by that instructor.
export const getInstructorEnrollmentsService = async (
  instructorId,
  { courseId, status, page = 1, limit = 10 },
) => {
  const currentPage = Math.max(Number(page) || 1, 1);

  const currentLimit = Math.min(Math.max(Number(limit) || 10, 1), 100);

  const skip = (currentPage - 1) * currentLimit;

  // Find only courses belonging to this instructor
  const courseFilter = {
    instructor: instructorId,
  };

  // Optional: filter by one specific course
  if (courseId) {
    courseFilter._id = courseId;
  }

  const instructorCourses = await Course.find(courseFilter).select("_id");

  const courseIds = instructorCourses.map((course) => course._id);

  // Find enrollments for those courses
  const enrollmentFilter = {
    course: {
      $in: courseIds,
    },
  };

  if (status) {
    enrollmentFilter.status = status;
  }

  const [enrollments, total] = await Promise.all([
    Enrollment.find(enrollmentFilter)
      .populate("student", "fullName email phone photo")
      .populate("course", "title description duration fee instructor")
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(currentLimit),

    Enrollment.countDocuments(enrollmentFilter),
  ]);

  return {
    enrollments,

    pagination: {
      total,
      page: currentPage,
      limit: currentLimit,
      totalPages: Math.ceil(total / currentLimit),
    },
  };
};

//UPDATE ENROLLMENT STATUS

export const updateEnrollmentStatusService = async (id, status) => {
  const allowedStatuses = [
    "Pending",
    "Approved",
    "Active",
    "Completed",
    "Cancelled",
  ];

  if (!allowedStatuses.includes(status)) {
    const error = new Error("Invalid enrollment status");
    error.statusCode = 400;
    throw error;
  }

  const existingEnrollment =
    await Enrollment.findById(id).select("paymentStatus");

  if (!existingEnrollment) {
    const error = new Error("Enrollment not found");
    error.statusCode = 404;
    throw error;
  }

  if (
    ["Active", "Completed"].includes(status) &&
    existingEnrollment.paymentStatus !== "Paid"
  ) {
    const error = new Error(
      "Enrollment can only be activated after payment is completed",
    );
    error.statusCode = 400;
    throw error;
  }

  const updates = {
    status,
  };

  if (status === "Completed") {
    updates.progress = 100;
    updates.completedAt = new Date();
  }

  if (status === "Cancelled") {
    updates.completedAt = null;
  }

  const enrollment = await Enrollment.findByIdAndUpdate(id, updates, {
    returnDocument: "after",
    runValidators: true,
  })
    .populate("student", "fullName email phone photo")
    .populate("course", "title duration fee instructor");

  if (!enrollment) {
    const error = new Error("Enrollment not found");
    error.statusCode = 404;
    throw error;
  }

  await notifyUser({
    userId: enrollment.student?._id || enrollment.student,
    title: "Enrollment status updated",
    message: `Your enrollment for ${enrollment.course?.title || "a course"} is now ${status}.`,
    type: "enrollment",
    referenceId: enrollment._id,
    referenceModel: "Enrollment",
  });

  return enrollment;
};

//UPDATE COURSE PROGRESS

export const updateEnrollmentProgressService = async (id, progress, actor) => {
  const numericProgress = Number(progress);

  if (
    Number.isNaN(numericProgress) ||
    numericProgress < 0 ||
    numericProgress > 100
  ) {
    const error = new Error("Progress must be between 0 and 100");
    error.statusCode = 400;
    throw error;
  }

  const existingEnrollment = await Enrollment.findById(id).populate(
    "course",
    "title instructor",
  );

  if (!existingEnrollment) {
    const error = new Error("Enrollment not found");
    error.statusCode = 404;
    throw error;
  }

  if (actor?.role === "instructor") {
    if (
      !existingEnrollment.course?.instructor ||
      existingEnrollment.course.instructor.toString() !== actor._id.toString()
    ) {
      const error = new Error(
        "You can only update progress for students in your own courses",
      );
      error.statusCode = 403;
      throw error;
    }
  }

  if (existingEnrollment.status === "Cancelled") {
    const error = new Error("Cancelled enrollment cannot be updated");
    error.statusCode = 400;
    throw error;
  }

  const updates = {
    progress: numericProgress,
  };

  if (numericProgress === 100) {
    updates.status = "Completed";
    updates.completedAt = new Date();
  }

  const enrollment = await Enrollment.findByIdAndUpdate(id, updates, {
    returnDocument: "after",
    runValidators: true,
  })
    .populate("student", "fullName email phone photo")
    .populate("course", "title duration fee instructor courseImage");

  if (!enrollment) {
    const error = new Error("Enrollment not found");
    error.statusCode = 404;
    throw error;
  }

  return enrollment;
};

//DELETE / CANCEL ENROLLMENT

export const cancelEnrollmentService = async (id) => {
  const enrollment = await Enrollment.findByIdAndUpdate(
    id,
    {
      status: "Cancelled",
    },
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  if (!enrollment) {
    const error = new Error("Enrollment not found");
    error.statusCode = 404;
    throw error;
  }

  return enrollment;
};
