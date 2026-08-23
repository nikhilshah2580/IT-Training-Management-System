import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Loader2,
  Star,
  MessageSquareQuote,
  Sparkles,
  AlertCircle,
  PlusCircle,
  CheckCircle2,
  Clock,
  XCircle,
  Info,
} from "lucide-react";

import { getMyTestimonials } from "../../api/testimonial.services";

const MyTestimonials = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["student-testimonials"],
    queryFn: getMyTestimonials,
  });

  const testimonials =
    data?.testimonials || data?.data?.testimonials || data?.data || [];

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <ErrorMessage
        message={
          error?.response?.data?.message ||
          error?.message ||
          "Failed to load testimonials."
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
              <Sparkles size={13} className="text-amber-300" /> Student Success
              Stories
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              My Testimonials
            </h1>
            <p className="mt-1.5 text-sm text-indigo-100 max-w-xl">
              Track your submitted feedback, testimonial approval statuses, and
              featured highlights across the platform.
            </p>
          </div>
          <Link
            to="/student/testimonials/create"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-amber-400 to-orange-500 px-5 py-3 text-xs md:text-sm font-black text-slate-900 shadow-lg shadow-orange-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] shrink-0"
          >
            <PlusCircle size={16} /> Create Testimonial
          </Link>
        </div>
      </div>

      {testimonials.length === 0 ? (
        <Empty />
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {testimonials.map((item) => (
            <motion.article
              whileHover={{ y: -3 }}
              transition={{ duration: 0.2 }}
              key={item._id || item.id}
              className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-xs transition-all hover:shadow-md hover:border-slate-200"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-1 text-amber-400">
                    {Array.from({ length: 5 }).map((_, index) => {
                      const rating = Number(item.rating || 0);
                      const isFilled = index < rating;
                      return (
                        <Star
                          key={index}
                          size={15}
                          fill={isFilled ? "currentColor" : "none"}
                          className={
                            isFilled ? "text-amber-400" : "text-slate-200"
                          }
                        />
                      );
                    })}
                  </div>
                  <Badge status={item.status} />
                </div>

                <p className="text-xs md:text-sm leading-relaxed text-slate-600">
                  {item.message || "No message provided."}
                </p>
              </div>

              {item.adminNote && (
                <div className="mt-5 rounded-xl border border-rose-100 bg-rose-50/70 p-4 text-xs text-rose-800 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-rose-900">
                    <Info size={14} className="shrink-0" /> Admin Feedback:
                  </div>
                  <p className="text-rose-700 leading-relaxed">
                    {item.adminNote}
                  </p>
                </div>
              )}
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
    approved: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    published: "bg-indigo-50 text-indigo-700 border-indigo-200/60",
    pending: "bg-amber-50 text-amber-700 border-amber-200/60",
    rejected: "bg-rose-50 text-rose-700 border-rose-200/60",
  };

  const icons = {
    approved: <CheckCircle2 size={11} className="shrink-0" />,
    published: <Sparkles size={11} className="shrink-0" />,
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
        Loading testimonials...
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
      Failed to Load Testimonials
    </h2>
    <p className="mt-1 text-xs text-red-600 leading-relaxed">{message}</p>
  </div>
);

const Empty = () => (
  <div className="flex min-h-87.5 items-center justify-center px-4 rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-xs">
    <div className="max-w-md text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-xs mb-4">
        <MessageSquareQuote size={30} />
      </div>
      <h2 className="text-xl font-black text-slate-800 tracking-tight">
        No Testimonials Yet
      </h2>
      <p className="mt-1.5 text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
        Share your learning experience and success story by clicking the create
        button above.
      </p>
    </div>
  </div>
);

export default MyTestimonials;
