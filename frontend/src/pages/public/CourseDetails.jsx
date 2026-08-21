import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Clock,
  GraduationCap,
  Loader2,
  User,
  CreditCard,
} from "lucide-react";

import { getCourseById } from "../../api/course.services";
import { getCourseReviews } from "../../api/review.services";
import ReviewList from "../../components/reviews/ReviewList";
import ReviewForm from "../../components/reviews/ReviewForm";
import { createEnrollment } from "../../api/enrollment.services";
import { useSelector } from "react-redux";

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showReviewForm, setShowReviewForm] = useState(false);

  // AUTH USER
  const user = useSelector((state) => state.auth.user);

  // GET COURSE
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["course", id],
    queryFn: () => getCourseById(id),
    enabled: !!id,
  });

  const course = data?.course;

  const { data: reviewData, isLoading: reviewsLoading } = useQuery({
    queryKey: ["course-reviews", id],
    queryFn: () => getCourseReviews(id),
    enabled: !!id,
  });

  const reviews = reviewData?.reviews || [];

  const handleWriteReview = () => {
    if (!user) {
      toast.info("Please login to write a review");
      navigate("/login");
      return;
    }

    if (user.role !== "student") {
      toast.error("Only students can write course reviews");
      return;
    }

    setShowReviewForm(true);
  };
  // ENROLLMENT MUTATION
  const enrollMutation = useMutation({
    mutationFn: createEnrollment,

    onSuccess: (data) => {
      toast.success(data?.message || "Course enrolled successfully");

      // Refresh student's enrollments
      queryClient.invalidateQueries({
        queryKey: ["my-enrollments"],
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to enroll in course",
      );
    },
  });

  // ENROLL
  const handleEnroll = () => {
    if (!user) {
      toast.info("Please login to enroll in a course");

      navigate("/login");

      return;
    }

    if (user.role !== "student") {
      toast.error("Only students can enroll in courses");

      return;
    }

    if (!course) {
      return;
    }

    if (course.status !== "Active") {
      toast.error("This course is currently inactive");

      return;
    }

    enrollMutation.mutate(course._id);
  };

  // LOADING
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 size={45} className="mx-auto animate-spin text-blue-600" />

          <p className="mt-4 text-gray-500">Loading course...</p>
        </div>
      </div>
    );
  }

  // ERROR
  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <div className="w-full max-w-lg rounded-xl border bg-white p-8 text-center shadow-sm">
          <h1 className="text-2xl font-bold text-red-600">
            Failed to load course
          </h1>

          <p className="mt-3 text-gray-500">
            {error?.response?.data?.message ||
              error?.message ||
              "Course could not be loaded"}
          </p>

          <button
            onClick={() => navigate(-1)}
            className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // COURSE NOT FOUND
  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Course not found</h1>

          <button
            onClick={() => navigate("/courses")}
            className="mt-5 rounded-lg bg-blue-600 px-5 py-2.5 text-white"
          >
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  // RENDER
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto max-w-6xl">
        {/* BACK */}

        <button
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-blue-600"
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* COURSE CARD */}

        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          {/* COURSE IMAGE */}

          <div className="flex h-64 items-center justify-center bg-gray-100 md:h-80">
            {course.courseImage ? (
              <img
                src={course.courseImage}
                alt={course.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <GraduationCap size={90} className="text-gray-300" />
            )}
          </div>

          <div className="p-6 md:p-10">
            {/* TITLE */}

            <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
              <div>
                <div className="mb-3 flex flex-wrap gap-2">
                  {course.category && (
                    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                      {course.category}
                    </span>
                  )}

                  {course.skillLevel && (
                    <span className="rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                      {course.skillLevel}
                    </span>
                  )}
                </div>

                <h1 className="text-3xl font-bold text-gray-900 md:text-4xl">
                  {course.title}
                </h1>
              </div>

              {/* STATUS */}

              <span
                className={`w-fit rounded-full px-4 py-2 text-sm font-semibold ${
                  course.status === "Active"
                    ? "bg-green-100 text-green-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {course.status}
              </span>
            </div>

            {/* DESCRIPTION */}

            <div className="mt-8">
              <h2 className="text-xl font-bold text-gray-900">
                About this course
              </h2>

              <p className="mt-3 leading-7 text-gray-600">
                {course.description || "No course description available."}
              </p>
            </div>

            {/* COURSE INFORMATION */}

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <InfoCard
                icon={<Clock size={20} />}
                label="Duration"
                value={course.duration || "N/A"}
              />

              <InfoCard
                icon={<CreditCard size={20} />}
                label="Course Fee"
                value={`Rs. ${course.fee ?? 0}`}
              />

              <InfoCard
                icon={<BookOpen size={20} />}
                label="Category"
                value={course.category || "N/A"}
              />

              <InfoCard
                icon={<User size={20} />}
                label="Skill Level"
                value={course.skillLevel || "N/A"}
              />
            </div>

            {/* INSTRUCTOR */}

            {course.instructor && (
              <div className="mt-8 rounded-xl bg-gray-50 p-5">
                <h2 className="text-lg font-bold text-gray-900">Instructor</h2>

                <div className="mt-3 flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100">
                    <User size={20} className="text-blue-600" />
                  </div>

                  <div>
                    <p className="font-semibold text-gray-900">
                      {typeof course.instructor === "object"
                        ? course.instructor.fullName
                        : course.instructor}
                    </p>

                    {typeof course.instructor === "object" &&
                      course.instructor.email && (
                        <p className="text-sm text-gray-500">
                          {course.instructor.email}
                        </p>
                      )}
                  </div>
                </div>
              </div>
            )}

            {/* ENROLLMENT DEADLINE */}

            {course.enrollmentDeadline && (
              <div className="mt-6 flex items-center gap-2 text-sm text-gray-600">
                <CalendarDays size={18} />

                <span>
                  Enrollment deadline:{" "}
                  <strong>
                    {new Date(course.enrollmentDeadline).toLocaleDateString()}
                  </strong>
                </span>
              </div>
            )}

            {/* ACTION */}

            <div className="mt-8 border-t pt-6">
              {user?.role === "student" ? (
                <button
                  type="button"
                  onClick={handleEnroll}
                  disabled={
                    enrollMutation.isPending || course.status !== "Active"
                  }
                  className="w-full rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50 md:w-auto"
                >
                  {enrollMutation.isPending
                    ? "Enrolling..."
                    : course.status === "Active"
                      ? "Enroll Now"
                      : "Course Inactive"}
                </button>
              ) : !user ? (
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="w-full rounded-xl bg-blue-600 px-6 py-3.5 font-semibold text-white hover:bg-blue-700 md:w-auto"
                >
                  Login to Enroll
                </button>
              ) : null}
            </div>
          </div>
        </div>
        <section className="mt-8 rounded-2xl border bg-white p-6 shadow-sm md:p-8">
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Student Reviews
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Public feedback from approved student reviews.
              </p>
            </div>
            {user?.role === "student" && (
              <button
                type="button"
                onClick={handleWriteReview}
                className="w-fit rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Write Review
              </button>
            )}
          </div>

          {showReviewForm && (
            <div className="mb-6 rounded-xl bg-gray-50 p-4">
              <ReviewForm
                fixedCourseId={course._id}
                fixedCourseTitle={course.title}
                embedded
                onCancel={() => setShowReviewForm(false)}
                onSuccess={() => setShowReviewForm(false)}
              />
            </div>
          )}

          <ReviewList reviews={reviews} isLoading={reviewsLoading} />
        </section>
      </div>
    </main>
  );
};

// INFO CARD

const InfoCard = ({ icon, label, value }) => {
  return (
    <div className="rounded-xl border bg-white p-4">
      <div className="flex items-center gap-2 text-blue-600">
        {icon}

        <span className="text-sm font-medium text-gray-500">{label}</span>
      </div>

      <p className="mt-2 font-semibold text-gray-900">{value}</p>
    </div>
  );
};

export default CourseDetails;
