import mongoose from "mongoose";

const attendanceSchema = new mongoose.Schema(
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

        date: {
            type: Date,
            required: true,
        },

        status: {
            type: String,
            enum: ["Present", "Absent", "Late", "Leave"],
            required: true,
        },

        remarks: {
            type: String,
            default: "",
        },

        markedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
    },
    {
        timestamps: true,
    },
);

attendanceSchema.index(
    { student: 1, course: 1, date: 1 },
    { unique: true },
);

export default mongoose.model("Attendance", attendanceSchema);