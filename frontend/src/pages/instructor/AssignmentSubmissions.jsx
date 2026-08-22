import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  Loader2,
  RefreshCw,
  Save,
} from "lucide-react";
import { toast } from "react-toastify";

import { getAssignmentById } from "../../api/assignment.services";
import {
  getAssignmentSubmissions,
  gradeSubmission,
} from "../../api/submission.services";

// Helper function to point to the secure backend file download/open route
const getSubmissionFileUrl = (submissionId) => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  return `${apiUrl}/submissions/${submissionId}/file`;
};

const formatDate = (value) => (value ? new Date(value).toLocaleString() : "-");

const AssignmentSubmissions = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [grades, setGrades] = useState({});

  const { data: assignmentData } = useQuery({
    queryKey: ["instructor-assignment", id],
    queryFn: () => getAssignmentById(id),
    enabled: Boolean(id),
  });

  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["assignment-submissions", id],
    queryFn: () => getAssignmentSubmissions(id),
    enabled: Boolean(id),
  });

  const assignment = assignmentData?.assignment;
  const submissions = data?.submissions || [];

  const gradeMutation = useMutation({
    mutationFn: ({ submissionId, payload }) =>
      gradeSubmission(submissionId, payload),
    onSuccess: (response) => {
      toast.success(response?.message || "Submission graded successfully");
      queryClient.invalidateQueries({
        queryKey: ["assignment-submissions", id],
      });
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to grade submission",
      );
    },
  });

  const updateDraft = (submissionId, field, value) => {
    setGrades((current) => ({
      ...current,
      [submissionId]: {
        grade: current[submissionId]?.grade ?? "",
        feedback: current[submissionId]?.feedback ?? "",
        [field]: value,
      },
    }));
  };

  const submitGrade = (submission) => {
    const draft = grades[submission._id] || {};
    const payload = {
      grade:
        draft.grade !== undefined && draft.grade !== ""
          ? draft.grade
          : submission.grade,
      feedback:
        draft.feedback !== undefined ? draft.feedback : submission.feedback,
    };

    gradeMutation.mutate({ submissionId: submission._id, payload });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
        <h2 className="text-xl font-semibold text-red-600">
          Failed to load assignment submissions
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          {error?.response?.data?.message || error?.message}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-blue-700"
        >
          <RefreshCw size={17} />
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <Link
            to="/instructor/submissions"
            className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
          >
            <ArrowLeft size={16} />
            Back to submissions
          </Link>
          <h1 className="text-2xl font-bold tracking-tight text-gray-900">
            {assignment?.title || "Assignment Submissions"}
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            {assignment?.course?.title || "Course"} - {submissions.length}{" "}
            submission{submissions.length === 1 ? "" : "s"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw size={17} className={isFetching ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* Submissions Table Card */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-250 border-collapse text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Student
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Submitted
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-600">
                  File
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Student Note
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Status
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Grade
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Feedback
                </th>
                <th className="px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-600">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {submissions.length === 0 ? (
                <tr>
                  <td
                    colSpan="8"
                    className="px-6 py-12 text-center text-sm text-gray-500"
                  >
                    No students have submitted this assignment yet.
                  </td>
                </tr>
              ) : (
                submissions.map((submission) => {
                  const draft = grades[submission._id] || {};

                  return (
                    <tr
                      key={submission._id}
                      className="transition-colors hover:bg-gray-50/80"
                    >
                      <td className="px-6 py-4 align-middle">
                        <p className="font-semibold text-gray-900">
                          {submission.student?.fullName || "Unknown student"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {submission.student?.email || ""}
                        </p>
                      </td>
                      <td className="px-6 py-4 align-middle text-sm text-gray-700">
                        {formatDate(submission.submittedAt)}
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <a
                          href={getSubmissionFileUrl(submission._id)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700"
                        >
                          <ExternalLink size={16} />
                          Open File
                        </a>
                      </td>
                      <td className="px-6 py-4 align-middle text-sm text-gray-600">
                        <p className="max-w-70 whitespace-pre-line leading-relaxed">
                          {submission.description || "-"}
                        </p>
                      </td>
                      <td className="px-6 py-4 align-middle text-sm text-gray-700">
                        <span className="inline-flex items-center rounded-md bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-800">
                          {submission.status || "-"}
                        </span>
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={draft.grade ?? submission.grade ?? ""}
                          onChange={(event) =>
                            updateDraft(
                              submission._id,
                              "grade",
                              event.target.value,
                            )
                          }
                          className="w-24 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition-all focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                          placeholder="0-100"
                        />
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <textarea
                          value={draft.feedback ?? submission.feedback ?? ""}
                          onChange={(event) =>
                            updateDraft(
                              submission._id,
                              "feedback",
                              event.target.value,
                            )
                          }
                          className="min-h-17.5 w-64 rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none transition-all focus:border-blue-600 focus:ring-1 focus:ring-blue-600"
                          placeholder="Feedback"
                        />
                      </td>
                      <td className="px-6 py-4 align-middle">
                        <button
                          type="button"
                          onClick={() => submitGrade(submission)}
                          disabled={gradeMutation.isPending}
                          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
                        >
                          <Save size={16} />
                          Save
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

export default AssignmentSubmissions;
