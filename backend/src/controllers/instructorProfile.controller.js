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

/* ----------------------------------------
   CREATE PROFILE
   Instructor only
----------------------------------------- */

export const createInstructorProfile = async (req, res) => {
    const profile = await createInstructorProfileService(req.user._id, req.body);

    return res.status(201).json({
        success: true,
        message: "Instructor profile created successfully",
        profile,
    });
};

/* ----------------------------------------
   GET MY PROFILE
----------------------------------------- */

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

/* ----------------------------------------
   GET PUBLIC PROFILE
----------------------------------------- */

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

/* ----------------------------------------
   GET APPROVED INSTRUCTORS
----------------------------------------- */

export const getApprovedInstructors = async (req, res) => {
    const profiles = await getApprovedInstructorProfilesService();

    return res.status(200).json({
        success: true,
        count: profiles.length,
        profiles,
    });
};

/* ----------------------------------------
   ADMIN GET ALL
----------------------------------------- */

export const getAllInstructorProfiles = async (req, res) => {
    const profiles = await getAllInstructorProfilesService();

    return res.status(200).json({
        success: true,
        count: profiles.length,
        profiles,
    });
};

/* ----------------------------------------
   UPDATE OWN PROFILE
----------------------------------------- */

export const updateInstructorProfile = async (req, res) => {
    const profile = await updateInstructorProfileService(req.user._id, req.body);

    return res.status(200).json({
        success: true,
        message: "Instructor profile updated successfully. Awaiting admin approval.",
        profile,
    });
};

/* ----------------------------------------
   ADMIN APPROVE
----------------------------------------- */

export const approveInstructorProfile = async (req, res) => {
    const profile = await approveInstructorProfileService(req.params.id, req.user._id);

    return res.status(200).json({
        success: true,
        message: "Instructor profile approved successfully",
        profile,
    });
};

/* ----------------------------------------
   ADMIN REJECT
----------------------------------------- */

export const rejectInstructorProfile = async (req, res) => {
    const profile = await rejectInstructorProfileService(req.params.id, req.user._id);

    return res.status(200).json({
        success: true,
        message: "Instructor profile rejected successfully",
        profile,
    });
};

/* ----------------------------------------
   ADMIN DELETE
----------------------------------------- */

export const deleteInstructorProfile = async (req, res) => {
    await deleteInstructorProfileService(req.params.id);

    return res.status(200).json({
        success: true,
        message: "Instructor profile deleted successfully",
    });
};
