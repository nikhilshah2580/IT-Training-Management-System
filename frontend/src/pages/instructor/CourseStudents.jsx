import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

import {
  getInstructorEnrollments,
  updateEnrollmentProgress,
} from "../../api/enrollment.services";

const CourseStudents = () => {
  const queryClient = useQueryClient();

  const [courseId, setCourseId] = useState("");
  const [progressValues, setProgressValues] = useState({});

  const { data, isLoading, isError } = useQuery({
    queryKey: ["instructor-enrollments", courseId],
    queryFn: () => getInstructorEnrollments(courseId ? { courseId } : {}),
  });

  const progressMutation = useMutation({
    mutationFn: ({ enrollmentId, progress }) =>
      updateEnrollmentProgress(enrollmentId, progress),

    onSuccess: (data) => {
      toast.success(data?.message || "Progress updated successfully");

      queryClient.invalidateQueries({
        queryKey: ["instructor-enrollments"],
      });
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to update progress",
      );
    },
  });

  const enrollments = data?.enrollments || [];

  // Get unique courses for filter
  const courses = enrollments.reduce((result, enrollment) => {
    const course = enrollment.course;

    if (course && !result.some((item) => item._id === course._id)) {
      result.push(course);
    }

    return result;
  }, []);

  const handleProgressChange = (enrollmentId, value) => {
    setProgressValues((prev) => ({
      ...prev,
      [enrollmentId]: value,
    }));
  };

  const handleUpdateProgress = (enrollment) => {
    const currentProgress =
      progressValues[enrollment._id] ?? enrollment.progress ?? 0;

    progressMutation.mutate({
      enrollmentId: enrollment._id,
      progress: Number(currentProgress),
    });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Loading students...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <p className="text-red-600">Failed to load students.</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Course Students</h1>

        <p className="mt-1 text-gray-600">
          Manage students enrolled in your courses.
        </p>
      </div>

      {/* Course Filter */}
      <div className="mb-6 rounded-xl bg-white p-5 shadow">
        <label className="mb-2 block font-medium text-gray-700">
          Filter by Course
        </label>

        <select
          value={courseId}
          onChange={(event) => setCourseId(event.target.value)}
          className="w-full max-w-md rounded-lg border border-gray-300 px-4 py-3 outline-none"
        >
          <option value="">All Courses</option>

          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>

      {/* Students */}
      <div className="overflow-hidden rounded-xl bg-white shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Student
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Course
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Status
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Payment
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Progress
                </th>

                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Action
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {enrollments.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-10 text-center text-gray-500"
                  >
                    No students enrolled yet.
                  </td>
                </tr>
              ) : (
                enrollments.map((enrollment) => {
                  const student = enrollment.student;

                  const course = enrollment.course;

                  const progress =
                    progressValues[enrollment._id] ?? enrollment.progress ?? 0;

                  return (
                    <tr key={enrollment._id} className="hover:bg-gray-50">
                      {/* Student */}
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {student?.fullName}
                        </div>

                        <div className="text-sm text-gray-500">
                          {student?.email}
                        </div>
                      </td>

                      {/* Course */}
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {course?.title}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4">
                        <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-700">
                          {enrollment.status}
                        </span>
                      </td>

                      {/* Payment */}
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            enrollment.paymentStatus === "Paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {enrollment.paymentStatus}
                        </span>
                      </td>

                      {/* Progress */}
                      <td className="px-6 py-4">
                        <div className="w-40">
                          <div className="mb-1 flex justify-between text-xs">
                            <span>{progress}%</span>
                          </div>

                          <input
                            type="range"
                            min="0"
                            max="100"
                            value={progress}
                            onChange={(event) =>
                              handleProgressChange(
                                enrollment._id,
                                event.target.value,
                              )
                            }
                            className="w-full"
                          />
                        </div>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => handleUpdateProgress(enrollment)}
                          disabled={progressMutation.isPending}
                          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {progressMutation.isPending
                            ? "Updating..."
                            : "Update"}
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CourseStudents;
