import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
    {
        assignment: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Assignment",
            required: true,
        },

        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        file: {
            type: String,
            required: true,
        },

        grade: {
            type: Number,
            default: null,
            min: 0,
        },

        feedback: {
            type: String,
            default: "",
        },

        status: {
            type: String,
            enum: ["Submitted", "Graded", "Late"],
            default: "Submitted",
        },

        submittedAt: {
            type: Date,
            default: Date.now,
        },

        gradedAt: {
            type: Date,
            default: null,
        },
    },
    {
        timestamps: true,
    },
);

submissionSchema.index(
    { assignment: 1, student: 1 },
    { unique: true },
);

export default mongoose.model("Submission", submissionSchema);