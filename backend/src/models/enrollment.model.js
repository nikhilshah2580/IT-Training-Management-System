import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
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

        enrollmentDate: {
            type: Date,
            default: Date.now,
        },

        startDate: {
            type: Date,
            default: null,
        },

        completionDate: {
            type: Date,
            default: null,
        },

        progress: {
            type: Number,
            default: 0,
            min: 0,
            max: 100,
        },

        status: {
            type: String,
            enum: [
                "Pending",
                "Active",
                "Completed",
                "Cancelled",
                "Dropped",
            ],
            default: "Pending",
        },
    },
    {
        timestamps: true,
    },
);

enrollmentSchema.index(
    { student: 1, course: 1 },
    { unique: true },
);

export default mongoose.model("Enrollment", enrollmentSchema);