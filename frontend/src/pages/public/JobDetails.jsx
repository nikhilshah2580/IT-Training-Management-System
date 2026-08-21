import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, BriefcaseBusiness, Building2, CalendarDays, ExternalLink, Loader2, MapPin } from "lucide-react";

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
  if (isError || !job) return <ErrorPage message={error?.response?.data?.message || "Job listing not found."} />;

  return (
    <div className="bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8">
          <Link to="/jobs" className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"><ArrowLeft size={16} />Back to Jobs</Link>
          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-start">
            {job.companyLogo ? <img src={job.companyLogo} alt={job.companyName} className="h-20 w-20 rounded-lg object-cover" /> : <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700"><Building2 size={30} /></div>}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-blue-600">{job.companyName}</p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight">{job.title}</h1>
              <div className="mt-5 flex flex-wrap gap-4 text-sm text-slate-600">
                <Info icon={BriefcaseBusiness}>{job.employmentType}</Info>
                <Info icon={MapPin}>{job.location || "Location not specified"}</Info>
                <Info icon={CalendarDays}>Apply by {formatDate(job.applicationDeadline)}</Info>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-8 px-4 py-12 sm:px-6 lg:grid-cols-[1fr_280px] lg:px-8">
        <div>
          <h2 className="text-xl font-bold">Job Description</h2>
          <p className="mt-4 whitespace-pre-line text-sm leading-7 text-slate-700">{job.description}</p>

          {Array.isArray(job.requirements) && job.requirements.length > 0 && (
            <div className="mt-10">
              <h2 className="text-xl font-bold">Requirements</h2>
              <ul className="mt-4 space-y-3">
                {job.requirements.map((requirement) => <li key={requirement} className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">{requirement}</li>)}
              </ul>
            </div>
          )}
        </div>

        <aside className="h-fit rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-bold">Application</h2>
          <div className="mt-4 space-y-3 text-sm text-slate-600">
            <p>Status: <span className="font-semibold text-slate-900">{job.status}</span></p>
            <p>Deadline: <span className="font-semibold text-slate-900">{formatDate(job.applicationDeadline)}</span></p>
          </div>
          {job.applicationUrl ? <a href={job.applicationUrl} target="_blank" rel="noreferrer" className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">Apply Now <ExternalLink size={16} /></a> : <p className="mt-6 rounded-lg bg-slate-50 p-4 text-sm text-slate-600">Application link is not available yet. Please contact Sipalaya placement support.</p>}
        </aside>
      </section>
    </div>
  );
};

const Info = ({ icon: Icon, children }) => <span className="inline-flex items-center gap-2"><Icon size={17} className="text-blue-600" />{children}</span>;
const LoaderState = ({ label }) => <div className="flex min-h-[420px] items-center justify-center text-slate-500"><Loader2 size={22} className="mr-2 animate-spin" />{label}</div>;
const ErrorPage = ({ message }) => <div className="mx-auto max-w-3xl px-4 py-16 text-center"><h1 className="text-2xl font-bold">Job unavailable</h1><p className="mt-3 text-sm text-slate-600">{message}</p><Link to="/jobs" className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700">Back to Jobs</Link></div>;
const formatDate = (value) => value ? new Date(value).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "Not specified";

export default JobDetails;
