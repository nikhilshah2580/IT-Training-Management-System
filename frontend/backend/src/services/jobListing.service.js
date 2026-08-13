import JobListing from "../models/jobListing.model.js";
import mongoose from "mongoose";

/* ----------------------------------------
   CREATE JOB LISTING
----------------------------------------- */

export const createJobListingService = async (data) => {
    const job = await JobListing.create(data);

    return await JobListing.findById(job._id).populate("postedBy", "fullName email role photo");
};

/* ----------------------------------------
   GET ALL JOB LISTINGS
----------------------------------------- */

export const getJobListingsService = async ({ status, search, employmentType, page = 1, limit = 10 }) => {
    const currentPage = Math.max(Number(page) || 1, 1);
    const perPage = Math.min(Math.max(Number(limit) || 10, 1), 100);

    const filter = {};

    if (status) {
        filter.status = status;
    }

    if (employmentType) {
        filter.employmentType = employmentType;
    }

    if (search && search.trim()) {
        filter.$text = {
            $search: search.trim(),
        };
    }

    const skip = (currentPage - 1) * perPage;

    const [jobs, total] = await Promise.all([
        JobListing.find(filter).populate("postedBy", "fullName email role photo").sort({ createdAt: -1 }).skip(skip).limit(perPage),

        JobListing.countDocuments(filter),
    ]);

    return {
        jobs,
        pagination: {
            total,
            page: currentPage,
            limit: perPage,
            totalPages: Math.ceil(total / perPage),
        },
    };
};

/* ----------------------------------------
   GET SINGLE JOB
----------------------------------------- */

export const getJobListingService = async (id) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error("Invalid job listing ID");
        error.statusCode = 400;
        throw error;
    }

    const job = await JobListing.findById(id).populate("postedBy", "fullName email role photo");

    return job;
};

/* ----------------------------------------
   UPDATE JOB LISTING
----------------------------------------- */

export const updateJobListingService = async (id, data, user) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error("Invalid job listing ID");
        error.statusCode = 400;
        throw error;
    }

    const job = await JobListing.findById(id);

    if (!job) {
        const error = new Error("Job listing not found");
        error.statusCode = 404;
        throw error;
    }

    // Instructor can only update their own listing.
    if (user.role === "instructor" && job.postedBy.toString() !== user._id.toString()) {
        const error = new Error("You can only update your own job listings");

        error.statusCode = 403;
        throw error;
    }

    const allowedFields = [
        "companyName",
        "jobTitle",
        "description",
        "location",
        "employmentType",
        "salaryMin",
        "salaryMax",
        "experience",
        "qualifications",
        "skills",
        "responsibilities",
        "applicationDeadline",
        "companyLogo",
        "applicationUrl",
        "contactEmail",
        "status",
    ];

    allowedFields.forEach((field) => {
        if (data[field] !== undefined) {
            job[field] = data[field];
        }
    });

    await job.save();

    return await JobListing.findById(job._id).populate("postedBy", "fullName email role photo");
};

/* ----------------------------------------
   DELETE JOB LISTING
----------------------------------------- */

export const deleteJobListingService = async (id, user) => {
    if (!mongoose.Types.ObjectId.isValid(id)) {
        const error = new Error("Invalid job listing ID");
        error.statusCode = 400;
        throw error;
    }

    const job = await JobListing.findById(id);

    if (!job) {
        const error = new Error("Job listing not found");
        error.statusCode = 404;
        throw error;
    }

    if (user.role === "instructor" && job.postedBy.toString() !== user._id.toString()) {
        const error = new Error("You can only delete your own job listings");

        error.statusCode = 403;
        throw error;
    }

    await JobListing.findByIdAndDelete(id);

    return true;
};

/* ----------------------------------------
   PUBLISH JOB
----------------------------------------- */

export const publishJobListingService = async (id) => {
    const job = await JobListing.findByIdAndUpdate(
        id,
        {
            status: "Published",
        },
        {
            returnDocument: "after",
            runValidators: true,
        },
    );

    if (!job) {
        const error = new Error("Job listing not found");
        error.statusCode = 404;
        throw error;
    }

    return job;
};

/* ----------------------------------------
   CLOSE JOB
----------------------------------------- */

export const closeJobListingService = async (id) => {
    const job = await JobListing.findByIdAndUpdate(
        id,
        {
            status: "Closed",
        },
        {
            returnDocument: "after",
            runValidators: true,
        },
    );

    if (!job) {
        const error = new Error("Job listing not found");
        error.statusCode = 404;
        throw error;
    }

    return job;
};

/* ----------------------------------------
   INCREMENT VIEWS
----------------------------------------- */

export const incrementJobViewService = async (id) => {
    const job = await JobListing.findByIdAndUpdate(
        id,
        {
            $inc: {
                views: 1,
            },
        },
        {
            returnDocument: "after",
        },
    );

    if (!job) {
        const error = new Error("Job listing not found");
        error.statusCode = 404;
        throw error;
    }

    return job;
};
