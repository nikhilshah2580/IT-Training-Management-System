import mongoose from "mongoose";

const courseResourceSchema = new mongoose.Schema(
    {
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },

        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            default: "",
        },

        type: {
            type: String,
            enum: ["Video", "PDF", "Document", "Link", "Other"],
            required: true,
        },

        url: {
            type: String,
            required: true,
        },

        order: {
            type: Number,
            default: 0,
        },

        isPublished: {
            type: Boolean,
            default: true,
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model("CourseResource", courseResourceSchema);