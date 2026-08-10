import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
        },

        certificateNumber: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },

        issueDate: {
            type: Date,
            default: Date.now,
        },

        certificateUrl: {
            type: String,
            default: "",
        },

        status: {
            type: String,
            enum: ["Issued", "Revoked"],
            default: "Issued",
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model("Certificate", certificateSchema);