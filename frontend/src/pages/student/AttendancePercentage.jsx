import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";

import { getAttendancePercentage } from "../../api/attendance.services";
import { getMyEnrollments } from "../../api/enrollment.services";

const AttendancePercentage = () => {
  const enrollmentsQuery = useQuery({
    queryKey: ["my-enrollments"],
    queryFn: getMyEnrollments,
  });
  const courses = useMemo(
    () =>
      (enrollmentsQuery.data?.enrollments || [])
        .map((item) => item.course)
        .filter(Boolean),
    [enrollmentsQuery.data],
  );
  const [courseId, setCourseId] = useState("");
  const selectedCourse = courseId || courses[0]?._id || "";

  const reportQuery = useQuery({
    queryKey: ["student-attendance-percentage", selectedCourse],
    queryFn: () => getAttendancePercentage({ course: selectedCourse }),
    enabled: Boolean(selectedCourse),
  });

  if (enrollmentsQuery.isLoading)
    return (
      <div className="flex min-h-100 items-center justify-center">
        <Loader2 size={34} className="animate-spin text-blue-600" />
      </div>
    );

  const report = reportQuery.data?.attendance;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Attendance Report</h1>
        <p className="mt-1 text-sm text-gray-500">
          Select a course to view your attendance percentage.
        </p>
      </div>

      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <select
          value={selectedCourse}
          onChange={(event) => setCourseId(event.target.value)}
          className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
        >
          {courses.length === 0 ? (
            <option value="">No enrolled courses</option>
          ) : (
            courses.map((course) => (
              <option key={course._id} value={course._id}>
                {course.title}
              </option>
            ))
          )}
        </select>

        {reportQuery.isLoading ? (
          <div className="mt-8 flex justify-center">
            <Loader2 size={30} className="animate-spin text-blue-600" />
          </div>
        ) : reportQuery.isError ? (
          <div className="mt-6 rounded-lg bg-red-50 p-4 text-red-700">
            {reportQuery.error?.response?.data?.message ||
              "Failed to load attendance report."}
          </div>
        ) : report ? (
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <Metric
              label="Percentage"
              value={`${report.percentage || 0}%`}
              highlight
            />
            <Metric label="Classes" value={report.totalClasses || 0} />
            <Metric label="Present" value={report.present || 0} />
            <Metric label="Late" value={report.late || 0} />
            <Metric label="Absent" value={report.absent || 0} />
          </div>
        ) : null}
      </section>
    </div>
  );
};

const Metric = ({ label, value, highlight = false }) => (
  <div
    className={`rounded-xl p-5 text-center ${highlight ? "bg-blue-600 text-white" : "bg-gray-50 text-gray-900"}`}
  >
    <p className={`text-sm ${highlight ? "text-blue-100" : "text-gray-500"}`}>
      {label}
    </p>
    <p className="mt-2 text-3xl font-bold">{value}</p>
  </div>
);

export default AttendancePercentage;
