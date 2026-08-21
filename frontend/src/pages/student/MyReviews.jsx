import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Loader2,
  Star,
  Sparkles,
  AlertCircle,
  PenSquare,
  BookOpen,
} from "lucide-react";

import { getMyEnrollments } from "../../api/enrollment.services";
import { getCourseReviews } from "../../api/review.services";

const MyReviews = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["student-course-reviews"],
    queryFn: async () => {
      const enrollmentResponse = await getMyEnrollments();
      const enrollments =
        enrollmentResponse?.enrollments ||
        enrollmentResponse?.data?.enrollments ||
        enrollmentResponse?.data ||
        [];
      const courses = enrollments.map((item) => item.course).filter(Boolean);

      const responses = await Promise.all(
        courses.map((course) =>
          getCourseReviews(course._id || course.id).catch(() => ({
            reviews: [],
          })),
        ),
      );

      return responses.flatMap((response, index) => {
        const reviewList =
          response.reviews || response.data?.reviews || response.data || [];
        return reviewList.map((review) => ({
          ...review,
          course: review.course || courses[index],
        }));
      });
    },
  });

  const reviews = data || [];

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <ErrorMessage
        message={
          error?.response?.data?.message ||
          error?.message ||
          "Failed to load reviews."
        }
      />
    );

  return (
    <motion.main
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 pb-12"
    >
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-indigo-900 via-purple-900 to-blue-900 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-xs font-semibold text-indigo-200 border border-white/15 mb-3">
              <Sparkles size={13} className="text-amber-300" /> Student Feedback
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              Course Reviews 
            </h1>
            <p className="mt-1.5 text-sm text-indigo-100 max-w-xl">
              Manage your published feedback, course ratings, and instructor
              evaluations across your enrolled programs.
            </p>
          </div>
          <Link
            to="/student/reviews/create"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-amber-400 to-orange-500 px-5 py-3 text-xs md:text-sm font-black text-slate-900 shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
          >
            <PenSquare size={16} /> Write Review
          </Link>
        </div>
      </div>

      {reviews.length === 0 ? (
        <Empty />
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {reviews.map((review) => (
            <motion.article
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              key={review._id || review.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-xs transition-all hover:shadow-md hover:border-slate-200"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, index) => {
                      const rating = Number(review.rating || 0);
                      const isFilled = index < rating;
                      return (
                        <Star
                          key={index}
                          size={15}
                          fill={isFilled ? "currentColor" : "none"}
                          className={
                            isFilled ? "text-amber-400" : "text-slate-200"
                          }
                        />
                      );
                    })}
                  </div>
                  <span className="text-xs font-bold text-slate-400">
                    {review.rating || 0}.0 / 5.0
                  </span>
                </div>

                <p className="text-xs md:text-sm leading-relaxed text-slate-600">
                  {review.comment || "No comment provided."}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center gap-1.5 text-xs font-bold text-indigo-600">
                <BookOpen size={14} className="shrink-0" />
                <span className="truncate">
                  {review.course?.title || "Course Title"}
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </motion.main>
  );
};

const Loading = () => (
  <div className="flex min-h-112.5 items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <Loader2 size={38} className="animate-spin text-indigo-600" />
      <p className="text-sm font-medium text-slate-500">
        Loading course reviews...
      </p>
    </div>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="rounded-2xl border border-red-100 bg-red-50/70 p-8 text-center shadow-sm">
    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600 mb-4">
      <AlertCircle size={24} />
    </div>
    <h2 className="text-base font-bold text-red-800">Failed to Load Reviews</h2>
    <p className="mt-1 text-xs text-red-600 leading-relaxed">{message}</p>
  </div>
);

const Empty = () => (
  <div className="flex min-h-87.5 items-center justify-center px-4 rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-xs">
    <div className="max-w-md text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-xs mb-4">
        <Star size={30} />
      </div>
      <h2 className="text-xl font-black text-slate-800 tracking-tight">
        No Reviews Yet
      </h2>
      <p className="mt-1.5 text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
        Reviews submitted for your enrolled courses will appear here once
        published.
      </p>
    </div>
  </div>
);

export default MyReviews;
