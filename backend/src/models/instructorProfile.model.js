import mongoose from "mongoose";

const instructorProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    bio: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },

    designation: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    specialization: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    qualification: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

    experience: {
      type: Number,
      min: 0,
      default: 0,
    },

    skills: {
      type: [String],
      default: [],
    },

    expertise: {
      type: [String],
      default: [],
    },

    achievements: {
      type: [String],
      default: [],
    },

    linkedin: {
      type: String,
      default: "",
      trim: true,
    },

    github: {
      type: String,
      default: "",
      trim: true,
    },

    website: {
      type: String,
      default: "",
      trim: true,
    },

    profilePhoto: {
      type: String,
      default: "",
    },

    isApproved: {
      type: Boolean,
      default: false,
    },

    approvedAt: {
      type: Date,
      default: null,
    },

    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
  },
  {
    timestamps: true,
  },
);

instructorProfileSchema.index({ specialization: 1 });
instructorProfileSchema.index({ status: 1 });
instructorProfileSchema.index({ isApproved: 1 });

export default mongoose.model("InstructorProfile", instructorProfileSchema);
