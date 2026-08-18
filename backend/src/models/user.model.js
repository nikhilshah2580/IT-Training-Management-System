import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
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
      required: function () {
        return this.authProvider !== "google";
      },
      select: false,
    },

    phone: {
      type: String,
      default: "",
      trim: true,
    },

    address: {
      type: String,
      default: "",
      trim: true,
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

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    googleId: {
      type: String,
      default: "",
      unique: true,
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
      select: false,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("User", userSchema);
