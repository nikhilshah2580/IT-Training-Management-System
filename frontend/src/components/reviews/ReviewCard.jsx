import { Star } from "lucide-react";

const ReviewCard = ({ review }) => {
  const studentName = review?.student?.fullName || "Student";
  const initials = studentName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <article className="rounded-xl border border-gray-100 bg-white p-5 shadow-sm">
      <div className="flex items-center gap-3">
        {review?.student?.photo ? (
          <img
            src={review.student.photo}
            alt={studentName}
            className="h-11 w-11 rounded-full object-cover"
          />
        ) : (
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
            {initials || "ST"}
          </div>
        )}
        <div>
          <h3 className="font-semibold text-gray-900">{studentName}</h3>
          <p className="text-sm text-gray-500">Verified student</p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-1 text-yellow-500">
        {Array.from({ length: Number(review?.rating || 0) }).map((_, index) => (
          <Star key={index} size={16} fill="currentColor" />
        ))}
      </div>

      <p className="mt-3 text-sm leading-6 text-gray-600">{review?.comment}</p>
    </article>
  );
};

export default ReviewCard;
