import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Loader2, MessageSquareQuote, Star } from "lucide-react";

import { getMyTestimonials } from "../../api/testimonial.services";

const MyTestimonials = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["student-testimonials"],
    queryFn: getMyTestimonials,
  });

  const testimonials = data?.testimonials || [];

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <ErrorMessage
        message={
          error?.response?.data?.message || "Failed to load testimonials."
        }
      />
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Testimonials</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track testimonial approval and featured status.
          </p>
        </div>
        <Link
          to="/student/testimonials/create"
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Create Testimonial
        </Link>
      </div>
      {testimonials.length === 0 ? (
        <Empty />
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {testimonials.map((item) => (
            <article
              key={item._id}
              className="rounded-xl border bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-1 text-yellow-500">
                  {Array.from({ length: Number(item.rating || 0) }).map(
                    (_, index) => (
                      <Star key={index} size={16} fill="currentColor" />
                    ),
                  )}
                </div>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
                  {item.status}
                </span>
              </div>
              <p className="mt-4 text-gray-700">{item.message}</p>
              {item.adminNote && (
                <p className="mt-3 rounded-lg bg-red-50 p-3 text-sm text-red-700">
                  {item.adminNote}
                </p>
              )}
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
    <MessageSquareQuote size={42} className="mx-auto text-gray-400" />
    <h2 className="mt-4 text-xl font-semibold">No testimonials yet</h2>
    <p className="mt-2 text-gray-500">
      Share your learning experience from the create button.
    </p>
  </div>
);

export default MyTestimonials;
