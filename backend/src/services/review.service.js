import Review from "../models/review.model.js";
import Course from "../models/course.model.js";
import Enrollment from "../models/enrollment.model.js";
import mongoose from "mongoose";

// CREATE REVIEW
export const createReviewService = async (studentId, data) => {
  const { course, rating, comment } = data;

  if (!mongoose.Types.ObjectId.isValid(course)) {
    const error = new Error("Invalid course ID");
    error.statusCode = 400;
    throw error;
  }

  const courseExists = await Course.findById(course);

  if (!courseExists) {
    const error = new Error("Course not found");
    error.statusCode = 404;
    throw error;
  }

  // Student must be enrolled before reviewing
  const enrollment = await Enrollment.findOne({
    student: studentId,
    course,
  });

  if (!enrollment) {
    const error = new Error(
      "You must be enrolled in this course to submit a review.",
    );

    error.statusCode = 403;
    throw error;
  }

  const existingReview = await Review.findOne({
    student: studentId,
    course,
  });

  if (existingReview) {
    const error = new Error("You have already reviewed this course.");

    error.statusCode = 400;
    throw error;
  }

  const review = await Review.create({
    course,
    student: studentId,
    rating,
    comment,
  });

  return await Review.findById(review._id)
    .populate("student", "fullName email photo")
    .populate("course", "title");
};

// GET COURSE REVIEWS
export const getCourseReviewsService = async (courseId) => {
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    const error = new Error("Invalid course ID");
    error.statusCode = 400;
    throw error;
  }

  return await Review.find({
    course: courseId,
    status: "Approved",
  })
    .populate("student", "fullName photo")
    .populate("course", "title")
    .sort({ createdAt: -1 });
};

// GET STUDENT'S OWN REVIEWS
export const getMyReviewsService = async (studentId) => {
  return await Review.find({ student: studentId })
    .populate("student", "fullName email photo")
    .populate("course", "title")
    .sort({ createdAt: -1 });
};
// GET ALL REVIEWS - ADMIN
export const getAllReviewsService = async ({
  status,
  page = 1,
  limit = 10,
} = {}) => {
  page = Math.max(Number(page) || 1, 1);
  limit = Math.min(Math.max(Number(limit) || 10, 1), 100);

  const filter = {};

  if (status && ["Pending", "Approved", "Rejected"].includes(status)) {
    filter.status = status;
  }

  const skip = (page - 1) * limit;

  const [reviews, total] = await Promise.all([
    Review.find(filter)
      .populate("student", "fullName email photo")
      .populate("course", "title")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),

    Review.countDocuments(filter),
  ]);

  return {
    reviews,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// GET SINGLE REVIEW
export const getReviewService = async (id) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const error = new Error("Invalid review ID");
    error.statusCode = 400;
    throw error;
  }

  return await Review.findById(id)
    .populate("student", "fullName email photo")
    .populate("course", "title");
};

// UPDATE OWN REVIEW
export const updateReviewService = async (reviewId, studentId, data) => {
  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    const error = new Error("Invalid review ID");
    error.statusCode = 400;
    throw error;
  }

  const review = await Review.findOne({
    _id: reviewId,
    student: studentId,
  });

  if (!review) {
    const error = new Error("Review not found");
    error.statusCode = 404;
    throw error;
  }

  if (data.rating !== undefined) {
    review.rating = data.rating;
  }

  if (data.comment !== undefined) {
    review.comment = data.comment;
  }

  // Updated review should go through moderation again
  review.status = "Pending";

  await review.save();

  return await Review.findById(review._id)
    .populate("student", "fullName email photo")
    .populate("course", "title");
};

// ADMIN UPDATE REVIEW STATUS
export const updateReviewStatusService = async (reviewId, status) => {
  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    const error = new Error("Invalid review ID");
    error.statusCode = 400;
    throw error;
  }

  if (!["Pending", "Approved", "Rejected"].includes(status)) {
    const error = new Error("Invalid review status");
    error.statusCode = 400;
    throw error;
  }

  const review = await Review.findByIdAndUpdate(
    reviewId,
    { status },
    {
      returnDocument: "after",
      runValidators: true,
    },
  )
    .populate("student", "fullName email photo")
    .populate("course", "title");

  return review;
};

// DELETE REVIEW
export const deleteReviewService = async (
  reviewId,
  studentId = null,
  isAdmin = false,
) => {
  if (!mongoose.Types.ObjectId.isValid(reviewId)) {
    const error = new Error("Invalid review ID");
    error.statusCode = 400;
    throw error;
  }

  const filter = {
    _id: reviewId,
  };

  if (!isAdmin) {
    filter.student = studentId;
  }

  const review = await Review.findOneAndDelete(filter);

  if (!review) {
    const error = new Error("Review not found");
    error.statusCode = 404;
    throw error;
  }

  return review;
};

// COURSE RATING SUMMARY
export const getCourseRatingService = async (courseId) => {
  if (!mongoose.Types.ObjectId.isValid(courseId)) {
    const error = new Error("Invalid course ID");
    error.statusCode = 400;
    throw error;
  }

  const result = await Review.aggregate([
    {
      $match: {
        course: new mongoose.Types.ObjectId(courseId),
        status: "Approved",
      },
    },

    {
      $group: {
        _id: "$course",
        averageRating: {
          $avg: "$rating",
        },
        totalReviews: {
          $sum: 1,
        },
      },
    },
  ]);

  if (!result.length) {
    return {
      averageRating: 0,
      totalReviews: 0,
    };
  }

  return {
    averageRating: Number(result[0].averageRating.toFixed(1)),
    totalReviews: result[0].totalReviews,
  };
};
