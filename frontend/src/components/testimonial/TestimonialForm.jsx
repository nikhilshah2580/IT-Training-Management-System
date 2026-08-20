import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Loader2, MessageSquareQuote, Send, Star } from "lucide-react";
import { toast } from "react-toastify";

import { getMyEnrollments } from "../../api/enrollment.services";
import { createTestimonial } from "../../api/testimonial.services";

const TestimonialForm = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [course, setCourse] = useState("");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["my-enrollments"],
    queryFn: getMyEnrollments,
  });

  const courses = useMemo(
    () =>
      (data?.enrollments || [])
        .map((item) => item.course)
        .filter(Boolean),
    [data],
  );

  const mutation = useMutation({
    mutationFn: createTestimonial,
    onSuccess: (response) => {
      toast.success(response?.message || "Testimonial submitted for approval.");
      queryClient.invalidateQueries({ queryKey: ["student-testimonials"] });
      queryClient.invalidateQueries({ queryKey: ["public-testimonials"] });
      navigate("/student/testimonials");
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to submit testimonial.");
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!message.trim()) {
      toast.error("Please write your testimonial.");
      return;
    }

    mutation.mutate({
      course: course || undefined,
      rating: Number(rating),
      message: message.trim(),
    });
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Create Testimonial</h1>
        <p className="mt-1 text-sm text-gray-500">
          Tell future students about your learning journey. Approved testimonials are shown on the public site with your profile.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="space-y-5">
          <div>
            <label className="text-sm font-semibold text-gray-700">Related Course</label>
            <select
              value={course}
              onChange={(event) => setCourse(event.target.value)}
              disabled={isLoading || mutation.isPending}
              className="mt-2 w-full rounded-lg border border-gray-200 px-3 py-2.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
            >
              <option value="">General testimonial</option>
              {courses.map((item) => (
                <option key={item._id} value={item._id}>
                  {item.title}
                </option>
              ))}
            </select>
          </div>

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
            <label className="text-sm font-semibold text-gray-700">Testimonial</label>
            <div className="relative mt-2">
              <MessageSquareQuote size={18} className="absolute left-3 top-3 text-gray-400" />
              <textarea
                value={message}
                onChange={(event) => setMessage(event.target.value)}
                rows={7}
                minLength={10}
                maxLength={1000}
                disabled={mutation.isPending}
                placeholder="Share your experience, growth, result, or favorite part of the institute."
                className="w-full rounded-lg border border-gray-200 px-3 py-2.5 pl-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100 disabled:bg-gray-100"
              />
            </div>
            <p className="mt-1 text-xs text-gray-400">{message.length}/1000</p>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 border-t pt-5">
          <button
            type="button"
            onClick={() => navigate("/student/testimonials")}
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
            Submit Testimonial
          </button>
        </div>
      </form>
    </div>
  );
};

export default TestimonialForm;
