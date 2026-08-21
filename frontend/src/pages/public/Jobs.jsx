import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ArrowRight, BriefcaseBusiness, Building2, CalendarDays, ExternalLink, Loader2, MapPin, Search } from "lucide-react";

import { getJobListings } from "../../api/jobListing.services";

const employmentTypes = ["All", "Full Time", "Part Time", "Internship", "Contract"];

const Jobs = () => {
  const [search, setSearch] = useState("");
  const [employmentType, setEmploymentType] = useState("All");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["job-listings", { employmentType }],
    queryFn: () => getJobListings(employmentType === "All" ? { status: "Published" } : { status: "Published", employmentType }),
  });

  const jobs = useMemo(() => {
    const list = data?.jobs || data?.jobListings || [];
    const keyword = search.trim().toLowerCase();
    if (!keyword) return list;
    return list.filter((job) => [job.title, job.companyName, job.location, job.employmentType, job.description, ...(job.requirements || [])].join(" ").toLowerCase().includes(keyword));
  }, [data, search]);

  return (
    <div className="bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">Jobs</p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight">IT job openings from placement partners.</h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">Browse backend-managed job listings, deadlines, requirements, and application links.</p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_240px]">
          <div className="relative">
            <Search size={17} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(event) => setSearch(event.target.value)} className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" placeholder="Search title, company, skills..." />
          </div>
          <select value={employmentType} onChange={(event) => setEmploymentType(event.target.value)} className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100">
            {employmentTypes.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        {isLoading ? <LoaderState label="Loading jobs..." /> : isError ? <ErrorState message={error?.response?.data?.message || "Failed to load jobs."} /> : jobs.length === 0 ? <EmptyState /> : (
          <div className="grid gap-6 lg:grid-cols-2">
            {jobs.map((job) => <JobCard key={job._id} job={job} />)}
          </div>
        )}
      </section>
    </div>
  );
};

const JobCard = ({ job }) => (
  <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
    <div className="flex items-start gap-4">
      {job.companyLogo ? <img src={job.companyLogo} alt={job.companyName} className="h-14 w-14 rounded-lg object-cover" /> : <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700"><Building2 size={24} /></div>}
      <div className="min-w-0 flex-1">
        <h2 className="text-xl font-bold text-slate-900">{job.title}</h2>
        <p className="mt-1 text-sm font-medium text-blue-600">{job.companyName}</p>
      </div>
      <span className="rounded-md bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">{job.employmentType}</span>
    </div>

    <p className="mt-5 line-clamp-3 text-sm leading-6 text-slate-600">{job.description}</p>

    <div className="mt-5 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
      <Info icon={MapPin}>{job.location || "Location not specified"}</Info>
      <Info icon={CalendarDays}>Apply by {formatDate(job.applicationDeadline)}</Info>
      <Info icon={BriefcaseBusiness}>{job.status || "Published"}</Info>
    </div>

    {Array.isArray(job.requirements) && job.requirements.length > 0 && (
      <div className="mt-5 flex flex-wrap gap-2">
        {job.requirements.slice(0, 4).map((requirement) => <span key={requirement} className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600">{requirement}</span>)}
      </div>
    )}

    <div className="mt-6 flex flex-wrap gap-3">
      <Link to={`/job/${job._id}`} className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700">View Details <ArrowRight size={16} /></Link>
      {job.applicationUrl && <a href={job.applicationUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700">Apply Now <ExternalLink size={16} /></a>}
    </div>
  </article>
);

const Info = ({ icon: Icon, children }) => <div className="flex items-center gap-2"><Icon size={17} className="text-blue-600" /><span>{children}</span></div>;
const LoaderState = ({ label }) => <div className="flex items-center justify-center py-16 text-slate-500"><Loader2 size={22} className="mr-2 animate-spin" />{label}</div>;
const ErrorState = ({ message }) => <div className="rounded-lg border border-red-100 bg-red-50 p-6 text-sm text-red-700">{message}</div>;
const EmptyState = () => <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center"><h2 className="text-xl font-bold">No published jobs found</h2><p className="mt-2 text-sm text-slate-600">Jobs added from the admin panel will appear here after publishing.</p></div>;
const formatDate = (value) => value ? new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "Not specified";

export default Jobs;
