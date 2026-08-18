import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
    {
        title: {
            type: String,
            required: true,
            trim: true,
        },

        companyName: {
            type: String,
            required: true,
            trim: true,
        },

        companyLogo: {
            type: String,
            default: "",
        },

        description: {
            type: String,
            required: true,
        },

        requirements: [
            {
                type: String,
                trim: true,
            },
        ],

        location: {
            type: String,
            default: "",
        },

        employmentType: {
            type: String,
            enum: ["Full Time", "Part Time", "Internship", "Contract"],
            default: "Full Time",
        },

        applicationDeadline: {
            type: Date,
            required: true,
        },

        applicationUrl: {
            type: String,
            default: "",
        },

        status: {
            type: String,
            enum: ["Draft", "Published", "Closed", "Expired"],
            default: "Draft",
        },

        postedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

export default mongoose.model("Job", jobSchema);
