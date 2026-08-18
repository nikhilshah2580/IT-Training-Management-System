import Course from "../models/course.model.js";
import User from "../models/user.model.js";

// CREATE COURSE
export const createCourseService = async (data, instructorId) => {
    const instructor = await User.findById(instructorId);

    if (!instructor) {
        const error = new Error("Instructor not found");
        error.statusCode = 404;
        throw error;
    }

    if (instructor.role !== "instructor") {
        const error = new Error("Selected user is not an instructor");
        error.statusCode = 400;
        throw error;
    }

    const course = await Course.create({
        ...data,
        instructor: instructorId,
        status: "Pending",
        isApproved: false,
    });

    return await Course.findById(course._id).populate(
        "instructor",
        "fullName email phone photo",
    );
};

// GET ALL COURSES
export const getCoursesService = async ({
    category,
    skillLevel,
    status,
    search,
    instructor,
    page = 1,
    limit = 10,
} = {}) => {
    const query = {};

    if (category) {
        query.category = category;
    }

    if (skillLevel) {
        query.skillLevel = skillLevel;
    }

    if (status) {
        query.status = status;
    }

    if (instructor) {
        query.instructor = instructor;
    }

    if (search) {
        query.$text = {
            $search: search,
        };
    }

    const pageNumber = Math.max(Number(page) || 1, 1);
    const limitNumber = Math.min(Math.max(Number(limit) || 10, 1), 100);

    const skip = (pageNumber - 1) * limitNumber;

    const [courses, total] = await Promise.all([
        Course.find(query)
            .populate("instructor", "fullName email phone photo")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNumber),

        Course.countDocuments(query),
    ]);

    return {
        courses,
        pagination: {
            total,
            page: pageNumber,
            limit: limitNumber,
            totalPages: Math.ceil(total / limitNumber),
        },
    };
};

// PUBLIC COURSES Only approved/active courses are public.
export const getPublicCoursesService = async (params = {}) => {
    return getCoursesService({
        ...params,
        status: "Active",
    });
};

// INSTRUCTOR COURSES
export const getInstructorCoursesService = async (
    instructorId,
    params = {},
) => {
    return getCoursesService({
        ...params,
        instructor: instructorId,
    });
};

// ADMIN COURSES
export const getAdminCoursesService = async (params = {}) => {
    return getCoursesService(params);
};

// GET SINGLE COURSE
export const getCourseService = async (id) => {
    return await Course.findById(id)
        .populate("instructor", "fullName email phone photo")
        .populate("approvedBy", "fullName email");
};

// UPDATE COURSE
export const updateCourseService = async (id, data, user) => {
    const course = await Course.findById(id);

    if (!course) {
        const error = new Error("Course not found");
        error.statusCode = 404;
        throw error;
    }

    /*
        Instructor can update only their own course.
        Admin can update any course.
      */

    if (
        user.role === "instructor" &&
        course.instructor.toString() !== user._id.toString()
    ) {
        const error = new Error("You can only update your own courses");
        error.statusCode = 403;
        throw error;
    }

    /*
        Instructor editing a course sends it back
        for admin approval.
      */

    const allowedFields = [
        "title",
        "description",
        "category",
        "skillLevel",
        "syllabus",
        "duration",
        "fee",
        "prerequisites",
        "enrollmentDeadline",
        "courseImage",
        "resources",
    ];

    const updates = {};
    allowedFields.forEach((field) => {
        if (data[field] !== undefined) {
            updates[field] = data[field];
        }
    });

    if (user.role === "instructor") {
        updates.status = "Pending";
        updates.isApproved = false;
        updates.approvedBy = null;
        updates.approvedAt = null;
    }

    // Admin may explicitly change status through the dedicated status endpoint.
    // Do not allow arbitrary approval fields through this edit endpoint.
    const updatedCourse = await Course.findByIdAndUpdate(id, updates, {
        returnDocument: "after",
        runValidators: true,
    }).populate("instructor", "fullName email phone photo");

    return updatedCourse;
};

// DELETE COURSE
export const deleteCourseService = async (id, user) => {
    const course = await Course.findById(id);

    if (!course) {
        const error = new Error("Course not found");
        error.statusCode = 404;
        throw error;
    }

    if (
        user.role === "instructor" &&
        course.instructor.toString() !== user._id.toString()
    ) {
        const error = new Error("You can only delete your own courses");
        error.statusCode = 403;
        throw error;
    }

    await Course.findByIdAndDelete(id);

    return course;
};

// APPROVE COURSE
export const approveCourseService = async (id, adminId) => {
    const course = await Course.findById(id);

    if (!course) {
        const error = new Error("Course not found");
        error.statusCode = 404;
        throw error;
    }

    course.status = "Active";
    course.isApproved = true;
    course.approvedBy = adminId;
    course.approvedAt = new Date();

    await course.save();

    return await Course.findById(course._id)
        .populate("instructor", "fullName email phone photo")
        .populate("approvedBy", "fullName email");
};

// REJECT COURSE
export const rejectCourseService = async (id) => {
    const course = await Course.findById(id);

    if (!course) {
        const error = new Error("Course not found");
        error.statusCode = 404;
        throw error;
    }

    course.status = "Rejected";
    course.isApproved = false;

    await course.save();

    return course;
};

// CHANGE COURSE STATUS
export const updateCourseStatusService = async (id, status) => {
    const allowedStatuses = ["Pending", "Active", "Inactive", "Rejected"];

    if (!allowedStatuses.includes(status)) {
        const error = new Error("Invalid course status");
        error.statusCode = 400;
        throw error;
    }

    const updates = {
        status,
        ...(status === "Active" ? { isApproved: true } : { isApproved: false }),
    };

    const course = await Course.findByIdAndUpdate(id, updates, {
        returnDocument: "after",
        runValidators: true,
    });

    if (!course) {
        const error = new Error("Course not found");
        error.statusCode = 404;
        throw error;
    }

    return course;
};
