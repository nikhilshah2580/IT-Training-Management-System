import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Loader2, Upload } from "lucide-react";
import { toast } from "react-toastify";

import { getAssignmentById } from "../../api/assignment.services";
import {
  createSubmission,
  getMySubmissions,
} from "../../api/submission.services";

const SubmitAssignment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [file, setFile] = useState(null);

  const assignmentQuery = useQuery({
    queryKey: ["assignment", id],
    queryFn: () => getAssignmentById(id),
    enabled: Boolean(id),
  });

  const submissionsQuery = useQuery({
    queryKey: ["student-submissions"],
    queryFn: getMySubmissions,
  });

  const alreadySubmitted = useMemo(
    () =>
      (submissionsQuery.data?.submissions || []).some(
        (item) => (item.assignment?._id || item.assignment) === id,
      ),
    [id, submissionsQuery.data],
  );

  const submitMutation = useMutation({
    mutationFn: createSubmission,
    onSuccess: (response) => {
      toast.success(response?.message || "Assignment submitted successfully");
      queryClient.invalidateQueries({ queryKey: ["student-submissions"] });
      navigate(`/student/assignments/${id}`);
    },
    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to submit assignment",
      );
    },
  });

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!file) {
      toast.error("Please choose a file to submit");
      return;
    }

    const payload = new FormData();
    payload.append("assignment", id);
    payload.append("file", file);
    submitMutation.mutate(payload);
  };

  if (assignmentQuery.isLoading || submissionsQuery.isLoading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <Loader2 size={34} className="animate-spin text-blue-600" />
      </div>
    );
  }

  const assignment = assignmentQuery.data?.assignment;

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2.5 font-medium hover:bg-gray-50"
      >
        <ArrowLeft size={17} /> Back
      </button>

      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Submit Assignment</h1>
        <p className="mt-2 text-sm text-gray-500">
          {assignment?.title || "Assignment"}
        </p>

        {alreadySubmitted ? (
          <div className="mt-6 rounded-lg bg-green-50 p-4 text-sm font-medium text-green-700">
            You have already submitted this assignment.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Assignment File *
              </label>
              <input
                type="file"
                onChange={(event) => setFile(event.target.files?.[0] || null)}
                className="w-full rounded-lg border px-4 py-3 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-blue-700"
                required
              />
            </div>

            <button
              type="submit"
              disabled={submitMutation.isPending}
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
            >
              {submitMutation.isPending ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <Upload size={18} />
              )}
              Submit Work
            </button>
          </form>
        )}
      </section>
    </div>
  );
};

export default SubmitAssignment;
