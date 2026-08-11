import {
    createAssignmentService,
    getAssignmentsService,
    getAssignmentService,
    updateAssignmentService,
    deleteAssignmentService,
    getInstructorAssignmentsService,
} from "../services/assignment.service.js";

// Instructor creates assignment
export const createAssignment = async (
    req,
    res,
) => {
    const assignment =
        await createAssignmentService(
            req.user._id,
            req.body,
        );

    return res.status(201).json({
        success: true,
        message:
            "Assignment created successfully.",
        assignment,
    });
};

// Get assignments
export const getAssignments = async (
    req,
    res,
) => {
    const {
        course,
        status,
        page,
        limit,
    } = req.query;

    const result =
        await getAssignmentsService({
            course,
            status,
            page,
            limit,
        });

    return res.status(200).json({
        success: true,
        ...result,
    });
};

// Get single assignment
export const getAssignment = async (
    req,
    res,
) => {
    const assignment =
        await getAssignmentService(
            req.params.id,
        );

    if (!assignment) {
        const error = new Error(
            "Assignment not found.",
        );

        error.statusCode = 404;
        throw error;
    }

    return res.status(200).json({
        success: true,
        assignment,
    });
};

// Update assignment
export const updateAssignment = async (
    req,
    res,
) => {
    const assignment =
        await updateAssignmentService(
            req.params.id,
            req.user._id,
            req.body,
        );

    if (!assignment) {
        const error = new Error(
            "Assignment not found.",
        );

        error.statusCode = 404;
        throw error;
    }

    return res.status(200).json({
        success: true,
        message:
            "Assignment updated successfully.",
        assignment,
    });
};

// Delete assignment
export const deleteAssignment = async (
    req,
    res,
) => {
    const assignment =
        await deleteAssignmentService(
            req.params.id,
            req.user._id,
        );

    if (!assignment) {
        const error = new Error(
            "Assignment not found.",
        );

        error.statusCode = 404;
        throw error;
    }

    return res.status(200).json({
        success: true,
        message:
            "Assignment deleted successfully.",
    });
};

// Instructor's assignments
export const getInstructorAssignments =
    async (req, res) => {
        const assignments =
            await getInstructorAssignmentsService(
                req.user._id,
            );

        return res.status(200).json({
            success: true,
            assignments,
        });
    };