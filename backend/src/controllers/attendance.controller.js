import {
    createAttendanceService,
    getAttendancesService,
    getAttendanceService,
    updateAttendanceService,
    deleteAttendanceService,
    getStudentAttendanceService,
    getAttendancePercentageService,
} from "../services/attendance.service.js";

// Create Attendance
export const createAttendance = async (req, res) => {
    const { course, student, date, status, remarks } = req.body;

    if (!course || !student || !date || !status) {
        const error = new Error("Course, student, date and status are required");

        error.statusCode = 400;
        throw error;
    }

    const attendance = await createAttendanceService({
        course,
        student,
        date,
        status,
        markedBy: req.user._id,
        remarks,
        actor: req.user,
    });

    res.status(201).json({
        success: true,
        message: "Attendance marked successfully",
        attendance,
    });
};

// Get All Attendance
export const getAttendances = async (req, res) => {
    const { course, student, status, date } = req.query;

    const attendances = await getAttendancesService(
        {
            course,
            student,
            status,
            date,
        },
        req.user,
    );

    res.status(200).json({
        success: true,
        count: attendances.length,
        attendances,
    });
};

// Get Single Attendance
export const getAttendance = async (req, res) => {
    const attendance = await getAttendanceService(req.params.id, req.user);

    if (!attendance) {
        const error = new Error("Attendance not found");
        error.statusCode = 404;
        throw error;
    }

    res.status(200).json({
        success: true,
        attendance,
    });
};

// Update Attendance
export const updateAttendance = async (req, res) => {
    const attendance = await updateAttendanceService(
        req.params.id,
        req.body,
        req.user,
    );

    res.status(200).json({
        success: true,
        message: "Attendance updated successfully",
        attendance,
    });
};

// Delete Attendance
export const deleteAttendance = async (req, res) => {
    await deleteAttendanceService(req.params.id);

    res.status(200).json({
        success: true,
        message: "Attendance deleted successfully",
    });
};

// Get My Attendance
export const getMyAttendance = async (req, res) => {
    const { course } = req.query;

    const attendances = await getStudentAttendanceService(req.user._id, course);

    res.status(200).json({
        success: true,
        count: attendances.length,
        attendances,
    });
};

// Get My Attendance Percentage
export const getMyAttendancePercentage = async (req, res) => {
    const { course } = req.query;

    if (!course) {
        const error = new Error("Course ID is required");

        error.statusCode = 400;
        throw error;
    }

    const result = await getAttendancePercentageService(req.user._id, course);

    res.status(200).json({
        success: true,
        attendance: result,
    });
};
