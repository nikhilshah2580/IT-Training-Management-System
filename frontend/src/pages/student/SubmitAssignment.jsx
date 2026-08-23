import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Loader2,
  Upload,
  Sparkles,
  FileCheck,
  BookOpen,
} from "lucide-react";
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
  const [description, setDescription] = useState("");

  const assignmentQuery = useQuery({
    queryKey: ["assignment", id],
    queryFn: () => getAssignmentById(id),
    enabled: Boolean(id),
  });

  const submissionsQuery = useQuery({
    queryKey: ["student-submissions"],
    queryFn: getMySubmissions,
  });

  const submissionsList =
    submissionsQuery.data?.submissions ||
    submissionsQuery.data?.data?.submissions ||
    submissionsQuery.data?.data ||
    [];

  const alreadySubmitted = useMemo(
    () =>
      submissionsList.some(
        (item) =>
          (item.assignment?._id || item.assignment?.id || item.assignment) ===
          id,
      ),
    [id, submissionsList],
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
        error?.response?.data?.message ||
          error?.message ||
          "Failed to submit assignment",
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
    payload.append("description", description.trim());
    submitMutation.mutate(payload);
  };

  if (assignmentQuery.isLoading || submissionsQuery.isLoading) {
    return (
      <div className="flex min-h-112.5 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={38} className="animate-spin text-indigo-600" />
          <p className="text-sm font-medium text-slate-500">
            Loading assignment submission form...
          </p>
        </div>
      </div>
    );
  }

  const assignment =
    assignmentQuery.data?.assignment ||
    assignmentQuery.data?.data?.assignment ||
    assignmentQuery.data;

  return (
    <motion.main
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-3xl space-y-8 pb-12"
    >
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs md:text-sm font-semibold text-slate-700 shadow-xs transition-all hover:bg-slate-50 hover:border-slate-300"
      >
        <ArrowLeft size={16} /> Back to Assignment
      </button>

      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-indigo-900 via-purple-900 to-blue-900 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-xs font-semibold text-indigo-200 border border-white/15 mb-3">
              <Sparkles size={13} className="text-amber-300" /> Submission
              Portal
            </div>
            <p className="flex items-center gap-1.5 text-xs font-bold text-indigo-200 mb-1">
              <BookOpen size={14} />{" "}
              {assignment?.course?.title || "Course Assignment"}
            </p>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              {assignment?.title || "Submit Work"}
            </h1>
          </div>
        </div>
      </div>

      <section className="rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-xs">
        {alreadySubmitted ? (
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50/70 p-6 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600">
              <FileCheck size={24} />
            </div>
            <h2 className="text-base font-bold text-emerald-900">
              Already Submitted
            </h2>
            <p className="text-xs text-emerald-700 max-w-sm mx-auto leading-relaxed">
              You have already submitted your work for this assignment. View
              your submission status on the assignment details page.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Assignment File <span className="text-rose-500">*</span>
              </label>

              <div className="relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50/60 p-8 text-center transition hover:bg-slate-50">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 mb-3 shadow-xs">
                  <Upload size={22} />
                </div>
                <p className="text-xs md:text-sm font-bold text-slate-700">
                  {file
                    ? file.name
                    : "Click to browse or drag and drop your file here"}
                </p>
                <p className="mt-1 text-[11px] text-slate-400">
                  Supports PDF, DOC, ZIP, code archives, or document files
                </p>

                <input
                  type="file"
                  onChange={(event) => setFile(event.target.files?.[0] || null)}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  required
                />
              </div>

              {file && (
                <div className="flex items-center justify-between rounded-xl bg-indigo-50/60 border border-indigo-100 px-4 py-2.5 text-xs text-indigo-900 font-medium">
                  <span className="truncate">Selected: {file.name}</span>
                  <button
                    type="button"
                    onClick={() => setFile(null)}
                    className="text-rose-600 font-bold hover:underline ml-2"
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-500">
                Submission Description
              </label>
              <textarea
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows={4}
                maxLength={1000}
                placeholder="Write a short note about your file, what you completed, setup instructions, or anything your instructor should know."
                className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3 text-xs md:text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              />
              <p className="text-right text-[11px] font-medium text-slate-400">
                {description.length}/1000
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                disabled={submitMutation.isPending}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-blue-600 px-6 py-3.5 text-xs md:text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60"
              >
                {submitMutation.isPending ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : (
                  <Upload size={16} />
                )}
                Submit Assignment Work
              </button>
            </div>
          </form>
        )}
      </section>
    </motion.main>
  );
};

export default SubmitAssignment;
