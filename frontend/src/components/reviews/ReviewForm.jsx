import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Loader2, Send, Star } from "lucide-react";
import { toast } from "react-toastify";

import { getMyEnrollments } from "../../api/enrollment.services";
import { createReview } from "../../api/review.services";

const ReviewForm = ({
  fixedCourseId = "",
  fixedCourseTitle = "",
  embedded = false,
  onCancel,
  onSuccess,
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [course, setCourse] = useState(fixedCourseId);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["my-enrollments"],
    queryFn: getMyEnrollments,
    enabled: !fixedCourseId,
  });

  const courses = useMemo(
    () =>
      (data?.enrollments || [])
        .map((item) => item.course)
        .filter(Boolean),
    [data],
  );

  const mutation = useMutation({
    mutationFn: createReview,
    onSuccess: (response) => {
      toast.success(response?.message || "Review submitted for approval.");
      queryClient.invalidateQueries({ queryKey: ["student-course-reviews"] });

      if (fixedCourseId) {
        queryClient.invalidateQueries({ queryKey: ["course-reviews", fixedCourseId] });
      }

      setComment("");
      setRating(5);
      onSuccess?.(response);

      if (!embedded) {
        navigate("/student/reviews");
      }
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to submit review.");
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!course) {
      toast.error("Please select a course.");
      return;
    }

    if (!comment.trim()) {
      toast.error("Please write your review.");
      return;
    }

    mutation.mutate({
      course,
      rating: Number(rating),
      comment: comment.trim(),
    });
  };

  return (
    <div className={embedded ? "space-y-6" : "mx-auto max-w-3xl space-y-6"}>
      {!embedded && (
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Write Review</h1>
          <p className="mt-1 text-sm text-gray-500">
            Share your course experience. Your review appears publicly after approval.
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="space-y-5">
          {fixedCourseId ? (
            <div>
              <label className="text-sm font-semibold text-gray-700">Course</label>
              <div className="mt-2 rounded-lg border border-gray-200 bg-gray-50 px-3 py-2.5 text-sm font-medium text-gray-800">
                {fixedCourseTitle || "Selected course"}
              </div>
            </div>
          ) : (
            <div>
              <label className="text-sm font-semibold text-gray-700">Course</label>
              <select
                value={course}
                onChange={(event) => setCourse(event.target.value)}
                disabled={isLoading || mutation.isPending}
                className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
              >
                <option value="">Select enrolled course</option>
                {courses.map((item) => (
                  <option key={item._id} value={item._id}>
                    {item.title}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div>
            <label className="text-sm font-semibold text-gray-700">Rating</label>
            <div className="mt-2 flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setRating(value)}
                  disabled={mutation.isPending}
                  className="rounded-md p-1 text-yellow-500 hover:bg-yellow-50 disabled:opacity-60"
                  aria-label={`${value} star rating`}
                >
                  <Star size={24} fill={value <= rating ? "currentColor" : "none"} />
                </button>
              ))}
              <span className="ml-2 text-sm font-medium text-gray-600">{rating}/5</span>
            </div>
          </div>

          <div>
            <label className="text-sm font-semibold text-gray-700">Review</label>
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              rows={6}
              maxLength={1000}
              disabled={mutation.isPending}
              placeholder="Write what you learned, how the instructor helped, and who this course is good for."
              className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
            />
            <p className="mt-1 text-xs text-gray-400">{comment.length}/1000</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t pt-5">
          <button
            type="button"
            onClick={() => (onCancel ? onCancel() : navigate("/student/reviews"))}
            className="rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={mutation.isPending || isLoading}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {mutation.isPending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            Submit Review
          </button>
        </div>
      </form>
    </div>
  );
};

export default ReviewForm;
