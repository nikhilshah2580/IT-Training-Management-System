import {
  createResourceService,
  getResourcesService,
  getResourceService,
  getCourseResourcesService,
  updateResourceService,
  adminUpdateResourceService,
  deleteResourceService,
  adminDeleteResourceService,
} from "../services/resource.service.js";

// CREATE RESOURCE Instructor
export const createResource = async (req, res) => {
  const resource = await createResourceService({
    ...req.body,
    instructor: req.user._id,
  });

  return res.status(201).json({
    success: true,
    message: "Resource created successfully.",
    resource,
  });
};

// GET ALL RESOURCES Admin / Instructor
export const getResources = async (req, res) => {
  const resources = await getResourcesService(req.query, req.user);

  return res.status(200).json({
    success: true,
    resources,
  });
};

// GET SINGLE RESOURCE
export const getResource = async (req, res) => {
  const resource = await getResourceService(req.params.id);

  if (!resource) {
    const error = new Error("Resource not found.");
    error.statusCode = 404;
    throw error;
  }

  return res.status(200).json({
    success: true,
    resource,
  });
};

// GET COURSE RESOURCES Student / Instructor / Admin
export const getCourseResources = async (req, res) => {
  const resources = await getCourseResourcesService(req.params.courseId);

  return res.status(200).json({
    success: true,
    resources,
  });
};

// UPDATE RESOURCE Instructor
export const updateResource = async (req, res) => {
  const resource = await updateResourceService(
    req.params.id,
    req.user._id,
    req.body,
  );

  return res.status(200).json({
    success: true,
    message: "Resource updated successfully.",
    resource,
  });
};

// ADMIN UPDATE
export const adminUpdateResource = async (req, res) => {
  const resource = await adminUpdateResourceService(req.params.id, req.body);

  return res.status(200).json({
    success: true,
    message: "Resource updated successfully.",
    resource,
  });
};

// DELETE RESOURCE Instructor
export const deleteResource = async (req, res) => {
  await deleteResourceService(req.params.id, req.user._id);

  return res.status(200).json({
    success: true,
    message: "Resource deleted successfully.",
  });
};

// ADMIN DELETE
export const adminDeleteResource = async (req, res) => {
  await adminDeleteResourceService(req.params.id);

  return res.status(200).json({
    success: true,
    message: "Resource deleted successfully.",
  });
};
