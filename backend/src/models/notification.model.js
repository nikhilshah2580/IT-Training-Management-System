import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 200,
    },

    message: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },

    type: {
      type: String,
      enum: [
        "system",
        "course",
        "enrollment",
        "assignment",
        "submission",
        "payment",
        "certificate",
        "attendance",
        "job",
        "placement",
        "contact",
        "testimonial",
        "review",
      ],
      default: "system",
      index: true,
    },

    referenceId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },

    referenceModel: {
      type: String,
      enum: [
        "Course",
        "Enrollment",
        "Assignment",
        "Submission",
        "Payment",
        "Certificate",
        "Attendance",
        "JobListing",
        "JobPlacement",
        "Contact",
        "Testimonial",
        "Review",
        "JobApplication",
        null,
      ],
      default: null,
    },

    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },

    readAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Fast notification queries
notificationSchema.index({
  recipient: 1,
  isRead: 1,
  createdAt: -1,
});

notificationSchema.index({
  recipient: 1,
  createdAt: -1,
});

const Notification = mongoose.model("Notification", notificationSchema);

export default Notification;
