import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        name: {
            type: String,
            required: true,
            trim: true,
        },

        photo: {
            type: String,
            default: "",
        },

        content: {
            type: String,
            required: true,
        },

        videoUrl: {
            type: String,
            default: "",
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
    },
    {
        timestamps: true,
    },
);

export default mongoose.model(
    "Testimonial",
    testimonialSchema,
);