import { Loader2, Star } from "lucide-react";

import ReviewCard from "./ReviewCard";

const ReviewList = ({ reviews = [], isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center rounded-xl border bg-white p-8">
        <Loader2 size={28} className="animate-spin text-blue-600" />
      </div>
    );
  }

  if (!reviews.length) {
    return (
      <div className="rounded-xl border bg-white p-8 text-center">
        <Star size={36} className="mx-auto text-gray-300" />
        <h3 className="mt-3 text-lg font-semibold text-gray-900">
          No reviews yet
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Approved student reviews for this course will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-2">
      {reviews.map((review) => (
        <ReviewCard key={review._id} review={review} />
      ))}
    </div>
  );
};

export default ReviewList;
