import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema(
  {
    certificateNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

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

    issuedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    issueDate: {
      type: Date,
      default: Date.now,
    },

    completionDate: {
      type: Date,
      default: Date.now,
    },

    grade: {
      type: Number,
      min: 0,
      max: 100,
      default: null,
    },

    status: {
      type: String,
      enum: ["Issued", "Revoked"],
      default: "Issued",
    },

    certificateUrl: {
      type: String,
      default: "",
    },

    verificationCode: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

certificateSchema.index({ student: 1 });
certificateSchema.index({ course: 1 });

export default mongoose.model("Certificate", certificateSchema);
