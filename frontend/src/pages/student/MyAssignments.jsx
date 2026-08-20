import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  AlertCircle,
  CalendarClock,
  CheckCircle2,
  ClipboardList,
  Loader2,
  Upload,
} from "lucide-react";

import { getMyAssignments } from "../../api/assignment.services";
import { getMySubmissions } from "../../api/submission.services";

const MyAssignments = () => {
  const navigate = useNavigate();

  const assignmentsQuery = useQuery({
    queryKey: ["student-assignments"],
    queryFn: () => getMyAssignments({ limit: 100 }),
  });

  const submissionsQuery = useQuery({
    queryKey: ["student-submissions"],
    queryFn: getMySubmissions,
  });

  const assignments = assignmentsQuery.data?.assignments || [];
  const submissions = submissionsQuery.data?.submissions || [];

  const submittedAssignmentIds = useMemo(
    () =>
      new Set(
        submissions
          .map((item) => item.assignment?._id || item.assignment)
          .filter(Boolean),
      ),
    [submissions],
  );

  if (assignmentsQuery.isLoading || submissionsQuery.isLoading) {
    return <LoadingState label="Loading assignments..." />;
  }

  if (assignmentsQuery.isError) {
    return (
      <ErrorState
        message={
          assignmentsQuery.error?.response?.data?.message ||
          "Failed to load assignments."
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Assignments</h1>
        <p className="mt-1 text-sm text-gray-500">
          View course assignments and submit your work.
        </p>
      </div>

      {assignments.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {assignments.map((assignment) => {
            const submitted = submittedAssignmentIds.has(assignment._id);
            const dueDate = assignment.dueDate
              ? new Date(assignment.dueDate)
              : null;
            const isOverdue = dueDate && dueDate < new Date();

            return (
              <article
                key={assignment._id}
                className="rounded-xl border bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h2 className="truncate text-lg font-semibold text-gray-900">
                      {assignment.title}
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                      {assignment.course?.title || "Course"}
                    </p>
                  </div>
                  <StatusBadge
                    submitted={submitted}
                    overdue={isOverdue}
                    status={assignment.status}
                  />
                </div>

                <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-600">
                  {assignment.description}
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3 text-sm text-gray-600">
                  <span className="inline-flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
                    <CalendarClock size={16} />
                    Due {dueDate ? dueDate.toLocaleDateString() : "N/A"}
                  </span>
                  {assignment.attachment && (
                    <a
                      href={assignment.attachment}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-lg bg-blue-50 px-3 py-2 font-medium text-blue-600 hover:bg-blue-100"
                    >
                      View Attachment
                    </a>
                  )}
                </div>

                <div className="mt-5 flex gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/student/assignments/${assignment._id}`)
                    }
                    className="rounded-lg border px-4 py-2.5 text-sm font-semibold hover:bg-gray-50"
                  >
                    Details
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      navigate(`/student/assignments/${assignment._id}/submit`)
                    }
                    disabled={submitted || assignment.status === "Closed"}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    <Upload size={16} />
                    {submitted ? "Submitted" : "Submit"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
};

const StatusBadge = ({ submitted, overdue, status }) => {
  if (submitted)
    return (
      <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
        Submitted
      </span>
    );
  if (status === "Closed")
    return (
      <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
        Closed
      </span>
    );
  if (overdue)
    return (
      <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
        Overdue
      </span>
    );
  return (
    <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
      Active
    </span>
  );
};

const LoadingState = ({ label }) => (
  <div className="flex min-h-100 items-center justify-center">
    <Loader2 size={34} className="animate-spin text-blue-600" />
    <span className="ml-3 text-gray-500">{label}</span>
  </div>
);
const ErrorState = ({ message }) => (
  <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
    <AlertCircle className="mb-3" />
    {message}
  </div>
);
const EmptyState = () => (
  <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
    <ClipboardList size={38} className="mx-auto text-gray-400" />
    <h2 className="mt-4 text-xl font-semibold">No assignments yet</h2>
    <p className="mt-2 text-gray-500">
      Assignments from your courses will appear here.
    </p>
  </div>
);

export default MyAssignments;
