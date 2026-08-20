import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  FileText,
  Loader2,
  Upload,
} from "lucide-react";

import { getAssignmentById } from "../../api/assignment.services";
import { getMySubmissions } from "../../api/submission.services";

const AssignmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const assignmentQuery = useQuery({
    queryKey: ["assignment", id],
    queryFn: () => getAssignmentById(id),
    enabled: Boolean(id),
  });

  const submissionsQuery = useQuery({
    queryKey: ["student-submissions"],
    queryFn: getMySubmissions,
  });

  const assignment = assignmentQuery.data?.assignment;
  const submission = useMemo(
    () =>
      (submissionsQuery.data?.submissions || []).find(
        (item) => (item.assignment?._id || item.assignment) === id,
      ),
    [id, submissionsQuery.data],
  );

  if (assignmentQuery.isLoading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <Loader2 size={34} className="animate-spin text-blue-600" />
      </div>
    );
  }

  if (assignmentQuery.isError || !assignment) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        {assignmentQuery.error?.response?.data?.message ||
          "Assignment not found."}
      </div>
    );
  }

  const dueDate = assignment.dueDate ? new Date(assignment.dueDate) : null;

  return (
    <div className="space-y-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2.5 font-medium hover:bg-gray-50"
      >
        <ArrowLeft size={17} /> Back
      </button>

      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <p className="text-sm font-medium text-blue-600">
              {assignment.course?.title || "Course"}
            </p>
            <h1 className="mt-2 text-2xl font-bold text-gray-900">
              {assignment.title}
            </h1>
          </div>
          <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
            {assignment.status || "Active"}
          </span>
        </div>

        <div className="mt-5 flex flex-wrap gap-3 text-sm text-gray-600">
          <span className="inline-flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
            <CalendarClock size={16} /> Due{" "}
            {dueDate ? dueDate.toLocaleString() : "N/A"}
          </span>
          {assignment.attachment && (
            <a
              href={assignment.attachment}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-blue-50 px-3 py-2 font-medium text-blue-600"
            >
              <FileText size={16} /> Attachment
            </a>
          )}
        </div>

        <p className="mt-6 whitespace-pre-line leading-7 text-gray-700">
          {assignment.description}
        </p>
      </section>

      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">Submission</h2>
        {submission ? (
          <div className="mt-4 rounded-lg bg-green-50 p-4 text-green-800">
            <div className="flex items-center gap-2 font-semibold">
              <CheckCircle2 size={18} /> Submitted
            </div>
            <p className="mt-2 text-sm">Status: {submission.status}</p>
            {submission.grade !== null && submission.grade !== undefined && (
              <p className="mt-1 text-sm">Grade: {submission.grade}/100</p>
            )}
            {submission.feedback && (
              <p className="mt-1 text-sm">Feedback: {submission.feedback}</p>
            )}
            {submission.file && (
              <a
                href={submission.file}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-block text-sm font-semibold text-green-700 underline"
              >
                Open submitted file
              </a>
            )}
          </div>
        ) : (
          <div className="mt-4 flex flex-col gap-3 rounded-lg bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-gray-600">
              You have not submitted this assignment yet.
            </p>
            <Link
              to={`/student/assignments/${id}/submit`}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
            >
              <Upload size={16} /> Submit Assignment
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default AssignmentDetails;
