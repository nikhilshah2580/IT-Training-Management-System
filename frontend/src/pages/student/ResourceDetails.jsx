import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ExternalLink,
  FileText,
  Loader2,
  Sparkles,
  AlertCircle,
  BookOpen,
  Video,
  FileCode,
  Link2,
} from "lucide-react";

import { getResourceById } from "../../api/resource.services";

const ResourceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["resource", id],
    queryFn: () => getResourceById(id),
    enabled: Boolean(id),
  });

  const resource = data?.resource || data?.data?.resource || data?.data;

  if (isLoading) {
    return (
      <div className="flex min-h-112.5 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={38} className="animate-spin text-indigo-600" />
          <p className="text-sm font-medium text-slate-500">
            Loading resource details...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !resource) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50/70 p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600 mb-4">
          <AlertCircle size={24} />
        </div>
        <h2 className="text-base font-bold text-red-800">Resource Not Found</h2>
        <p className="mt-1 text-xs text-red-600 leading-relaxed">
          {error?.response?.data?.message ||
            error?.message ||
            "The requested study resource could not be found or does not exist."}
        </p>
      </div>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-3xl space-y-8 pb-12"
    >
      {/* NAVIGATION BACK */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs md:text-sm font-semibold text-slate-700 shadow-xs transition-all hover:bg-slate-50 hover:border-slate-300"
      >
        <ArrowLeft size={16} /> Back to Resources
      </button>

      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-indigo-900 via-purple-900 to-blue-900 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-xs font-semibold text-indigo-200 border border-white/15 mb-3">
              <Sparkles size={13} className="text-amber-300" /> Study Material
            </div>
            <p className="flex items-center gap-1.5 text-xs font-bold text-indigo-200 mb-1">
              <BookOpen size={14} /> {resource.course?.title || "Course"}
            </p>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              {resource.title}
            </h1>
          </div>
          <Badge type={resource.type} />
        </div>
      </div>

      {/* DETAILS CARD */}
      <section className="rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-xs space-y-6">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-3">
            Resource Description
          </h2>
          <p className="whitespace-pre-line leading-relaxed text-xs md:text-sm text-slate-600">
            {resource.description ||
              "No description available for this resource."}
          </p>
        </div>

        {resource.url && (
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <a
              href={resource.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-blue-600 px-6 py-3.5 text-xs md:text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <ExternalLink size={16} /> Open Resource{" "}
              <ExternalLink size={12} />
            </a>
          </div>
        )}
      </section>
    </motion.main>
  );
};

// TYPE BADGE COMPONENT
const Badge = ({ type }) => {
  const normalizedType = (type || "resource").toLowerCase();

  const icons = {
    pdf: <FileText size={13} className="text-rose-400" />,
    video: <Video size={13} className="text-blue-400" />,
    link: <Link2 size={13} className="text-indigo-400" />,
    code: <FileCode size={13} className="text-emerald-400" />,
  };

  const matchedIcon = icons[normalizedType] || (
    <FileText size={13} className="text-indigo-400" />
  );

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider text-white">
      {matchedIcon} {type || "Resource"}
    </span>
  );
};

export default ResourceDetails;
