import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
    {
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
            index: true,
        },

        student: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        date: {
            type: Date,
            required: true,
            index: true,
        },

        status: {
            type: String,
            enum: ["Present", "Absent", "Late"],
            required: true,
            default: "Present",
        },

        markedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        remarks: {
            type: String,
            trim: true,
            default: "",
        },
    },
    {
        timestamps: true,
    },
);

// One attendance record per student per course per day
attendanceSchema.index(
    {
        course: 1,
        student: 1,
        date: 1,
    },
    {
        unique: true,
    },
);

export default mongoose.model("Attendance", attendanceSchema);
