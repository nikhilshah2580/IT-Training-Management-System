import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { getMyEnrollments } from "../../api/enrollment.services";

const MyCourses = () => {
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["my-enrollments"],
    queryFn: getMyEnrollments,
  });

  const enrollments = data?.enrollments || [];

  if (isLoading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <p className="text-gray-600">Loading your courses...</p>
      </div>
    );
  }

  if (isError) {
    toast.error(
      error?.response?.data?.message || "Failed to load your courses",
    );

    return (
      <div className="flex min-h-100 items-center justify-center">
        <p className="text-red-500">Failed to load your courses.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Courses</h1>

          <p className="mt-2 text-gray-600">
            View your enrolled courses and track your learning progress.
          </p>
        </div>

        {/* EMPTY STATE */}
        {enrollments.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800">
              No courses yet
            </h2>

            <p className="mt-2 text-gray-500">
              You haven't enrolled in any courses.
            </p>

            <button
              type="button"
              onClick={() => navigate("/courses")}
              className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Browse Courses
            </button>
          </div>
        ) : (
          /* COURSE GRID */
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {enrollments.map((enrollment) => {
              const course = enrollment.course;

              if (!course) return null;

              return (
                <div
                  key={enrollment._id}
                  className="overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md"
                >
                  {/* COURSE IMAGE */}
                  <div className="flex h-44 items-center justify-center bg-gray-200">
                    {course.courseImage ? (
                      <img
                        src={course.courseImage}
                        alt={course.title}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                  </div>

                  {/* CONTENT */}
                  <div className="p-5">
                    <h2 className="text-xl font-bold text-gray-900">
                      {course.title}
                    </h2>

                    <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                      {course.description || "No description available."}
                    </p>

                    {/* STATUS */}
                    <div className="mt-4 flex items-center justify-between">
                      <span className="text-sm text-gray-500">Enrollment</span>

                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          enrollment.status === "Completed"
                            ? "bg-green-100 text-green-700"
                            : enrollment.status === "Cancelled"
                              ? "bg-red-100 text-red-700"
                              : enrollment.status === "Active"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {enrollment.status}
                      </span>
                    </div>

                    {/* PAYMENT */}
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm text-gray-500">Payment</span>

                      <span
                        className={`text-sm font-semibold ${
                          enrollment.paymentStatus === "Paid"
                            ? "text-green-600"
                            : enrollment.paymentStatus === "Failed"
                              ? "text-red-600"
                              : "text-yellow-600"
                        }`}
                      >
                        {enrollment.paymentStatus}
                      </span>
                    </div>

                    {/* PROGRESS */}
                    <div className="mt-5">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-medium text-gray-700">
                          Progress
                        </span>

                        <span className="text-sm font-semibold text-gray-900">
                          {enrollment.progress}%
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                        <div
                          className="h-full rounded-full bg-blue-600 transition-all"
                          style={{
                            width: `${enrollment.progress}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* ACTION */}
                    <button
                      type="button"
                      onClick={() => navigate(`/course/${course._id}`)}
                      className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700"
                    >
                      View Course
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
};

export default MyCourses;
