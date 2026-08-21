import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ExternalLink,
  Loader2,
  MapPin,
  Sparkles,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { getJobListing } from "../../api/jobListing.services";

const JobDetails = () => {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["job-listing", id],
    queryFn: () => getJobListing(id),
    enabled: Boolean(id),
  });

  const job = data?.job || data?.jobListing;

  if (isLoading) return <LoaderState label="Loading job details..." />;
  if (isError || !job)
    return (
      <ErrorPage
        message={error?.response?.data?.message || "Job listing not found."}
      />
    );

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 pb-20">
      {/* COMPACT & VIBRANT COLORFUL HERO SECTION */}
      <section className="relative overflow-hidden bg-linear-to-r from-indigo-900 via-purple-900 to-blue-900 py-14 px-4 sm:px-6 lg:px-8 text-white shadow-md">
        <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-pink-500/30 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 h-64 w-64 rounded-full bg-cyan-500/30 blur-2xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 mx-auto max-w-5xl"
        >
          <Link
            to="/jobs"
            className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-bold text-pink-300 backdrop-blur-md shadow-sm mb-6 transition hover:bg-white/20 active:scale-95"
          >
            <ArrowLeft size={14} /> Back to Jobs
          </Link>

          <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
            {job.companyLogo ? (
              <img
                src={job.companyLogo}
                alt={job.companyName}
                className="h-20 w-20 rounded-2xl border border-white/20 object-cover shadow-md bg-white"
              />
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-white/10 border border-white/20 text-pink-300 shadow-md backdrop-blur-md">
                <Building2 size={32} />
              </div>
            )}

            <div className="min-w-0 flex-1">
              <div className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-300 uppercase tracking-wider mb-1">
                <Sparkles size={12} /> {job.companyName}
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white leading-snug">
                {job.title}
              </h1>

              <div className="mt-4 flex flex-wrap gap-4 text-xs sm:text-sm text-slate-200 font-medium">
                <Info icon={BriefcaseBusiness}>{job.employmentType}</Info>
                <Info icon={MapPin}>
                  {job.location || "Location not specified"}
                </Info>
                <Info icon={CalendarDays}>
                  Apply by {formatDate(job.applicationDeadline)}
                </Info>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* MAIN CONTENT SECTION */}
      <section className="mx-auto grid max-w-5xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_320px] lg:px-8">
        {/* LEFT COLUMN: DESCRIPTION & REQUIREMENTS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="space-y-8"
        >
          <div className="rounded-3xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-xs">
            <h2 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">
              Job Description
            </h2>
            <p className="mt-4 whitespace-pre-line text-sm leading-relaxed text-slate-600 font-medium">
              {job.description}
            </p>
          </div>

          {Array.isArray(job.requirements) && job.requirements.length > 0 && (
            <div className="rounded-3xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-xs">
              <h2 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">
                Requirements & Tech Stack
              </h2>
              <ul className="mt-4 space-y-3">
                {job.requirements.map((requirement) => (
                  <li
                    key={requirement}
                    className="flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-slate-50/50 px-4 py-3 text-sm font-medium text-slate-700"
                  >
                    <CheckCircle2
                      size={18}
                      className="text-indigo-600 shrink-0 mt-0.5"
                    />
                    <span>{requirement}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </motion.div>

        {/* RIGHT COLUMN: APPLICATION SIDEBAR */}
        <motion.aside
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="h-fit rounded-3xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-xs space-y-6"
        >
          <div>
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Application Overview
            </h2>
            <div className="mt-4 space-y-3 text-sm text-slate-600 font-medium border-t border-slate-100 pt-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-bold uppercase text-[11px] tracking-wider">
                  Status
                </span>
                <span className="rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-800">
                  {job.status}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400 font-bold uppercase text-[11px] tracking-wider">
                  Deadline
                </span>
                <span className="text-slate-800 font-semibold">
                  {formatDate(job.applicationDeadline)}
                </span>
              </div>
            </div>
          </div>

          {job.applicationUrl ? (
            <a
              href={job.applicationUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:scale-[1.01] active:scale-95"
            >
              Apply Now <ExternalLink size={17} />
            </a>
          ) : (
            <div className="flex items-start gap-3 rounded-2xl bg-amber-50/80 border border-amber-200/60 p-4 text-xs font-medium text-amber-800">
              <AlertCircle
                size={18}
                className="shrink-0 mt-0.5 text-amber-600"
              />
              <p>
                Application link is not available yet. Please contact Sipalaya
                placement support for assistance.
              </p>
            </div>
          )}
        </motion.aside>
      </section>
    </div>
  );
};

const Info = ({ icon: Icon, children }) => (
  <span className="inline-flex items-center gap-2 font-medium">
    <Icon size={16} className="text-pink-300 shrink-0" />
    <span>{children}</span>
  </span>
);

const LoaderState = ({ label }) => (
  <div className="flex min-h-105 items-center justify-center text-slate-500 font-semibold">
    <Loader2 size={22} className="mr-2 animate-spin text-indigo-600" />
    {label}
  </div>
);

const ErrorPage = ({ message }) => (
  <div className="mx-auto max-w-3xl px-4 py-24 text-center">
    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-600 border border-red-200 mb-4 shadow-2xs">
      <AlertCircle size={26} />
    </div>
    <h1 className="text-xl font-bold text-slate-900">Job unavailable</h1>
    <p className="mt-2 text-sm text-slate-500 font-medium">{message}</p>
    <Link
      to="/jobs"
      className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-indigo-500/20 transition hover:scale-[1.02]"
    >
      <ArrowLeft size={16} /> Back to Jobs
    </Link>
  </div>
);

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Not specified";

export default JobDetails;
