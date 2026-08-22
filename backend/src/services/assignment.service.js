import Assignment from "../models/assignment.model.js";
import Course from "../models/course.model.js";
import Enrollment from "../models/enrollment.model.js";
import { notifyAdmins, notifyUser } from "../utils/notificationEvents.js";

// Create assignment
export const createAssignmentService = async (instructorId, data) => {
  const { course, title, description, dueDate, attachment } = data;

  const courseData = await Course.findById(course);

  if (!courseData) {
    const error = new Error("Course not found.");
    error.statusCode = 404;
    throw error;
  }

  // Only course instructor can create assignment
  if (courseData.instructor.toString() !== instructorId.toString()) {
    const error = new Error(
      "You can only create assignments for your own courses.",
    );

    error.statusCode = 403;
    throw error;
  }

  if (new Date(dueDate) <= new Date()) {
    const error = new Error("Due date must be in the future.");

    error.statusCode = 400;
    throw error;
  }

  const assignment = await Assignment.create({
    course,
    title,
    description,
    dueDate,
    attachment: attachment || "",
  });

  const enrollments = await Enrollment.find({
    course,
    status: { $in: ["Active", "Completed"] },
  }).select("student");

  await Promise.allSettled(
    enrollments.map((enrollment) =>
      notifyUser({
        userId: enrollment.student,
        sender: instructorId,
        title: "New assignment posted",
        message: `${title} was posted in ${courseData.title}.`,
        type: "assignment",
        referenceId: assignment._id,
        referenceModel: "Assignment",
      }),
    ),
  );

  await notifyAdmins({
    sender: instructorId,
    title: "Assignment created",
    message: `${title} was created for ${courseData.title}.`,
    type: "assignment",
    referenceId: assignment._id,
    referenceModel: "Assignment",
  });

  return assignment;
};

// Get all assignments
export const getAssignmentsService = async ({
  course,
  status,
  page = 1,
  limit = 10,
  actor,
}) => {
  const query = {};

  if (course) {
    query.course = course;
  }

  if (actor?.role === "student") {
    const enrollments = await Enrollment.find({
      student: actor._id,
      status: { $in: ["Active", "Completed"] },
    }).select("course");

    const enrolledCourseIds = enrollments.map(
      (enrollment) => enrollment.course,
    );

    query.course = course
      ? {
          $in: enrolledCourseIds.filter(
            (id) => id.toString() === course.toString(),
          ),
        }
      : { $in: enrolledCourseIds };
  }

  if (actor?.role === "instructor") {
    const courses = await Course.find({
      instructor: actor._id,
      ...(course && { _id: course }),
    }).select("_id");

    query.course = { $in: courses.map((item) => item._id) };
  }

  if (status) {
    query.status = status;
  }

  const pageNumber = Math.max(Number(page) || 1, 1);

  const limitNumber = Math.min(Math.max(Number(limit) || 10, 1), 100);

  const skip = (pageNumber - 1) * limitNumber;

  const [assignments, total] = await Promise.all([
    Assignment.find(query)
      .populate("course", "title instructor duration")
      .sort({ dueDate: 1 })
      .skip(skip)
      .limit(limitNumber),

    Assignment.countDocuments(query),
  ]);

  return {
    assignments,
    pagination: {
      total,
      page: pageNumber,
      limit: limitNumber,
      totalPages: Math.ceil(total / limitNumber),
    },
  };
};

// Get single assignment
export const getAssignmentService = async (id, actor) => {
  const assignment = await Assignment.findById(id).populate(
    "course",
    "title instructor duration",
  );

  if (!assignment) {
    return null;
  }

  if (actor?.role === "student") {
    const enrollment = await Enrollment.findOne({
      student: actor._id,
      course: assignment.course._id || assignment.course,
      status: { $in: ["Active", "Completed"] },
    });

    if (!enrollment) {
      const error = new Error(
        "You must be enrolled in this course to view this assignment.",
      );
      error.statusCode = 403;
      throw error;
    }
  }

  if (actor?.role === "instructor") {
    const instructorId = assignment.course?.instructor;

    if (!instructorId || instructorId.toString() !== actor._id.toString()) {
      const error = new Error(
        "You can only view assignments for your own courses.",
      );
      error.statusCode = 403;
      throw error;
    }
  }

  return assignment;
};

// Update assignment
export const updateAssignmentService = async (id, instructorId, data) => {
  const assignment = await Assignment.findById(id).populate("course");

  if (!assignment) {
    return null;
  }

  if (assignment.course.instructor.toString() !== instructorId.toString()) {
    const error = new Error(
      "You can only update assignments for your own courses.",
    );

    error.statusCode = 403;
    throw error;
  }

  if (data.dueDate) {
    if (new Date(data.dueDate) <= new Date()) {
      const error = new Error("Due date must be in the future.");

      error.statusCode = 400;
      throw error;
    }
  }

  const allowedUpdates = {};

  if (data.title !== undefined) {
    allowedUpdates.title = data.title;
  }

  if (data.description !== undefined) {
    allowedUpdates.description = data.description;
  }

  if (data.dueDate !== undefined) {
    allowedUpdates.dueDate = data.dueDate;
  }

  if (data.attachment !== undefined) {
    allowedUpdates.attachment = data.attachment;
  }

  if (data.status !== undefined) {
    allowedUpdates.status = data.status;
  }

  return await Assignment.findByIdAndUpdate(id, allowedUpdates, {
    returnDocument: "after",
    runValidators: true,
  }).populate("course", "title instructor duration");
};

// Delete assignment
export const deleteAssignmentService = async (id, instructorId) => {
  const assignment = await Assignment.findById(id).populate("course");

  if (!assignment) {
    return null;
  }

  if (assignment.course.instructor.toString() !== instructorId.toString()) {
    const error = new Error(
      "You can only delete assignments for your own courses.",
    );

    error.statusCode = 403;
    throw error;
  }

  return await Assignment.findByIdAndDelete(id);
};

// Get assignments for instructor's course
export const getInstructorAssignmentsService = async (instructorId) => {
  const courses = await Course.find({
    instructor: instructorId,
  }).select("_id");

  const courseIds = courses.map((course) => course._id);

  return await Assignment.find({
    course: { $in: courseIds },
  })
    .populate("course", "title duration")
    .sort({ dueDate: 1 });
};
