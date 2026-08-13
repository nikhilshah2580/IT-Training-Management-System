import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    phone: {
      type: String,
      default: "",
    },

    photo: {
      type: String,
      default: "",
    },

    role: {
      type: String,
      enum: ["admin", "student", "instructor"],
      default: "student",
    },

    googleId: {
      type: String,
      default: "",
      sparse: true,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

      verificationOtp: {
      type: String,
      default: "",
      select: false,
    },

    verificationOtpExpire: {
      type: Date,
      default: null,
      select: false,
    },

    resetOtp: {
      type: String,
      default: "",
      select: false,
    },

    resetOtpExpire: {
      type: Date,
      default: null,
      select: false,
    },

    refreshToken: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);