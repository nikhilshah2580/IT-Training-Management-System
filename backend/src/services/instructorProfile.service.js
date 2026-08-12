import InstructorProfile from "../models/instructorProfile.model.js";
import User from "../models/user.model.js";

/* ----------------------------------------
   CREATE PROFILE
----------------------------------------- */

export const createInstructorProfileService = async (userId, data) => {
    const user = await User.findById(userId);

    if (!user) {
        const error = new Error("User not found");
        error.statusCode = 404;
        throw error;
    }

    if (user.role !== "instructor") {
        const error = new Error("Only instructors can create an instructor profile");
        error.statusCode = 403;
        throw error;
    }

    const existingProfile = await InstructorProfile.findOne({
        user: userId,
    });

    if (existingProfile) {
        const error = new Error("Instructor profile already exists");
        error.statusCode = 400;
        throw error;
    }

    return await InstructorProfile.create({
        user: userId,
        ...data,
    });
};

/* ----------------------------------------
   GET OWN PROFILE
----------------------------------------- */

export const getMyInstructorProfileService = async (userId) => {
    return await InstructorProfile.findOne({
        user: userId,
    })
        .populate("user", "fullName email phone photo role")
        .populate("approvedBy", "fullName email");
};

/* ----------------------------------------
   GET PROFILE BY ID
----------------------------------------- */

export const getInstructorProfileService = async (id) => {
    return await InstructorProfile.findById(id).populate("user", "fullName email phone photo role").populate("approvedBy", "fullName email");
};

/* ----------------------------------------
   GET ALL APPROVED INSTRUCTORS
----------------------------------------- */

export const getApprovedInstructorProfilesService = async () => {
    return await InstructorProfile.find({
        isApproved: true,
        status: "Approved",
    })
        .populate("user", "fullName email phone photo role")
        .sort({
            createdAt: -1,
        });
};

/* ----------------------------------------
   ADMIN GET ALL PROFILES
----------------------------------------- */

export const getAllInstructorProfilesService = async () => {
    return await InstructorProfile.find().populate("user", "fullName email phone photo role").populate("approvedBy", "fullName email").sort({
        createdAt: -1,
    });
};

/* ----------------------------------------
   UPDATE OWN PROFILE
----------------------------------------- */

export const updateInstructorProfileService = async (userId, data) => {
    const profile = await InstructorProfile.findOne({
        user: userId,
    });

    if (!profile) {
        const error = new Error("Instructor profile not found");
        error.statusCode = 404;
        throw error;
    }

    // If instructor changes profile,
    // send it for approval again.
    const updates = {
        ...data,
        status: "Pending",
        isApproved: false,
        approvedAt: null,
        approvedBy: null,
    };

    return await InstructorProfile.findOneAndUpdate({ user: userId }, updates, {
        returnDocument: "after",
        runValidators: true,
    }).populate("user", "fullName email phone photo role");
};

/* ----------------------------------------
   ADMIN APPROVE PROFILE
----------------------------------------- */

export const approveInstructorProfileService = async (profileId, adminId) => {
    const profile = await InstructorProfile.findById(profileId);

    if (!profile) {
        const error = new Error("Instructor profile not found");
        error.statusCode = 404;
        throw error;
    }

    return await InstructorProfile.findByIdAndUpdate(
        profileId,
        {
            status: "Approved",
            isApproved: true,
            approvedAt: new Date(),
            approvedBy: adminId,
        },
        {
            returnDocument: "after",
            runValidators: true,
        },
    )
        .populate("user", "fullName email phone photo role")
        .populate("approvedBy", "fullName email");
};

/* ----------------------------------------
   ADMIN REJECT PROFILE
----------------------------------------- */

export const rejectInstructorProfileService = async (profileId, adminId) => {
    const profile = await InstructorProfile.findById(profileId);

    if (!profile) {
        const error = new Error("Instructor profile not found");
        error.statusCode = 404;
        throw error;
    }

    return await InstructorProfile.findByIdAndUpdate(
        profileId,
        {
            status: "Rejected",
            isApproved: false,
            approvedAt: null,
            approvedBy: adminId,
        },
        {
            returnDocument: "after",
            runValidators: true,
        },
    )
        .populate("user", "fullName email phone photo role")
        .populate("approvedBy", "fullName email");
};

/* ----------------------------------------
   DELETE PROFILE
----------------------------------------- */

export const deleteInstructorProfileService = async (profileId) => {
    const profile = await InstructorProfile.findByIdAndDelete(profileId);

    if (!profile) {
        const error = new Error("Instructor profile not found");
        error.statusCode = 404;
        throw error;
    }

    return profile;
};
