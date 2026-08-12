import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            default: null,
        },

        message: {
            type: String,
            required: true,
            trim: true,
            minlength: 10,
            maxlength: 1000,
        },

        rating: {
            type: Number,
            min: 1,
            max: 5,
            default: 5,
        },

        status: {
            type: String,
            enum: ["Pending", "Approved", "Rejected"],
            default: "Pending",
        },

        isFeatured: {
            type: Boolean,
            default: false,
        },

        adminNote: {
            type: String,
            default: "",
            trim: true,
        },
    },
    {
        timestamps: true,
    },
);

testimonialSchema.index({ status: 1 });
testimonialSchema.index({ student: 1 });
testimonialSchema.index({ course: 1 });

export default mongoose.model(
    "Testimonial",
    testimonialSchema,
);