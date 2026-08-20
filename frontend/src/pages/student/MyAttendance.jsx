import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { CalendarCheck, Loader2 } from "lucide-react";

import { getMyAttendance } from "../../api/attendance.services";
import { getMyEnrollments } from "../../api/enrollment.services";

const MyAttendance = () => {
  const [courseId, setCourseId] = useState("");

  const enrollmentsQuery = useQuery({
    queryKey: ["my-enrollments"],
    queryFn: getMyEnrollments,
  });
  const attendanceQuery = useQuery({
    queryKey: ["student-attendance", courseId],
    queryFn: () => getMyAttendance(courseId ? { course: courseId } : {}),
  });

  const courses = useMemo(
    () =>
      (enrollmentsQuery.data?.enrollments || [])
        .map((item) => item.course)
        .filter(Boolean),
    [enrollmentsQuery.data],
  );
  const attendances = attendanceQuery.data?.attendances || [];

  if (attendanceQuery.isLoading || enrollmentsQuery.isLoading)
    return (
      <div className="flex min-h-100 items-center justify-center">
        <Loader2 size={34} className="animate-spin text-blue-600" />
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Attendance</h1>
          <p className="mt-1 text-sm text-gray-500">
            Track your course attendance records.
          </p>
        </div>
        <Link
          to="/student/attendance/percentage"
          className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
        >
          Attendance Report
        </Link>
      </div>

      <div className="rounded-xl border bg-white p-4 shadow-sm">
        <label className="mb-2 block text-sm font-medium text-gray-700">
          Filter by course
        </label>
        <select
          value={courseId}
          onChange={(event) => setCourseId(event.target.value)}
          className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500 md:max-w-md"
        >
          <option value="">All courses</option>
          {courses.map((course) => (
            <option key={course._id} value={course._id}>
              {course.title}
            </option>
          ))}
        </select>
      </div>

      {attendanceQuery.isError ? (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
          {attendanceQuery.error?.response?.data?.message ||
            "Failed to load attendance."}
        </div>
      ) : attendances.length === 0 ? (
        <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
          <CalendarCheck size={42} className="mx-auto text-gray-400" />
          <h2 className="mt-4 text-xl font-semibold">No attendance records</h2>
          <p className="mt-2 text-gray-500">
            Attendance marked by instructors will appear here.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-left text-xs uppercase text-gray-500">
              <tr>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Course</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3">Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {attendances.map((item) => (
                <tr key={item._id}>
                  <td className="px-5 py-4">
                    {item.date
                      ? new Date(item.date).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td className="px-5 py-4 font-medium text-gray-900">
                    {item.course?.title || "Course"}
                  </td>
                  <td className="px-5 py-4">
                    <Status status={item.status} />
                  </td>
                  <td className="px-5 py-4 text-gray-500">
                    {item.remarks || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

const Status = ({ status }) => {
  const styles = {
    Present: "bg-green-100 text-green-700",
    Absent: "bg-red-100 text-red-700",
    Late: "bg-yellow-100 text-yellow-700",
  };
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[status] || "bg-gray-100 text-gray-700"}`}
    >
      {status || "N/A"}
    </span>
  );
};

export default MyAttendance;
