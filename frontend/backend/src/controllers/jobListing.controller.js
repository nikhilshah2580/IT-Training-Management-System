import {
    createJobListingService,
    getJobListingsService,
    getJobListingService,
    updateJobListingService,
    deleteJobListingService,
    publishJobListingService,
    closeJobListingService,
    incrementJobViewService,
} from "../services/jobListing.service.js";

/* ----------------------------------------
   CREATE JOB LISTING
   ADMIN / INSTRUCTOR
----------------------------------------- */

export const createJobListing = async (req, res) => {
    const job = await createJobListingService({
        ...req.body,
        postedBy: req.user._id,
    });

    return res.status(201).json({
        success: true,
        message: "Job listing created successfully",
        job,
    });
};

/* ----------------------------------------
   GET ALL JOB LISTINGS
   PUBLIC
----------------------------------------- */

export const getJobListings = async (req, res) => {
    const { status, search, employmentType, page, limit } = req.query;

    const result = await getJobListingsService({
        status,
        search,
        employmentType,
        page,
        limit,
    });

    return res.status(200).json({
        success: true,
        ...result,
    });
};

/* ----------------------------------------
   GET SINGLE JOB
   PUBLIC
----------------------------------------- */

export const getJobListing = async (req, res) => {
    const job = await getJobListingService(req.params.id);

    if (!job) {
        const error = new Error("Job listing not found");
        error.statusCode = 404;
        throw error;
    }

    return res.status(200).json({
        success: true,
        job,
    });
};

/* ----------------------------------------
   UPDATE JOB
   ADMIN / INSTRUCTOR
----------------------------------------- */

export const updateJobListing = async (req, res) => {
    const job = await updateJobListingService(req.params.id, req.body, req.user);

    return res.status(200).json({
        success: true,
        message: "Job listing updated successfully",
        job,
    });
};

/* ----------------------------------------
   DELETE JOB
   ADMIN / INSTRUCTOR
----------------------------------------- */

export const deleteJobListing = async (req, res) => {
    await deleteJobListingService(req.params.id, req.user);

    return res.status(200).json({
        success: true,
        message: "Job listing deleted successfully",
    });
};

/* ----------------------------------------
   PUBLISH JOB
   ADMIN
----------------------------------------- */

export const publishJobListing = async (req, res) => {
    const job = await publishJobListingService(req.params.id);

    return res.status(200).json({
        success: true,
        message: "Job listing published successfully",
        job,
    });
};

/* ----------------------------------------
   CLOSE JOB
   ADMIN
----------------------------------------- */

export const closeJobListing = async (req, res) => {
    const job = await closeJobListingService(req.params.id);

    return res.status(200).json({
        success: true,
        message: "Job listing closed successfully",
        job,
    });
};

/* ----------------------------------------
   INCREMENT VIEW
----------------------------------------- */

export const incrementJobView = async (req, res) => {
    const job = await incrementJobViewService(req.params.id);

    return res.status(200).json({
        success: true,
        job,
    });
};
