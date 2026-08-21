import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarClock,
  CheckCircle2,
  FileText,
  Loader2,
  Upload,
  Sparkles,
  AlertCircle,
  BookOpen,
  Award,
  MessageSquare,
  ExternalLink,
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

  const assignment =
    assignmentQuery.data?.assignment ||
    assignmentQuery.data?.data?.assignment ||
    assignmentQuery.data;
  const submissionsList =
    submissionsQuery.data?.submissions ||
    submissionsQuery.data?.data?.submissions ||
    submissionsQuery.data?.data ||
    [];

  const submission = useMemo(
    () =>
      submissionsList.find(
        (item) =>
          (item.assignment?._id || item.assignment?.id || item.assignment) ===
          id,
      ),
    [id, submissionsList],
  );

  if (assignmentQuery.isLoading) {
    return (
      <div className="flex min-h-112.5 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={38} className="animate-spin text-indigo-600" />
          <p className="text-sm font-medium text-slate-500">
            Loading assignment details...
          </p>
        </div>
      </div>
    );
  }

  if (assignmentQuery.isError || !assignment) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50/70 p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600 mb-4">
          <AlertCircle size={24} />
        </div>
        <h2 className="text-base font-bold text-red-800">
          Assignment Not Found
        </h2>
        <p className="mt-1 text-xs text-red-600 leading-relaxed">
          {assignmentQuery.error?.response?.data?.message ||
            assignmentQuery.error?.message ||
            "The requested assignment could not be loaded or does not exist."}
        </p>
      </div>
    );
  }

  const dueDate = assignment.dueDate ? new Date(assignment.dueDate) : null;

  return (
    <motion.main
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 pb-12"
    >
      {/* NAVIGATION BACK */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs md:text-sm font-semibold text-slate-700 shadow-xs transition-all hover:bg-slate-50 hover:border-slate-300"
      >
        <ArrowLeft size={16} /> Back to Assignments
      </button>

      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-indigo-900 via-purple-900 to-blue-900 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-xs font-semibold text-indigo-200 border border-white/15 mb-3">
              <Sparkles size={13} className="text-amber-300" /> Assignment
              Portal
            </div>
            <p className="flex items-center gap-1.5 text-xs font-bold text-indigo-200 mb-1">
              <BookOpen size={14} /> {assignment.course?.title || "Course"}
            </p>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              {assignment.title}
            </h1>
          </div>
          <Badge status={assignment.status || "Active"} />
        </div>
      </div>

      {/* ASSIGNMENT DETAILS & SUBMISSION GRID */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* LEFT COLUMN: INSTRUCTIONS & ATTACHMENT */}
        <section className="lg:col-span-2 rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-xs space-y-6">
          <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm font-semibold text-slate-600">
            <span className="inline-flex items-center gap-2 rounded-xl bg-indigo-50 border border-indigo-100 px-3.5 py-2 text-indigo-700">
              <CalendarClock size={16} className="text-indigo-500" /> Due:{" "}
              {dueDate ? dueDate.toLocaleString() : "N/A"}
            </span>

            {assignment.attachment && (
              <a
                href={assignment.attachment}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-blue-50 border border-blue-100 px-3.5 py-2 font-bold text-blue-600 transition-all hover:bg-blue-100/60"
              >
                <FileText size={16} /> View Attachment{" "}
                <ExternalLink size={13} />
              </a>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100">
            <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
              Instructions & Description
            </h2>
            <p className="whitespace-pre-line leading-relaxed text-xs md:text-sm text-slate-600">
              {assignment.description ||
                "No specific instructions provided for this assignment."}
            </p>
          </div>
        </section>

        {/* RIGHT COLUMN: SUBMISSION CARD */}
        <section className="rounded-2xl border border-slate-100 bg-white p-6 shadow-xs flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-800 tracking-tight mb-4 flex items-center gap-2">
              <Upload size={18} className="text-indigo-600" /> Submission Status
            </h2>

            {submission ? (
              <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-5 space-y-3.5 text-xs md:text-sm">
                <div className="flex items-center gap-2 font-bold text-emerald-800">
                  <CheckCircle2 size={18} className="shrink-0" /> Submitted
                  Successfully
                </div>

                <div className="space-y-2 pt-2 border-t border-emerald-100 text-slate-700">
                  <p className="flex justify-between">
                    <span className="text-slate-400 font-medium">Status:</span>
                    <span className="font-bold uppercase tracking-wider text-emerald-700">
                      {submission.status || "Submitted"}
                    </span>
                  </p>

                  {submission.grade !== null &&
                    submission.grade !== undefined && (
                      <p className="flex justify-between items-center">
                        <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                          <Award size={14} /> Grade:
                        </span>
                        <span className="font-black text-indigo-600 text-base">
                          {submission.grade} / 100
                        </span>
                      </p>
                    )}

                  {submission.feedback && (
                    <div className="pt-2 border-t border-emerald-100">
                      <span className="flex items-center gap-1.5 text-slate-400 font-medium mb-1">
                        <MessageSquare size={14} /> Feedback:
                      </span>
                      <p className="text-slate-600 italic leading-relaxed bg-white/60 p-2.5 rounded-lg border border-emerald-100">
                        {submission.feedback}
                      </p>
                    </div>
                  )}
                </div>

                {submission.file && (
                  <div className="pt-2">
                    <a
                      href={submission.file}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:underline"
                    >
                      <FileText size={14} /> Open submitted file{" "}
                      <ExternalLink size={12} />
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <div className="rounded-xl border border-slate-100 bg-slate-50 p-5 text-center space-y-4">
                <p className="text-xs text-slate-500 leading-relaxed">
                  You haven't submitted your work for this assignment yet. Click
                  below to upload your file.
                </p>
                <Link
                  to={`/student/assignments/${id}/submit`}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-blue-600 px-4 py-3 text-xs md:text-sm font-bold text-white shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
                >
                  <Upload size={16} /> Submit Assignment
                </Link>
              </div>
            )}
          </div>
        </section>
      </div>
    </motion.main>
  );
};

// STATUS BADGE COMPONENT
const Badge = ({ status }) => {
  const normalizedStatus = (status || "Active").toLowerCase();

  const styles = {
    active: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    closed: "bg-slate-100 text-slate-600 border-slate-200",
    upcoming: "bg-amber-50 text-amber-700 border-amber-200/60",
  };

  const matchedStyle =
    styles[normalizedStatus] ||
    "bg-indigo-50 text-indigo-700 border-indigo-200/60";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-bold border uppercase tracking-wider ${matchedStyle}`}
    >
      {status || "Active"}
    </span>
  );
};

export default AssignmentDetails;
