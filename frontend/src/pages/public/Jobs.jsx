import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  CalendarDays,
  ExternalLink,
  Loader2,
  MapPin,
  Search,
} from "lucide-react";

import { getJobListings } from "../../api/jobListing.services";
import PublicPageHero from "../../components/common/PublicPageHero";

const employmentTypes = [
  "All",
  "Full Time",
  "Part Time",
  "Internship",
  "Contract",
];

const Jobs = () => {
  const [search, setSearch] = useState("");
  const [employmentType, setEmploymentType] = useState("All");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["job-listings", { employmentType }],
    queryFn: () =>
      getJobListings(
        employmentType === "All"
          ? { status: "Published" }
          : { status: "Published", employmentType },
      ),
  });

  const jobs = useMemo(() => {
    const list = data?.jobs || data?.jobListings || [];
    const keyword = search.trim().toLowerCase();
    if (!keyword) return list;
    return list.filter((job) =>
      [
        job.title,
        job.companyName,
        job.location,
        job.employmentType,
        job.description,
        ...(job.requirements || []),
      ]
        .join(" ")
        .toLowerCase()
        .includes(keyword),
    );
  }, [data, search]);

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 pb-20">
      <PublicPageHero
        title="Find Your Next"
        accent="Opportunity"
        description="Explore current technology roles, placement partners, and career opportunities that help you move forward."
      />

      {/* FILTER & SEARCH TOOLBAR */}
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid gap-4 rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs md:grid-cols-[1fr_240px]"
        >
          <div className="relative">
            <Search
              size={17}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 py-3 pl-11 pr-4 text-base sm:text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              placeholder="Search title, company, skills..."
            />
          </div>
          <select
            value={employmentType}
            onChange={(event) => setEmploymentType(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-base sm:text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
          >
            {employmentTypes.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </motion.div>
      </section>

      {/* MAIN CONTENT GRID */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {isLoading ? (
          <LoaderState label="Loading jobs..." />
        ) : isError ? (
          <ErrorState
            message={error?.response?.data?.message || "Failed to load jobs."}
          />
        ) : jobs.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {jobs.map((job, index) => (
              <JobCard key={job._id} job={job} index={index} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const JobCard = ({ job, index }) => (
  <motion.article
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: index * 0.05 }}
    className="group flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-xs hover:shadow-xl transition-all duration-300"
  >
    <div>
      <div className="flex items-start gap-4">
        {job.companyLogo ? (
          <img
            src={job.companyLogo}
            alt={job.companyName}
            className="h-14 w-14 rounded-2xl border border-slate-100 object-cover shadow-2xs"
          />
        ) : (
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500/10 to-purple-500/10 text-indigo-600 border border-indigo-200/60 shadow-2xs">
            <Building2 size={24} />
          </div>
        )}
        <div className="min-w-0 flex-1">
          <h2 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
            {job.title}
          </h2>
          <p className="mt-0.5 text-sm font-semibold text-indigo-600">
            {job.companyName}
          </p>
        </div>
        <span className="rounded-xl border border-slate-200/80 bg-slate-50 px-3 py-1 text-xs font-bold text-slate-700">
          {job.employmentType}
        </span>
      </div>

      <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-slate-600">
        {job.description}
      </p>

      <div className="mt-5 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
        <Info icon={MapPin}>{job.location || "Location not specified"}</Info>
        <Info icon={CalendarDays}>
          Apply by {formatDate(job.applicationDeadline)}
        </Info>
        <Info icon={BriefcaseBusiness}>{job.status || "Published"}</Info>
      </div>

      {Array.isArray(job.requirements) && job.requirements.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {job.requirements.slice(0, 4).map((requirement) => (
            <span
              key={requirement}
              className="rounded-xl border border-slate-200/60 bg-slate-50/70 px-3 py-1 text-xs font-semibold text-slate-600"
            >
              {requirement}
            </span>
          ))}
        </div>
      )}
    </div>

    <div className="mt-6 flex flex-wrap gap-3 pt-5 border-t border-slate-100">
      <Link
        to={`/job/${job._id}`}
        className="inline-flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-slate-50/50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50/30 hover:text-indigo-600 active:scale-95"
      >
        View Details <ArrowRight size={16} />
      </Link>
      {job.applicationUrl && (
        <Link
          to={`/job/${job._id}`}
          className="inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-indigo-500/20 transition hover:scale-[1.02] active:scale-95"
        >
          Apply Now <ExternalLink size={16} />
        </Link>
      )}
    </div>
  </motion.article>
);

const Info = ({ icon: Icon, children }) => (
  <div className="flex items-center gap-2 font-medium">
    <Icon size={17} className="text-indigo-600 shrink-0" />
    <span className="truncate">{children}</span>
  </div>
);

const LoaderState = ({ label }) => (
  <div className="flex items-center justify-center py-20 text-slate-500 font-semibold">
    <Loader2 size={22} className="mr-2 animate-spin text-indigo-600" />
    {label}
  </div>
);

const ErrorState = ({ message }) => (
  <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm font-medium text-red-700">
    {message}
  </div>
);

const EmptyState = () => (
  <div className="rounded-3xl border border-slate-200/80 bg-white p-12 text-center shadow-xs">
    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500/10 to-purple-500/10 text-indigo-600 border border-indigo-200/60 mb-4">
      <BriefcaseBusiness size={24} />
    </div>
    <h2 className="text-lg font-bold text-slate-900">
      No published jobs found
    </h2>
    <p className="mt-1 text-sm text-slate-500">
      Jobs added from the admin panel will appear here after publishing.
    </p>
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

export default Jobs;
