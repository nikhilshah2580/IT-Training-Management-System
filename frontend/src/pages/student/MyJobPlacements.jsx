import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import {
  Briefcase,
  Loader2,
  AlertCircle,
  Sparkles,
  Building2,
  BadgeDollarSign,
  CalendarDays,
  CheckCircle2,
  Clock,
  XCircle,
  BookOpen,
} from "lucide-react";

import { getMyJobPlacements } from "../../api/jobPlacement.services";

const MyJobPlacements = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["student-job-placements"],
    queryFn: getMyJobPlacements,
  });

  const placements =
    data?.placements ||
    data?.jobPlacements ||
    data?.data?.placements ||
    data?.data ||
    [];

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <ErrorMessage
        message={
          error?.response?.data?.message ||
          error?.message ||
          "Failed to load job placements."
        }
      />
    );

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
              <Sparkles size={13} className="text-amber-300" /> Career &
              Opportunities
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              My Job Placements 
            </h1>
            <p className="mt-1.5 text-sm text-indigo-100 max-w-xl">
              Track your career placement milestones, corporate offers, and
              employment records linked to your student profile.
            </p>
          </div>
        </div>
      </div>

      {placements.length === 0 ? (
        <Empty
          icon={Briefcase}
          title="No Placements Yet"
          text="Your official placement records and career updates will appear here once registered."
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {placements.map((item) => (
            <motion.article
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              key={item._id || item.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-xs transition-all hover:shadow-md hover:border-slate-200"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-xs">
                    <Building2 size={22} />
                  </div>
                  <Badge status={item.status} />
                </div>

                <h2 className="text-base font-bold text-slate-800 tracking-tight line-clamp-1">
                  {item.companyName || item.company || "Company Name"}
                </h2>
                <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-indigo-600">
                  <Briefcase size={13} className="shrink-0" />{" "}
                  {item.jobTitle || item.position || "Position"}
                </p>

                <div className="mt-5 space-y-2.5 pt-4 border-t border-slate-100 text-xs">
                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                      <BookOpen size={13} /> Course:
                    </span>
                    <span className="font-bold text-slate-800 truncate max-w-45">
                      {item.course?.title || "N/A"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                      <BadgeDollarSign size={13} /> Package:
                    </span>
                    <span className="font-bold text-emerald-600">
                      {item.package || item.salary || "N/A"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-600">
                    <span className="flex items-center gap-1.5 text-slate-400 font-medium">
                      <CalendarDays size={13} /> Placed Date:
                    </span>
                    <span className="font-semibold text-slate-700">
                      {item.placementDate
                        ? new Date(item.placementDate).toLocaleDateString()
                        : "N/A"}
                    </span>
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      )}
    </motion.main>
  );
};

// STATUS BADGE COMPONENT
const Badge = ({ status }) => {
  const normalizedStatus = (status || "Pending").toLowerCase();

  const styles = {
    placed: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    selected: "bg-indigo-50 text-indigo-700 border-indigo-200/60",
    offered: "bg-blue-50 text-blue-700 border-blue-200/60",
    pending: "bg-amber-50 text-amber-700 border-amber-200/60",
    rejected: "bg-rose-50 text-rose-700 border-rose-200/60",
  };

  const icons = {
    placed: <CheckCircle2 size={11} className="shrink-0" />,
    selected: <Sparkles size={11} className="shrink-0" />,
    offered: <Briefcase size={11} className="shrink-0" />,
    pending: <Clock size={11} className="shrink-0" />,
    rejected: <XCircle size={11} className="shrink-0" />,
  };

  const matchedStyle =
    styles[normalizedStatus] || "bg-slate-100 text-slate-700 border-slate-200";
  const matchedIcon = icons[normalizedStatus] || (
    <Clock size={11} className="shrink-0" />
  );

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold border uppercase tracking-wider ${matchedStyle}`}
    >
      {matchedIcon} {status || "Pending"}
    </span>
  );
};

const Loading = () => (
  <div className="flex min-h-112.5 items-center justify-center">
    <div className="flex flex-col items-center gap-3">
      <Loader2 size={38} className="animate-spin text-indigo-600" />
      <p className="text-sm font-medium text-slate-500">
        Loading placement records...
      </p>
    </div>
  </div>
);

const ErrorMessage = ({ message }) => (
  <div className="rounded-2xl border border-red-100 bg-red-50/70 p-8 text-center shadow-sm">
    <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600 mb-4">
      <AlertCircle size={24} />
    </div>
    <h2 className="text-base font-bold text-red-800">
      Failed to Load Placements
    </h2>
    <p className="mt-1 text-xs text-red-600 leading-relaxed">{message}</p>
  </div>
);

const Empty = ({ icon: Icon, title, text }) => (
  <div className="flex min-h-87.5 items-center justify-center px-4 rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-xs">
    <div className="max-w-md text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-xs mb-4">
        <Icon size={30} />
      </div>
      <h2 className="text-xl font-black text-slate-800 tracking-tight">
        {title}
      </h2>
      <p className="mt-1.5 text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
        {text}
      </p>
    </div>
  </div>
);

export default MyJobPlacements;
