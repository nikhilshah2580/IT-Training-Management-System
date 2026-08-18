import JobPlacement from "../models/jobPlacement.model.js";
import User from "../models/user.model.js";

// CREATE PLACEMENT
export const createJobPlacementService = async (data) => {
    const {
        student,
        companyName,
        jobTitle,
        location,
        salary,
        joiningDate,
        placementDate,
        employmentType,
        status,
        description,
        companyLogo,
        offerLetter,
        notes,
    } = data;

    const studentExists = await User.findById(student);

    if (!studentExists) {
        const error = new Error("Student not found");
        error.statusCode = 404;
        throw error;
    }

    if (studentExists.role !== "student") {
        const error = new Error("Job placement can only be assigned to a student");
        error.statusCode = 400;
        throw error;
    }

    const placement = await JobPlacement.create({
        student,
        companyName,
        jobTitle,
        location,
        salary,
        joiningDate,
        placementDate,
        employmentType,
        status,
        description,
        companyLogo,
        offerLetter,
        notes,
    });

    return await JobPlacement.findById(placement._id).populate(
        "student",
        "fullName email phone photo",
    );
};

// GET ALL PLACEMENTS
export const getJobPlacementsService = async ({
    status,
    search,
    page = 1,
    limit = 10,
} = {}) => {
    const currentPage = Math.max(Number(page) || 1, 1);
    const perPage = Math.min(Math.max(Number(limit) || 10, 1), 100);

    const filter = {};

    if (status) {
        filter.status = status;
    }

    if (search) {
        filter.$or = [
            {
                companyName: {
                    $regex: search,
                    $options: "i",
                },
            },
            {
                jobTitle: {
                    $regex: search,
                    $options: "i",
                },
            },
        ];
    }

    const skip = (currentPage - 1) * perPage;

    const [placements, total] = await Promise.all([
        JobPlacement.find(filter)
            .populate("student", "fullName email phone photo")
            .sort({ placementDate: -1 })
            .skip(skip)
            .limit(perPage),

        JobPlacement.countDocuments(filter),
    ]);

    return {
        placements,
        pagination: {
            total,
            page: currentPage,
            limit: perPage,
            totalPages: Math.ceil(total / perPage),
        },
    };
};

// GET SINGLE PLACEMENT
export const getJobPlacementService = async (id) => {
    return await JobPlacement.findById(id).populate(
        "student",
        "fullName email phone photo",
    );
};

// GET STUDENT PLACEMENTS
export const getStudentPlacementsService = async (studentId) => {
    const student = await User.findById(studentId);

    if (!student) {
        const error = new Error("Student not found");
        error.statusCode = 404;
        throw error;
    }

    return await JobPlacement.find({
        student: studentId,
    })
        .populate("student", "fullName email phone photo")
        .sort({ placementDate: -1 });
};

// UPDATE PLACEMENT
export const updateJobPlacementService = async (id, data) => {
    const placement = await JobPlacement.findById(id);

    if (!placement) {
        const error = new Error("Job placement not found");
        error.statusCode = 404;
        throw error;
    }

    if (data.student) {
        const student = await User.findById(data.student);

        if (!student) {
            const error = new Error("Student not found");
            error.statusCode = 404;
            throw error;
        }

        if (student.role !== "student") {
            const error = new Error("Placement student must have student role");
            error.statusCode = 400;
            throw error;
        }
    }

    const updatedPlacement = await JobPlacement.findByIdAndUpdate(id, data, {
        returnDocument: "after",
        runValidators: true,
    }).populate("student", "fullName email phone photo");

    return updatedPlacement;
};

// UPDATE PLACEMENT STATUS
export const updateJobPlacementStatusService = async (id, status) => {
    const allowedStatuses = ["Placed", "Joined", "Resigned", "Pending"];

    if (!allowedStatuses.includes(status)) {
        const error = new Error("Invalid placement status");
        error.statusCode = 400;
        throw error;
    }

    const placement = await JobPlacement.findByIdAndUpdate(
        id,
        { status },
        {
            returnDocument: "after",
            runValidators: true,
        },
    ).populate("student", "fullName email phone photo");

    return placement;
};

// DELETE PLACEMENT
export const deleteJobPlacementService = async (id) => {
    return await JobPlacement.findByIdAndDelete(id);
};
