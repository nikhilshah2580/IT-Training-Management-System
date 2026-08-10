import mongoose from "mongoose";

const courseSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 150,
        },

        description: {
            type: String,
            required: true,
            trim: true,
        },

        category: {
            type: String,
            required: true,
            enum: [
                "Programming",
                "Web Development",
                "Data Science & Analytics",
                "Graphic Design",
                "Networking",
                "Cyber Security",
                "Database",
                "Cloud Computing",
                "Other",
            ],
        },

        skillLevel: {
            type: String,
            required: true,
            enum: ["Beginner", "Intermediate", "Advanced"],
            default: "Beginner",
        },

        syllabus: {
            type: String,
            required: true,
        },

        duration: {
            type: String,
            required: true,
            trim: true,
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
            trim: true,
        },

        enrollmentDeadline: {
            type: Date,
            default: null,
        },

        courseImage: {
            type: String,
            default: "",
        },

        resources: [
            {
                title: {
                    type: String,
                    trim: true,
                },

                type: {
                    type: String,
                    enum: ["Video", "PDF", "Document", "Link", "Other"],
                },

                url: {
                    type: String,
                    trim: true,
                },
            },
        ],

        enrolledStudents: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],

        totalStudents: {
            type: Number,
            default: 0,
            min: 0,
        },

        status: {
            type: String,
            enum: ["Pending", "Active", "Inactive", "Rejected"],
            default: "Pending",
        },

        isApproved: {
            type: Boolean,
            default: false,
        },

        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            default: null,
        },

        approvedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    },
);

courseSchema.index({
    title: "text",
    description: "text",
});

courseSchema.index({
    category: 1,
    skillLevel: 1,
    status: 1,
});

courseSchema.index({
    instructor: 1,
});

export default mongoose.model("Course", courseSchema);