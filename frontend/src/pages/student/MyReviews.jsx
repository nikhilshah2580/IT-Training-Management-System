import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Loader2, Star } from "lucide-react";

import { getMyEnrollments } from "../../api/enrollment.services";
import { getCourseReviews } from "../../api/review.services";

const MyReviews = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["student-course-reviews"],
    queryFn: async () => {
      const enrollmentResponse = await getMyEnrollments();
      const courses = (enrollmentResponse?.enrollments || [])
        .map((item) => item.course)
        .filter(Boolean);
      const responses = await Promise.all(
        courses.map((course) =>
          getCourseReviews(course._id).catch(() => ({ reviews: [] })),
        ),
      );
      return responses.flatMap((response, index) =>
        (response.reviews || []).map((review) => ({
          ...review,
          course: review.course || courses[index],
        })),
      );
    },
  });

  const reviews = data || [];

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <ErrorMessage
        message={error?.response?.data?.message || "Failed to load reviews."}
      />
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Course Reviews</h1>
          <p className="mt-1 text-sm text-gray-500">
            Approved reviews for your enrolled courses.
          </p>
        </div>
        <Link
          to="/student/reviews/create"
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Write Review
        </Link>
      </div>
      {reviews.length === 0 ? (
        <Empty />
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {reviews.map((review) => (
            <article
              key={review._id}
              className="rounded-xl border bg-white p-5 shadow-sm"
            >
              <div className="flex items-center gap-1 text-yellow-500">
                {Array.from({ length: Number(review.rating || 0) }).map(
                  (_, index) => (
                    <Star key={index} size={16} fill="currentColor" />
                  ),
                )}
              </div>
              <p className="mt-3 text-gray-700">{review.comment}</p>
              <p className="mt-3 text-sm text-gray-500">
                {review.course?.title || "Course"}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

const Loading = () => (
  <div className="flex min-h-100 items-center justify-center">
    <Loader2 size={34} className="animate-spin text-blue-600" />
  </div>
);
const ErrorMessage = ({ message }) => (
  <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
    {message}
  </div>
);
const Empty = () => (
  <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
    <Star size={42} className="mx-auto text-gray-400" />
    <h2 className="mt-4 text-xl font-semibold">No reviews yet</h2>
    <p className="mt-2 text-gray-500">
      Reviews for enrolled courses will appear here.
    </p>
  </div>
);

export default MyReviews;
