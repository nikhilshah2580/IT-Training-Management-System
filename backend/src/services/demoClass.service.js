import DemoClass from "../models/demoClass.model.js";
import Course from "../models/course.model.js";
import User from "../models/user.model.js";

// CREATE DEMO CLASS Instructor / Admin
export const createDemoClassService = async (data) => {
    const {
        course,
        instructor,
        title,
        description,
        date,
        startTime,
        endTime,
        duration,
        mode,
        meetingLink,
        location,
        maxSeats,
    } = data;

    const courseExists = await Course.findById(course);

    if (!courseExists) {
        const error = new Error("Course not found.");
        error.statusCode = 404;
        throw error;
    }

    const instructorExists = await User.findOne({
        _id: instructor,
        role: "instructor",
    });

    if (!instructorExists) {
        const error = new Error("Instructor not found.");
        error.statusCode = 404;
        throw error;
    }

    if (courseExists.instructor.toString() !== instructor.toString()) {
        const error = new Error("This instructor is not assigned to this course.");

        error.statusCode = 403;
        throw error;
    }

    if (mode === "Online" && !meetingLink) {
        const error = new Error(
            "Meeting link is required for online demo classes.",
        );

        error.statusCode = 400;
        throw error;
    }

    if (mode === "Offline" && !location) {
        const error = new Error("Location is required for offline demo classes.");

        error.statusCode = 400;
        throw error;
    }

    const demoClass = await DemoClass.create({
        course,
        instructor,
        title,
        description,
        date,
        startTime,
        endTime,
        duration,
        mode,
        meetingLink,
        location,
        maxSeats,
    });

    return await DemoClass.findById(demoClass._id)
        .populate("course", "title")
        .populate("instructor", "fullName email photo");
};

// GET ALL DEMO CLASSES
export const getDemoClassesService = async (query = {}) => {
    const { course, instructor, status, mode } = query;

    const filter = {};

    if (course) filter.course = course;
    if (instructor) filter.instructor = instructor;
    if (status) filter.status = status;
    if (mode) filter.mode = mode;

    return await DemoClass.find(filter)
        .populate("course", "title")
        .populate("instructor", "fullName email photo")
        .sort({ date: 1 });
};

// GET SINGLE DEMO CLASS
export const getDemoClassService = async (id) => {
    return await DemoClass.findById(id)
        .populate("course", "title description fee")
        .populate("instructor", "fullName email photo")
        .populate("bookings.student", "fullName email phone photo");
};

// UPDATE DEMO CLASS Instructor
export const updateDemoClassService = async (id, instructorId, data) => {
    const demoClass = await DemoClass.findById(id);

    if (!demoClass) {
        const error = new Error("Demo class not found.");

        error.statusCode = 404;
        throw error;
    }

    if (demoClass.instructor.toString() !== instructorId.toString()) {
        const error = new Error("You are not allowed to update this demo class.");

        error.statusCode = 403;
        throw error;
    }

    if (data.maxSeats !== undefined && data.maxSeats < demoClass.bookedSeats) {
        const error = new Error("Maximum seats cannot be less than booked seats.");

        error.statusCode = 400;
        throw error;
    }

    const allowedFields = [
        "title",
        "description",
        "date",
        "startTime",
        "endTime",
        "duration",
        "mode",
        "meetingLink",
        "location",
        "maxSeats",
        "status",
    ];

    allowedFields.forEach((field) => {
        if (data[field] !== undefined) {
            demoClass[field] = data[field];
        }
    });

    await demoClass.save();

    return await DemoClass.findById(id)
        .populate("course", "title")
        .populate("instructor", "fullName email photo");
};

// ADMIN UPDATE
export const adminUpdateDemoClassService = async (id, data) => {
    const demoClass = await DemoClass.findById(id);

    if (!demoClass) {
        const error = new Error("Demo class not found.");

        error.statusCode = 404;
        throw error;
    }

    if (data.maxSeats !== undefined && data.maxSeats < demoClass.bookedSeats) {
        const error = new Error("Maximum seats cannot be less than booked seats.");

        error.statusCode = 400;
        throw error;
    }

    const allowedFields = [
        "title",
        "description",
        "date",
        "startTime",
        "endTime",
        "duration",
        "mode",
        "meetingLink",
        "location",
        "maxSeats",
        "status",
        "instructor",
        "course",
    ];

    allowedFields.forEach((field) => {
        if (data[field] !== undefined) {
            demoClass[field] = data[field];
        }
    });

    await demoClass.save();

    return await DemoClass.findById(id)
        .populate("course", "title")
        .populate("instructor", "fullName email photo");
};

// DELETE DEMO CLASS Instructor
export const deleteDemoClassService = async (id, instructorId) => {
    const demoClass = await DemoClass.findById(id);

    if (!demoClass) {
        const error = new Error("Demo class not found.");

        error.statusCode = 404;
        throw error;
    }

    if (demoClass.instructor.toString() !== instructorId.toString()) {
        const error = new Error("You are not allowed to delete this demo class.");

        error.statusCode = 403;
        throw error;
    }

    await DemoClass.findByIdAndDelete(id);
};

// ADMIN DELETE
export const adminDeleteDemoClassService = async (id) => {
    const demoClass = await DemoClass.findByIdAndDelete(id);

    if (!demoClass) {
        const error = new Error("Demo class not found.");

        error.statusCode = 404;
        throw error;
    }
};

// BOOK DEMO CLASS Student
export const bookDemoClassService = async (demoClassId, studentId) => {
    const demoClass = await DemoClass.findById(demoClassId);

    if (!demoClass) {
        const error = new Error("Demo class not found.");

        error.statusCode = 404;
        throw error;
    }

    if (demoClass.status !== "Scheduled") {
        const error = new Error("This demo class is not available for booking.");

        error.statusCode = 400;
        throw error;
    }

    if (new Date(demoClass.date) < new Date()) {
        const error = new Error("This demo class has already started or ended.");

        error.statusCode = 400;
        throw error;
    }

    const alreadyBooked = demoClass.bookings.some(
        (booking) =>
            booking.student.toString() === studentId.toString() &&
            booking.status === "Booked",
    );

    if (alreadyBooked) {
        const error = new Error("You have already booked this demo class.");

        error.statusCode = 400;
        throw error;
    }

    if (demoClass.bookedSeats >= demoClass.maxSeats) {
        const error = new Error("Demo class is fully booked.");

        error.statusCode = 400;
        throw error;
    }

    demoClass.bookings.push({
        student: studentId,
        status: "Booked",
    });

    demoClass.bookedSeats += 1;

    await demoClass.save();

    return await DemoClass.findById(demoClassId)
        .populate("course", "title")
        .populate("instructor", "fullName email photo");
};

// CANCEL BOOKING Student
export const cancelDemoBookingService = async (demoClassId, studentId) => {
    const demoClass = await DemoClass.findById(demoClassId);

    if (!demoClass) {
        const error = new Error("Demo class not found.");

        error.statusCode = 404;
        throw error;
    }

    const booking = demoClass.bookings.find(
        (item) =>
            item.student.toString() === studentId.toString() &&
            item.status === "Booked",
    );

    if (!booking) {
        const error = new Error("Active booking not found.");

        error.statusCode = 404;
        throw error;
    }

    booking.status = "Cancelled";

    demoClass.bookedSeats = Math.max(0, demoClass.bookedSeats - 1);

    await demoClass.save();

    return await DemoClass.findById(demoClassId);
};

// GET MY BOOKINGS Student
export const getMyDemoBookingsService = async (studentId) => {
    return await DemoClass.find({
        "bookings.student": studentId,
    })
        .populate("course", "title")
        .populate("instructor", "fullName email photo")
        .sort({ date: 1 });
};
