import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            required: true,
        },

        category: {
            type: String,
            enum: [
                "Programming",
                "Web Development",
                "Data Science & Analytics",
                "Graphic Design",
                "Database",
                "Networking",
                "Cyber Security",
                "Cloud Computing",
                "DevOps",
                "Other",
            ],
            required: true,
        },

        level: {
            type: String,
            enum: ["Beginner", "Intermediate", "Advanced"],
            required: true,
        },

        syllabus: {
            type: String,
            required: true,
        },

        duration: {
            type: String,
            required: true,
        },

        fee: {
            type: Number,
            required: true,
            min: 0,
        },

        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        prerequisites: {
            type: String,
            default: "",
        },

        image: {
            type: String,
            default: "",
        },

        enrollmentDeadline: {
            type: Date,
            default: null,
        },

        startDate: {
            type: Date,
            default: null,
        },

        endDate: {
            type: Date,
            default: null,
        },

        maxStudents: {
            type: Number,
            default: 0,
            min: 0,
        },

        totalStudents: {
            type: Number,
            default: 0,
            min: 0,
        },

        status: {
            type: String,
            enum: ["Active", "Inactive", "Draft"],
            default: "Draft",
        },

        isApproved: {
            type: Boolean,
            default: false,
        },

        isFeatured: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model("Course", courseSchema);