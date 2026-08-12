import {
    createReviewService,
    getCourseReviewsService,
    getAllReviewsService,
    getReviewService,
    updateReviewService,
    updateReviewStatusService,
    deleteReviewService,
    getCourseRatingService,
} from "../services/review.service.js";

/*
|--------------------------------------------------------------------------
| STUDENT CREATE REVIEW
|--------------------------------------------------------------------------
*/

export const createReview = async (req, res) => {
    const review = await createReviewService(req.user._id, req.body);

    return res.status(201).json({
        success: true,
        message: "Review submitted successfully.",
        review,
    });
};

/*
|--------------------------------------------------------------------------
| GET APPROVED COURSE REVIEWS
|--------------------------------------------------------------------------
*/

export const getCourseReviews = async (req, res) => {
    const reviews = await getCourseReviewsService(req.params.courseId);

    return res.status(200).json({
        success: true,
        reviews,
    });
};

/*
|--------------------------------------------------------------------------
| GET COURSE RATING
|--------------------------------------------------------------------------
*/

export const getCourseRating = async (req, res) => {
    const rating = await getCourseRatingService(req.params.courseId);

    return res.status(200).json({
        success: true,
        rating,
    });
};

/*
|--------------------------------------------------------------------------
| ADMIN GET ALL REVIEWS
|--------------------------------------------------------------------------
*/

export const getAllReviews = async (req, res) => {
    const result = await getAllReviewsService(req.query);

    return res.status(200).json({
        success: true,
        ...result,
    });
};

/*
|--------------------------------------------------------------------------
| GET SINGLE REVIEW
|--------------------------------------------------------------------------
*/

export const getReview = async (req, res) => {
    const review = await getReviewService(req.params.id);

    if (!review) {
        const error = new Error("Review not found");
        error.statusCode = 404;
        throw error;
    }

    return res.status(200).json({
        success: true,
        review,
    });
};

/*
|--------------------------------------------------------------------------
| STUDENT UPDATE OWN REVIEW
|--------------------------------------------------------------------------
*/

export const updateReview = async (req, res) => {
    const review = await updateReviewService(req.params.id, req.user._id, req.body);

    return res.status(200).json({
        success: true,
        message: "Review updated successfully.",
        review,
    });
};

/*
|--------------------------------------------------------------------------
| ADMIN APPROVE / REJECT REVIEW
|--------------------------------------------------------------------------
*/

export const updateReviewStatus = async (req, res) => {
    const review = await updateReviewStatusService(req.params.id, req.body.status);

    if (!review) {
        const error = new Error("Review not found");
        error.statusCode = 404;
        throw error;
    }

    return res.status(200).json({
        success: true,
        message: "Review status updated successfully.",
        review,
    });
};

/*
|--------------------------------------------------------------------------
| STUDENT DELETE OWN REVIEW
|--------------------------------------------------------------------------
*/

export const deleteOwnReview = async (req, res) => {
    await deleteReviewService(req.params.id, req.user._id, false);

    return res.status(200).json({
        success: true,
        message: "Review deleted successfully.",
    });
};

/*
|--------------------------------------------------------------------------
| ADMIN DELETE REVIEW
|--------------------------------------------------------------------------
*/

export const adminDeleteReview = async (req, res) => {
    await deleteReviewService(req.params.id, null, true);

    return res.status(200).json({
        success: true,
        message: "Review deleted successfully.",
    });
};
