import mongoose from "mongoose";

const instructorProfileSchema = new mongoose.Schema(
    {
        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            unique: true,
        },

        bio: {
            type: String,
            default: "",
        },

        qualification: {
            type: String,
            default: "",
        },

        specialization: {
            type: String,
            default: "",
        },

        experience: {
            type: Number,
            default: 0,
            min: 0,
        },

        certifications: [
            {
                name: {
                    type: String,
                    trim: true,
                },

                issuer: {
                    type: String,
                    trim: true,
                },

                year: {
                    type: Number,
                },
            },
        ],

        skills: [
            {
                type: String,
                trim: true,
            },
        ],

        linkedin: {
            type: String,
            default: "",
        },

        website: {
            type: String,
            default: "",
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

export default mongoose.model(
    "InstructorProfile",
    instructorProfileSchema,
);