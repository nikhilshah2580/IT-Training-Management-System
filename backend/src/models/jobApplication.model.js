import mongoose from "mongoose";

const jobApplicationSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    name: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, required: true, trim: true, maxlength: 30 },
    resumeFile: { type: String, required: true },
    resumeName: { type: String, default: "resume" },
    coverNote: { type: String, default: "", trim: true, maxlength: 2000 },
    status: {
      type: String,
      enum: ["Pending", "Reviewed", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true },
);

jobApplicationSchema.index({ job: 1, createdAt: -1 });
jobApplicationSchema.index({ email: 1 });

export default mongoose.model("JobApplication", jobApplicationSchema);