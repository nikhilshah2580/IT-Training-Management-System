import api from "./apiClient";

/*
|--------------------------------------------------------------------------
| PUBLIC — GET APPROVED COURSE REVIEWS
|--------------------------------------------------------------------------
| GET /reviews/course/:courseId
|--------------------------------------------------------------------------
*/

export const getCourseReviews = async (courseId) => {
    const response = await api.get(`/reviews/course/${courseId}`);

    return response.data;
};

/*
|--------------------------------------------------------------------------
| PUBLIC — GET COURSE RATING
|--------------------------------------------------------------------------
| GET /reviews/course/:courseId/rating
|--------------------------------------------------------------------------
*/

export const getCourseRating = async (courseId) => {
    const response = await api.get(`/reviews/course/${courseId}/rating`);

    return response.data;
};

/*
|--------------------------------------------------------------------------
| STUDENT — CREATE REVIEW
|--------------------------------------------------------------------------
| POST /reviews
|--------------------------------------------------------------------------
|
| data:
| {
|   course,
|   rating,
|   comment
| }
|--------------------------------------------------------------------------
*/

export const createReview = async (data) => {
    const response = await api.post("/reviews", data);

    return response.data;
};

/*
|--------------------------------------------------------------------------
| STUDENT — UPDATE OWN REVIEW
|--------------------------------------------------------------------------
| PUT /reviews/:id
|--------------------------------------------------------------------------
*/

export const updateReview = async (id, data) => {
    const response = await api.put(`/reviews/${id}`, data);

    return response.data;
};

/*
|--------------------------------------------------------------------------
| STUDENT — DELETE OWN REVIEW
|--------------------------------------------------------------------------
| DELETE /reviews/:id
|--------------------------------------------------------------------------
*/

export const deleteOwnReview = async (id) => {
    const response = await api.delete(`/reviews/${id}`);

    return response.data;
};

/*
|--------------------------------------------------------------------------
| ADMIN — GET ALL REVIEWS
|--------------------------------------------------------------------------
| GET /reviews/admin/all
|--------------------------------------------------------------------------
|
| Optional:
| {
|   status,
|   page,
|   limit
| }
|--------------------------------------------------------------------------
*/

export const getAllReviews = async (params = {}) => {
    const response = await api.get("/reviews/admin/all", {
        params,
    });

    return response.data;
};

/*
|--------------------------------------------------------------------------
| ADMIN — GET SINGLE REVIEW
|--------------------------------------------------------------------------
| GET /reviews/admin/:id
|--------------------------------------------------------------------------
*/

export const getReview = async (id) => {
    const response = await api.get(`/reviews/admin/${id}`);

    return response.data;
};

/*
|--------------------------------------------------------------------------
| ADMIN — APPROVE / REJECT REVIEW
|--------------------------------------------------------------------------
| PATCH /reviews/admin/:id/status
|--------------------------------------------------------------------------
|
| data:
| {
|   status: "Approved"
| }
|
| OR
|
| {
|   status: "Rejected"
| }
|--------------------------------------------------------------------------
*/

export const updateReviewStatus = async (id, data) => {
    const response = await api.patch(`/reviews/admin/${id}/status`, data);

    return response.data;
};

/*
|--------------------------------------------------------------------------
| ADMIN — DELETE REVIEW
|--------------------------------------------------------------------------
| DELETE /reviews/admin/:id
|--------------------------------------------------------------------------
*/

export const adminDeleteReview = async (id) => {
    const response = await api.delete(`/reviews/admin/${id}`);

    return response.data;
};
