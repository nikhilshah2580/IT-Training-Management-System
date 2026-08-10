import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema(
    {
        job: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Job",
            required: true,
        },

        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        resume: {
            type: String,
            required: true,
        },

        coverLetter: {
            type: String,
            default: "",
        },

        status: {
            type: String,
            enum: [
                "Applied",
                "Shortlisted",
                "Interview",
                "Selected",
                "Rejected",
            ],
            default: "Applied",
        },

        appliedAt: {
            type: Date,
            default: Date.now,
        },
    },
    {
        timestamps: true,
    },
);

jobApplicationSchema.index(
    { job: 1, student: 1 },
    { unique: true },
);

export default mongoose.model(
    "JobApplication",
    jobApplicationSchema,
);