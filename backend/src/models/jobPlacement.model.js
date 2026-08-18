import mongoose from "mongoose";

const jobPlacementSchema = new mongoose.Schema(
    {
        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        companyName: {
            type: String,
            required: true,
            trim: true,
        },

        jobTitle: {
            type: String,
            required: true,
            trim: true,
        },

        location: {
            type: String,
            default: "",
            trim: true,
        },

        salary: {
            type: Number,
            min: 0,
            default: null,
        },

        joiningDate: {
            type: Date,
            default: null,
        },

        placementDate: {
            type: Date,
            default: Date.now,
        },

        employmentType: {
            type: String,
            enum: ["Full-time", "Part-time", "Internship", "Contract", "Remote"],
            default: "Full-time",
        },

        status: {
            type: String,
            enum: ["Placed", "Joined", "Resigned", "Pending"],
            default: "Placed",
        },

        description: {
            type: String,
            default: "",
            trim: true,
        },

        companyLogo: {
            type: String,
            default: "",
        },

        offerLetter: {
            type: String,
            default: "",
        },

        notes: {
            type: String,
            default: "",
        },
    },
    {
        timestamps: true,
    },
);

jobPlacementSchema.index({ student: 1 });
jobPlacementSchema.index({ companyName: 1 });
jobPlacementSchema.index({ status: 1 });
jobPlacementSchema.index({ placementDate: -1 });

export default mongoose.model("JobPlacement", jobPlacementSchema);
