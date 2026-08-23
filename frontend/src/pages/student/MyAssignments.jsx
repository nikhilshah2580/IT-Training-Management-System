import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AlertCircle,
  CalendarClock,
  ClipboardList,
  Loader2,
  Upload,
  Sparkles,
  CheckCircle2,
  FileText,
} from "lucide-react";

import { getStudentAssignments } from "../../api/assignment.services";
import { getMySubmissions } from "../../api/submission.services";

const MyAssignments = () => {
  const navigate = useNavigate();

  const assignmentsQuery = useQuery({
    queryKey: ["student-assignments"],
    queryFn: () => getStudentAssignments({ limit: 100 }),
  });

  const submissionsQuery = useQuery({
    queryKey: ["student-submissions"],
    queryFn: getMySubmissions,
  });

  const assignments =
    assignmentsQuery.data?.assignments ||
    assignmentsQuery.data?.data?.assignments ||
    [];
  const submissions =
    submissionsQuery.data?.submissions ||
    submissionsQuery.data?.data?.submissions ||
    [];

  const submittedAssignmentIds = useMemo(
    () =>
      new Set(
        (submissions || [])
          .map(
            (item) =>
              item.assignment?._id || item.assignment?.id || item.assignment,
          )
          .filter(Boolean),
      ),
    [submissions],
  );

  if (assignmentsQuery.isLoading || submissionsQuery.isLoading) {
    return (
      <div className="flex min-h-112.5 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={38} className="animate-spin text-indigo-600" />
          <p className="text-sm font-medium text-slate-500">
            Loading your assignments...
          </p>
        </div>
      </div>
    );
  }

  if (assignmentsQuery.isError) {
    return (
      <div className="flex min-h-112.5 items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-100 bg-red-50/70 p-8 text-center shadow-sm backdrop-blur-md">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600 mb-4">
            <AlertCircle size={24} />
          </div>
          <h2 className="text-base font-bold text-red-800">
            Failed to Load Assignments
          </h2>
          <p className="mt-1 text-xs text-red-600 leading-relaxed">
            {assignmentsQuery.error?.response?.data?.message ||
              assignmentsQuery.error?.message ||
              "Failed to load assignments."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 pb-12"
    >
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-indigo-900 via-purple-900 to-blue-900 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-xs font-semibold text-indigo-200 border border-white/15 mb-3">
              <Sparkles size={13} className="text-amber-300" /> Academic
              Submissions
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              My Assignments
            </h1>
            <p className="mt-1.5 text-sm text-indigo-100 max-w-xl">
              View course deliverables, track submission deadlines, and upload
              your coursework directly.
            </p>
          </div>
        </div>
      </div>

      {assignments.length === 0 ? (
        <div className="flex min-h-87.5 items-center justify-center px-4 rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-xs">
          <div className="max-w-md text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-xs mb-4">
              <ClipboardList size={30} />
            </div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">
              No Assignments Yet
            </h2>
            <p className="mt-1.5 text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              Assignments from your active enrolled courses will appear here.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {assignments.map((assignment, idx) => {
            const submitted = submittedAssignmentIds.has(
              assignment._id || assignment.id,
            );
            const dueDate = assignment.dueDate
              ? new Date(assignment.dueDate)
              : null;
            const isOverdue = dueDate && dueDate < new Date();

            return (
              <motion.article
                key={assignment._id || assignment.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-xs transition-all hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 mb-1">
                        <FileText size={13} />{" "}
                        {assignment.course?.title || "Course Assignment"}
                      </span>
                      <h2 className="line-clamp-1 text-base font-bold text-slate-800 tracking-tight group-hover:text-indigo-600 transition">
                        {assignment.title}
                      </h2>
                    </div>
                    <StatusBadge
                      submitted={submitted}
                      overdue={isOverdue}
                      status={assignment.status}
                    />
                  </div>

                  <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-slate-500">
                    {assignment.description ||
                      "No specific instructions provided for this assignment."}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-2.5">
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600 border border-slate-100">
                      <CalendarClock size={15} className="text-slate-400" />
                      Due:{" "}
                      {dueDate ? dueDate.toLocaleDateString() : "No deadline"}
                    </span>
                    {assignment.attachment && (
                      <a
                        href={assignment.attachment}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 rounded-xl bg-indigo-50 px-3 py-2 text-xs font-bold text-indigo-600 border border-indigo-100 hover:bg-indigo-100 transition"
                      >
                        View Attachment
                      </a>
                    )}
                  </div>
                </div>

                <div className="mt-6 flex gap-3 pt-4 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/student/assignments/${assignment._id || assignment.id}`,
                      )
                    }
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition"
                  >
                    View Details
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/student/assignments/${assignment._id || assignment.id}/submit`,
                      )
                    }
                    disabled={submitted || assignment.status === "Closed"}
                    className={`flex-1 inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition shadow-xs ${
                      submitted
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200 cursor-default"
                        : assignment.status === "Closed"
                          ? "bg-slate-100 text-slate-400 border border-slate-200 cursor-not-allowed"
                          : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-500/20"
                    }`}
                  >
                    {submitted ? (
                      <>
                        Submitted{" "}
                        <CheckCircle2 size={14} className="text-emerald-600" />
                      </>
                    ) : (
                      <>
                        Submit Work <Upload size={14} />
                      </>
                    )}
                  </button>
                </div>
              </motion.article>
            );
          })}
        </div>
      )}
    </motion.main>
  );
};

const StatusBadge = ({ submitted, overdue, status }) => {
  if (submitted)
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200/60 shrink-0">
        <CheckCircle2 size={11} /> Submitted
      </span>
    );
  if (status === "Closed")
    return (
      <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600 border border-slate-200 shrink-0">
        Closed
      </span>
    );
  if (overdue)
    return (
      <span className="rounded-full bg-rose-50 px-2.5 py-0.5 text-[10px] font-bold text-rose-700 border border-rose-200/60 shrink-0">
        Overdue
      </span>
    );
  return (
    <span className="rounded-full bg-indigo-50 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700 border border-indigo-200/60 shrink-0">
      Active
    </span>
  );
};

export default MyAssignments;
