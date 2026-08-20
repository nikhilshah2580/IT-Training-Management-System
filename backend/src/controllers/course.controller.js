import * as courseService from "../services/course.service.js";
import uploadOnCloudinary from "../utils/cloudinary.js";

const prepareCoursePayload = async (req) => {
    const payload = { ...req.body };

    if (typeof payload.resources === "string") {
        payload.resources = payload.resources ? JSON.parse(payload.resources) : [];
    }

    if (payload.enrollmentDeadline === "") {
        payload.enrollmentDeadline = null;
    }

    if (req.file) {
        const image = await uploadOnCloudinary(req.file.path);

        if (!image?.secure_url) {
            const error = new Error("Image upload failed");
            error.statusCode = 500;
            throw error;
        }

        payload.courseImage = image.secure_url;
    }

    return payload;
};

// CREATE COURSE
export const createCourse = async (req, res) => {
    const payload = await prepareCoursePayload(req);

    const course = await courseService.createCourseService(
        payload,
        req.user._id,
    );

    return res.status(201).json({
        success: true,
        message: "Course created successfully and is waiting for admin approval.",
        course,
    });
};

// GET ALL COURSES
export const getCourses = async (req, res) => {
    const result = await courseService.getPublicCoursesService({
        category: req.query.category,
        skillLevel: req.query.skillLevel,
        status: req.query.status,
        search: req.query.search,
        instructor: req.query.instructor,
        page: req.query.page,
        limit: req.query.limit,
    });

    return res.status(200).json({
        success: true,
        ...result,
    });
};

// GET MY COURSES - INSTRUCTOR
export const getMyCourses = async (req, res) => {
    const result = await courseService.getInstructorCoursesService(
        req.user._id,
        req.query,
    );

    return res.status(200).json({
        success: true,
        ...result,
    });
};

// GET ALL COURSES - ADMIN
export const getAdminCourses = async (req, res) => {
    const result = await courseService.getAdminCoursesService(req.query);

    return res.status(200).json({
        success: true,
        ...result,
    });
};

// GET SINGLE COURSE
export const getCourse = async (req, res) => {
    const course = await courseService.getCourseService(req.params.id);

    if (!course) {
        const error = new Error("Course not found");
        error.statusCode = 404;
        throw error;
    }

    return res.status(200).json({
        success: true,
        course,
    });
};

// UPDATE COURSE
export const updateCourse = async (req, res) => {
    const payload = await prepareCoursePayload(req);

    const course = await courseService.updateCourseService(
        req.params.id,
        payload,
        req.user,
    );

    return res.status(200).json({
        success: true,
        message: "Course updated successfully",
        course,
    });
};

// DELETE COURSE
export const deleteCourse = async (req, res) => {
    await courseService.deleteCourseService(req.params.id, req.user);

    return res.status(200).json({
        success: true,
        message: "Course deleted successfully",
    });
};

// APPROVE COURSE
export const approveCourse = async (req, res) => {
    const course = await courseService.approveCourseService(
        req.params.id,
        req.user._id,
    );

    return res.status(200).json({
        success: true,
        message: "Course approved successfully",
        course,
    });
};

// REJECT COURSE
export const rejectCourse = async (req, res) => {
    const course = await courseService.rejectCourseService(req.params.id);

    return res.status(200).json({
        success: true,
        message: "Course rejected successfully",
        course,
    });
};

// UPDATE COURSE STATUS
export const updateCourseStatus = async (req, res) => {
    const { status } = req.body;

    const course = await courseService.updateCourseStatusService(
        req.params.id,
        status,
    );

    return res.status(200).json({
        success: true,
        message: "Course status updated successfully",
        course,
    });
};

