import Attendance from "../models/attendance.model.js";
import Course from "../models/course.model.js";
import User from "../models/user.model.js";

/*
|--------------------------------------------------------------------------
| Create Attendance
|--------------------------------------------------------------------------
*/

export const createAttendanceService = async ({ course, student, date, status, markedBy, remarks }) => {
    // Check course
    const courseExists = await Course.findById(course);

    if (!courseExists) {
        const error = new Error("Course not found");
        error.statusCode = 404;
        throw error;
    }

    // Check student
    const studentExists = await User.findOne({
        _id: student,
        role: "student",
    });

    if (!studentExists) {
        const error = new Error("Student not found");
        error.statusCode = 404;
        throw error;
    }

    // Prevent duplicate attendance
    const existingAttendance = await Attendance.findOne({
        course,
        student,
        date: {
            $gte: new Date(date).setHours(0, 0, 0, 0),
            $lt: new Date(date).setHours(23, 59, 59, 999),
        },
    });

    if (existingAttendance) {
        const error = new Error("Attendance already marked for this student on this date");

        error.statusCode = 409;
        throw error;
    }

    const attendance = await Attendance.create({
        course,
        student,
        date,
        status,
        markedBy,
        remarks,
    });

    return await Attendance.findById(attendance._id)
        .populate("course", "title")
        .populate("student", "fullName email photo")
        .populate("markedBy", "fullName email");
};

/*
|--------------------------------------------------------------------------
| Get All Attendance
|--------------------------------------------------------------------------
*/

export const getAttendancesService = async (filters = {}) => {
    const query = {};

    if (filters.course) {
        query.course = filters.course;
    }

    if (filters.student) {
        query.student = filters.student;
    }

    if (filters.status) {
        query.status = filters.status;
    }

    if (filters.date) {
        const start = new Date(filters.date);
        start.setHours(0, 0, 0, 0);

        const end = new Date(filters.date);
        end.setHours(23, 59, 59, 999);

        query.date = {
            $gte: start,
            $lte: end,
        };
    }

    return await Attendance.find(query)
        .populate("course", "title instructor")
        .populate("student", "fullName email photo")
        .populate("markedBy", "fullName email")
        .sort({ date: -1 });
};

/*
|--------------------------------------------------------------------------
| Get Single Attendance
|--------------------------------------------------------------------------
*/

export const getAttendanceService = async (id) => {
    return await Attendance.findById(id)
        .populate("course", "title instructor")
        .populate("student", "fullName email photo")
        .populate("markedBy", "fullName email");
};

/*
|--------------------------------------------------------------------------
| Update Attendance
|--------------------------------------------------------------------------
*/

export const updateAttendanceService = async (id, data) => {
    const attendance = await Attendance.findById(id);

    if (!attendance) {
        const error = new Error("Attendance not found");
        error.statusCode = 404;
        throw error;
    }

    if (data.status !== undefined) {
        attendance.status = data.status;
    }

    if (data.remarks !== undefined) {
        attendance.remarks = data.remarks;
    }

    await attendance.save();

    return await Attendance.findById(id)
        .populate("course", "title instructor")
        .populate("student", "fullName email photo")
        .populate("markedBy", "fullName email");
};

/*
|--------------------------------------------------------------------------
| Delete Attendance
|--------------------------------------------------------------------------
*/

export const deleteAttendanceService = async (id) => {
    const attendance = await Attendance.findByIdAndDelete(id);

    if (!attendance) {
        const error = new Error("Attendance not found");
        error.statusCode = 404;
        throw error;
    }

    return attendance;
};

/*
|--------------------------------------------------------------------------
| Student Attendance
|--------------------------------------------------------------------------
*/

export const getStudentAttendanceService = async (studentId, courseId) => {
    const query = {
        student: studentId,
    };

    if (courseId) {
        query.course = courseId;
    }

    return await Attendance.find(query).populate("course", "title").populate("markedBy", "fullName").sort({ date: -1 });
};

/*
|--------------------------------------------------------------------------
| Attendance Percentage
|--------------------------------------------------------------------------
*/

export const getAttendancePercentageService = async (studentId, courseId) => {
    const records = await Attendance.find({
        student: studentId,
        course: courseId,
    });

    if (records.length === 0) {
        return {
            totalClasses: 0,
            present: 0,
            absent: 0,
            late: 0,
            percentage: 0,
        };
    }

    const present = records.filter((record) => record.status === "Present").length;

    const late = records.filter((record) => record.status === "Late").length;
    
    const absent = records.filter((record) => record.status === "Absent").length;

    // Present + Late counted as attended
    const attended = present + late;

    const percentage = Number(((attended / records.length) * 100).toFixed(2));

    return {
        totalClasses: records.length,
        present,
        absent,
        late,
        percentage,
    };
};
