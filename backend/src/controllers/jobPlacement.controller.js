import {
  createJobPlacementService,
  getJobPlacementsService,
  getJobPlacementService,
  getStudentPlacementsService,
  updateJobPlacementService,
  updateJobPlacementStatusService,
  deleteJobPlacementService,
} from "../services/jobPlacement.service.js";

/* ----------------------------------------
   ADMIN CREATE PLACEMENT
----------------------------------------- */

export const createJobPlacement = async (req, res) => {
  const placement = await createJobPlacementService(req.body);

  return res.status(201).json({
    success: true,
    message: "Job placement created successfully",
    placement,
  });
};

/* ----------------------------------------
   ADMIN GET ALL PLACEMENTS
----------------------------------------- */

export const getJobPlacements = async (req, res) => {
  const { status, search, page, limit } = req.query;

  const result = await getJobPlacementsService({
    status,
    search,
    page,
    limit,
  });

  return res.status(200).json({
    success: true,
    ...result,
  });
};

/* ----------------------------------------
   GET SINGLE PLACEMENT
----------------------------------------- */

export const getJobPlacement = async (req, res) => {
  const placement = await getJobPlacementService(req.params.id);

  if (!placement) {
    const error = new Error("Job placement not found");
    error.statusCode = 404;
    throw error;
  }

  return res.status(200).json({
    success: true,
    placement,
  });
};

/* ----------------------------------------
   STUDENT GET OWN PLACEMENTS
----------------------------------------- */

export const getMyPlacements = async (req, res) => {
  const placements = await getStudentPlacementsService(req.user._id);

  return res.status(200).json({
    success: true,
    placements,
  });
};

/* ----------------------------------------
   ADMIN UPDATE PLACEMENT
----------------------------------------- */

export const updateJobPlacement = async (req, res) => {
  const placement = await updateJobPlacementService(req.params.id, req.body);

  return res.status(200).json({
    success: true,
    message: "Job placement updated successfully",
    placement,
  });
};

/* ----------------------------------------
   ADMIN UPDATE STATUS
----------------------------------------- */

export const updateJobPlacementStatus = async (req, res) => {
  const { status } = req.body;

  if (!status) {
    const error = new Error("Status is required");
    error.statusCode = 400;
    throw error;
  }

  const placement = await updateJobPlacementStatusService(req.params.id, status);

  if (!placement) {
    const error = new Error("Job placement not found");
    error.statusCode = 404;
    throw error;
  }

  return res.status(200).json({
    success: true,
    message: "Placement status updated successfully",
    placement,
  });
};

/* ----------------------------------------
   ADMIN DELETE PLACEMENT
----------------------------------------- */

export const deleteJobPlacement = async (req, res) => {
  const placement = await deleteJobPlacementService(req.params.id);

  if (!placement) {
    const error = new Error("Job placement not found");
    error.statusCode = 404;
    throw error;
  }

  return res.status(200).json({
    success: true,
    message: "Job placement deleted successfully",
  });
};
