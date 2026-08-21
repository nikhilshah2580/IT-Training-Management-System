import Resource from "../models/resource.model.js";
import Course from "../models/course.model.js";

// CREATE RESOURCE
export const createResourceService = async (data) => {
  const {
    course,
    instructor,
    title,
    description,
    type,
    url,
    publicId,
    isPublished,
  } = data;

  const courseExists = await Course.findById(course);

  if (!courseExists) {
    const error = new Error("Course not found.");
    error.statusCode = 404;
    throw error;
  }

  if (courseExists.instructor.toString() !== instructor.toString()) {
    const error = new Error("You are not the instructor of this course.");
    error.statusCode = 403;
    throw error;
  }

  return await Resource.create({
    course,
    instructor,
    title,
    description,
    type,
    url,
    publicId,
    isPublished,
  });
};

// GET ALL RESOURCES
export const getResourcesService = async (query = {}, actor = null) => {
  const { course, type, isPublished } = query;

  const filter = {};

  if (actor?.role === "instructor") {
    filter.instructor = actor._id;
  }

  if (course) {
    filter.course = course;
  }

  if (type) {
    filter.type = type;
  }

  if (isPublished !== undefined) {
    filter.isPublished = isPublished;
  }

  return await Resource.find(filter)
    .populate("course", "title")
    .populate("instructor", "fullName email photo")
    .sort({ createdAt: -1 });
};

// GET SINGLE RESOURCE
export const getResourceService = async (id) => {
  return await Resource.findById(id)
    .populate("course", "title description")
    .populate("instructor", "fullName email photo");
};

// GET RESOURCES BY COURSE
export const getCourseResourcesService = async (courseId) => {
  const courseExists = await Course.findById(courseId);

  if (!courseExists) {
    const error = new Error("Course not found.");
    error.statusCode = 404;
    throw error;
  }

  return await Resource.find({
    course: courseId,
    isPublished: true,
  })
    .populate("instructor", "fullName email photo")
    .sort({ createdAt: -1 });
};

// UPDATE RESOURCE
export const updateResourceService = async (id, instructorId, data) => {
  const resource = await Resource.findById(id);

  if (!resource) {
    const error = new Error("Resource not found.");
    error.statusCode = 404;
    throw error;
  }

  if (resource.instructor.toString() !== instructorId.toString()) {
    const error = new Error("You are not allowed to update this resource.");
    error.statusCode = 403;
    throw error;
  }

  const allowedUpdates = [
    "title",
    "description",
    "type",
    "url",
    "publicId",
    "isPublished",
  ];

  allowedUpdates.forEach((field) => {
    if (data[field] !== undefined) {
      resource[field] = data[field];
    }
  });

  await resource.save();

  return await Resource.findById(id)
    .populate("course", "title")
    .populate("instructor", "fullName email photo");
};

// ADMIN UPDATE RESOURCE
export const adminUpdateResourceService = async (id, data) => {
  const resource = await Resource.findByIdAndUpdate(id, data, {
    returnDocument: "after",
    runValidators: true,
  })
    .populate("course", "title")
    .populate("instructor", "fullName email photo");

  if (!resource) {
    const error = new Error("Resource not found.");
    error.statusCode = 404;
    throw error;
  }

  return resource;
};

// DELETE RESOURCE
export const deleteResourceService = async (id, instructorId) => {
  const resource = await Resource.findById(id);

  if (!resource) {
    const error = new Error("Resource not found.");
    error.statusCode = 404;
    throw error;
  }

  if (resource.instructor.toString() !== instructorId.toString()) {
    const error = new Error("You are not allowed to delete this resource.");
    error.statusCode = 403;
    throw error;
  }

  await Resource.findByIdAndDelete(id);

  return resource;
};

// ADMIN DELETE RESOURCE
export const adminDeleteResourceService = async (id) => {
  const resource = await Resource.findByIdAndDelete(id);

  if (!resource) {
    const error = new Error("Resource not found.");
    error.statusCode = 404;
    throw error;
  }

  return resource;
};
