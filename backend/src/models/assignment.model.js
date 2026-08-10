import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema(
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
            required: true,
        },

        dueDate: {
            type: Date,
            required: true,
        },

        attachment: {
            type: String,
            default: "",
        },

        totalMarks: {
            type: Number,
            default: 100,
            min: 0,
        },

        status: {
            type: String,
            enum: ["Active", "Closed"],
            default: "Active",
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model("Assignment", assignmentSchema);