import mongoose from "mongoose";
import Testimonial from "../models/testimonial.model.js";
import User from "../models/user.model.js";
import Course from "../models/course.model.js";

const validateObjectId = (id, fieldName) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error(`Invalid ${fieldName}`);
        error.statusCode = 400;
        throw error;
    }
};

// Create testimonial
export const createTestimonialService = async (studentId, data) => {
    const { course, message, rating } = data;

    const student = await User.findById(studentId);

    if (!student) {
        const error = new Error("Student not found");
        error.statusCode = 404;
        throw error;
    }

    if (student.role !== "student") {
        const error = new Error("Only students can submit testimonials");
        error.statusCode = 403;
        throw error;
    }

    if (course) {
        validateObjectId(course, "course ID");

        const courseExists = await Course.findById(course);

        if (!courseExists) {
            const error = new Error("Course not found");
            error.statusCode = 404;
            throw error;
        }
    }

    if (!message || !message.trim()) {
        const error = new Error("Testimonial message is required");
        error.statusCode = 400;
        throw error;
    }

    const testimonial = await Testimonial.create({
        student: studentId,
        course: course || null,
        message: message.trim(),
        rating: rating || 5,
    });

    return await Testimonial.findById(testimonial._id)
        .populate("student", "fullName email photo")
        .populate("course", "title");
};

// Public approved testimonials
export const getApprovedTestimonialsService = async ({
    page = 1,
    limit = 10,
} = {}) => {
    page = Math.max(Number(page), 1);
    limit = Math.min(Math.max(Number(limit), 1), 50);

    const skip = (page - 1) * limit;

    const [testimonials, total] = await Promise.all([
        Testimonial.find({
            status: "Approved",
        })
            .populate("student", "fullName photo")
            .populate("course", "title")
            .sort({
                isFeatured: -1,
                createdAt: -1,
            })
            .skip(skip)
            .limit(limit),

        Testimonial.countDocuments({
            status: "Approved",
        }),
    ]);

    return {
        testimonials,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};

// Get student's own testimonials
export const getMyTestimonialsService = async (studentId) => {
    return await Testimonial.find({
        student: studentId,
    })
        .populate("course", "title")
        .sort({
            createdAt: -1,
        });
};

// Get single testimonial
export const getTestimonialService = async (id) => {
    validateObjectId(id, "testimonial ID");

    return await Testimonial.findById(id)
        .populate("student", "fullName email photo")
        .populate("course", "title");
};

// Update student's testimonial
export const updateMyTestimonialService = async (
    testimonialId,
    studentId,
    data,
) => {
    validateObjectId(testimonialId, "testimonial ID");

    const testimonial = await Testimonial.findById(testimonialId);

    if (!testimonial) {
        const error = new Error("Testimonial not found");
        error.statusCode = 404;
        throw error;
    }

    if (testimonial.student.toString() !== studentId.toString()) {
        const error = new Error("You can only update your own testimonial");
        error.statusCode = 403;
        throw error;
    }

    if (testimonial.status === "Approved") {
        const error = new Error("Approved testimonials cannot be edited");
        error.statusCode = 400;
        throw error;
    }

    const updates = {};

    if (data.message !== undefined) {
        if (!data.message.trim()) {
            const error = new Error("Testimonial message cannot be empty");
            error.statusCode = 400;
            throw error;
        }

        updates.message = data.message.trim();
    }

    if (data.rating !== undefined) {
        updates.rating = data.rating;
    }

    if (data.course !== undefined) {
        if (data.course) {
            validateObjectId(data.course, "course ID");

            const course = await Course.findById(data.course);

            if (!course) {
                const error = new Error("Course not found");
                error.statusCode = 404;
                throw error;
            }
        }

        updates.course = data.course || null;
    }

    // Editing sends testimonial back for approval
    updates.status = "Pending";
    updates.adminNote = "";

    return await Testimonial.findByIdAndUpdate(testimonialId, updates, {
        returnDocument: "after",
        runValidators: true,
    })
        .populate("student", "fullName email photo")
        .populate("course", "title");
};

// Admin get all testimonials
export const getAllTestimonialsService = async ({
    status,
    page = 1,
    limit = 10,
} = {}) => {
    page = Math.max(Number(page), 1);
    limit = Math.min(Math.max(Number(limit), 1), 50);

    const filter = {};

    if (status && ["Pending", "Approved", "Rejected"].includes(status)) {
        filter.status = status;
    }

    const skip = (page - 1) * limit;

    const [testimonials, total] = await Promise.all([
        Testimonial.find(filter)
            .populate("student", "fullName email photo")
            .populate("course", "title")
            .sort({
                createdAt: -1,
            })
            .skip(skip)
            .limit(limit),

        Testimonial.countDocuments(filter),
    ]);

    return {
        testimonials,
        pagination: {
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit),
        },
    };
};

// Admin approve testimonial
export const approveTestimonialService = async (id) => {
    validateObjectId(id, "testimonial ID");

    const testimonial = await Testimonial.findByIdAndUpdate(
        id,
        {
            status: "Approved",
            adminNote: "",
        },
        {
            returnDocument: "after",
            runValidators: true,
        },
    )
        .populate("student", "fullName email photo")
        .populate("course", "title");

    if (!testimonial) {
        const error = new Error("Testimonial not found");
        error.statusCode = 404;
        throw error;
    }

    return testimonial;
};

// Admin reject testimonial
export const rejectTestimonialService = async (id, adminNote = "") => {
    validateObjectId(id, "testimonial ID");

    const testimonial = await Testimonial.findByIdAndUpdate(
        id,
        {
            status: "Rejected",
            adminNote: adminNote.trim(),
            isFeatured: false,
        },
        {
            returnDocument: "after",
            runValidators: true,
        },
    )
        .populate("student", "fullName email photo")
        .populate("course", "title");

    if (!testimonial) {
        const error = new Error("Testimonial not found");
        error.statusCode = 404;
        throw error;
    }

    return testimonial;
};

// Admin feature/unfeature testimonial
export const toggleFeaturedTestimonialService = async (id) => {
    validateObjectId(id, "testimonial ID");

    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
        const error = new Error("Testimonial not found");
        error.statusCode = 404;
        throw error;
    }

    if (testimonial.status !== "Approved") {
        const error = new Error("Only approved testimonials can be featured");
        error.statusCode = 400;
        throw error;
    }

    testimonial.isFeatured = !testimonial.isFeatured;

    await testimonial.save();

    return await Testimonial.findById(id)
        .populate("student", "fullName email photo")
        .populate("course", "title");
};

// Delete student's own testimonial
export const deleteMyTestimonialService = async (id, studentId) => {
    validateObjectId(id, "testimonial ID");

    const testimonial = await Testimonial.findById(id);

    if (!testimonial) {
        const error = new Error("Testimonial not found");
        error.statusCode = 404;
        throw error;
    }

    if (testimonial.student.toString() !== studentId.toString()) {
        const error = new Error("You can only delete your own testimonial");
        error.statusCode = 403;
        throw error;
    }

    await Testimonial.findByIdAndDelete(id);

    return true;
};

// Admin delete testimonial
export const deleteTestimonialService = async (id) => {
    validateObjectId(id, "testimonial ID");

    const testimonial = await Testimonial.findByIdAndDelete(id);

    if (!testimonial) {
        const error = new Error("Testimonial not found");
        error.statusCode = 404;
        throw error;
    }

    return testimonial;
};
