import mongoose from "mongoose";

const demoClassSchema = new mongoose.Schema(
    {
        course: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Course",
            required: true,
            index: true,
        },

        instructor: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        title: {
            type: String,
            required: true,
            trim: true,
        },

        description: {
            type: String,
            trim: true,
            default: "",
        },

        date: {
            type: Date,
            required: true,
        },

        startTime: {
            type: String,
            required: true,
            trim: true,
        },

        endTime: {
            type: String,
            required: true,
            trim: true,
        },

        duration: {
            type: Number,
            required: true,
            min: 1,
        },

        mode: {
            type: String,
            enum: ["Online", "Offline"],
            default: "Online",
        },

        meetingLink: {
            type: String,
            default: "",
            trim: true,
        },

        location: {
            type: String,
            default: "",
            trim: true,
        },

        maxSeats: {
            type: Number,
            required: true,
            min: 1,
        },

        bookedSeats: {
            type: Number,
            default: 0,
            min: 0,
        },

        status: {
            type: String,
            enum: [
                "Scheduled",
                "Completed",
                "Cancelled",
            ],
            default: "Scheduled",
        },

        bookings: [
            {
                student: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                },

                bookedAt: {
                    type: Date,
                    default: Date.now,
                },

                status: {
                    type: String,
                    enum: [
                        "Booked",
                        "Cancelled",
                        "Attended",
                        "Absent",
                    ],
                    default: "Booked",
                },
            },
        ],
    },
    {
        timestamps: true,
    },
);

/*
  Prevent the same student from booking
  the same demo class more than once.
*/
demoClassSchema.index(
    {
        _id: 1,
        "bookings.student": 1,
    },
    {
        unique: true,
        sparse: true,
    },
);

export default mongoose.model(
    "DemoClass",
    demoClassSchema,
);