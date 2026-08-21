import {
  createInstructorProfileService,
  getMyInstructorProfileService,
  getInstructorProfileService,
  getApprovedInstructorProfilesService,
  getAllInstructorProfilesService,
  updateInstructorProfileService,
  approveInstructorProfileService,
  rejectInstructorProfileService,
  deleteInstructorProfileService,
} from "../services/instructorProfile.service.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

const prepareInstructorProfilePayload = async (req) => {
  const payload = { ...req.body };

  ["skills", "expertise", "achievements"].forEach((field) => {
    if (typeof payload[field] === "string") {
      payload[field] = payload[field] ? JSON.parse(payload[field]) : [];
    }
  });

  if (payload.experience !== undefined && payload.experience !== "") {
    payload.experience = Number(payload.experience);
  }

  if (req.file) {
    const image = await uploadOnCloudinary(req.file.path);

    if (!image?.secure_url) {
      const error = new Error("Image upload failed");
      error.statusCode = 500;
      throw error;
    }

    payload.profilePhoto = image.secure_url;
  }

  return payload;
};

// CREATE PROFILE Instructor only
export const createInstructorProfile = async (req, res) => {
  const payload = await prepareInstructorProfilePayload(req);
  const profile = await createInstructorProfileService(req.user._id, payload);

  return res.status(201).json({
    success: true,
    message: "Instructor profile created successfully",
    profile,
  });
};

// GET MY PROFILE
export const getMyInstructorProfile = async (req, res) => {
  const profile = await getMyInstructorProfileService(req.user._id);

  if (!profile) {
    const error = new Error("Instructor profile not found");
    error.statusCode = 404;
    throw error;
  }

  return res.status(200).json({
    success: true,
    profile,
  });
};

// GET PUBLIC PROFILE
export const getInstructorProfile = async (req, res) => {
  const profile = await getInstructorProfileService(req.params.id);

  if (!profile) {
    const error = new Error("Instructor profile not found");
    error.statusCode = 404;
    throw error;
  }

  if (!profile.isApproved) {
    const error = new Error("Instructor profile is not approved");
    error.statusCode = 403;
    throw error;
  }

  return res.status(200).json({
    success: true,
    profile,
  });
};

// GET APPROVED INSTRUCTORS
export const getApprovedInstructors = async (req, res) => {
  const profiles = await getApprovedInstructorProfilesService();

  return res.status(200).json({
    success: true,
    count: profiles.length,
    profiles,
  });
};

// ADMIN GET ALL
export const getAllInstructorProfiles = async (req, res) => {
  const profiles = await getAllInstructorProfilesService();

  return res.status(200).json({
    success: true,
    count: profiles.length,
    profiles,
  });
};

// UPDATE OWN PROFILE
export const updateInstructorProfile = async (req, res) => {
  const payload = await prepareInstructorProfilePayload(req);
  const profile = await updateInstructorProfileService(req.user._id, payload);

  return res.status(200).json({
    success: true,
    message:
      "Instructor profile updated successfully. Awaiting admin approval.",
    profile,
  });
};

// ADMIN APPROVE
export const approveInstructorProfile = async (req, res) => {
  const profile = await approveInstructorProfileService(
    req.params.id,
    req.user._id,
  );

  return res.status(200).json({
    success: true,
    message: "Instructor profile approved successfully",
    profile,
  });
};

// ADMIN REJECT
export const rejectInstructorProfile = async (req, res) => {
  const profile = await rejectInstructorProfileService(
    req.params.id,
    req.user._id,
  );

  return res.status(200).json({
    success: true,
    message: "Instructor profile rejected successfully",
    profile,
  });
};

// ADMIN DELETE
export const deleteInstructorProfile = async (req, res) => {
  await deleteInstructorProfileService(req.params.id);

  return res.status(200).json({
    success: true,
    message: "Instructor profile deleted successfully",
  });
};
