import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ExternalLink,
  FileText,
  Loader2,
  AlertCircle,
  Sparkles,
  BookOpen,
  Download,
  Video,
  FileCode,
  Link2,
} from "lucide-react";

import { getMyEnrollments } from "../../api/enrollment.services";
import { getCourseResources } from "../../api/resource.services";

const CourseResources = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["student-course-resources"],
    queryFn: async () => {
      const enrollmentResponse = await getMyEnrollments();
      const enrollments =
        enrollmentResponse?.enrollments ||
        enrollmentResponse?.data?.enrollments ||
        enrollmentResponse?.data ||
        [];
      const courses = enrollments.map((item) => item.course).filter(Boolean);

      const resourceResponses = await Promise.all(
        courses.map((course) =>
          getCourseResources(course._id || course.id).catch(() => ({
            resources: [],
          })),
        ),
      );

      return resourceResponses.flatMap((response, index) => {
        const resList =
          response.resources || response.data?.resources || response.data || [];
        return resList.map((resource) => ({
          ...resource,
          course: resource.course || courses[index],
        }));
      });
    },
  });

  const resources = data || [];

  if (isLoading) {
    return (
      <div className="flex min-h-112.5 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={38} className="animate-spin text-indigo-600" />
          <p className="text-sm font-medium text-slate-500">
            Loading course resources...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50/70 p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600 mb-4">
          <AlertCircle size={24} />
        </div>
        <h2 className="text-base font-bold text-red-800">
          Failed to Load Resources
        </h2>
        <p className="mt-1 text-xs text-red-600 leading-relaxed">
          {error?.response?.data?.message ||
            error?.message ||
            "Failed to load course resources."}
        </p>
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
              <Sparkles size={13} className="text-amber-300" /> Study Materials
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              Course Resources
            </h1>
            <p className="mt-1.5 text-sm text-indigo-100 max-w-xl">
              Access curated learning materials, lecture slides, documents, and
              references shared across your enrolled courses.
            </p>
          </div>
        </div>
      </div>

      {resources.length === 0 ? (
        <div className="flex min-h-87.5 items-center justify-center px-4 rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-xs">
          <div className="max-w-md text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-xs mb-4">
              <FileText size={30} />
            </div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">
              No Resources Yet
            </h2>
            <p className="mt-1.5 text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              Published learning materials and instructor handouts will appear
              here when available.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {resources.map((resource) => (
            <ResourceCard
              key={resource._id || resource.id}
              resource={resource}
            />
          ))}
        </div>
      )}
    </motion.main>
  );
};

const ResourceCard = ({ resource }) => {
  const typeIcons = {
    pdf: <FileText size={16} className="text-rose-500" />,
    video: <Video size={16} className="text-blue-500" />,
    link: <Link2 size={16} className="text-indigo-500" />,
    code: <FileCode size={16} className="text-emerald-500" />,
  };

  const resourceType = (resource.type || "resource").toLowerCase();
  const icon = typeIcons[resourceType] || (
    <FileText size={16} className="text-indigo-500" />
  );

  return (
    <article className="flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-xs transition-all hover:shadow-md hover:border-slate-200">
      <div>
        <div className="flex items-start justify-between gap-4 mb-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-50 border border-slate-200/60 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-600">
            {icon} {resource.type || "Resource"}
          </span>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
            <FileText size={18} />
          </div>
        </div>

        <h2 className="text-base font-bold text-slate-800 tracking-tight line-clamp-1">
          {resource.title}
        </h2>
        <p className="mt-1 flex items-center gap-1.5 text-xs font-semibold text-indigo-600">
          <BookOpen size={13} className="shrink-0" />{" "}
          {resource.course?.title || "Course"}
        </p>

        <p className="mt-3.5 line-clamp-3 text-xs leading-relaxed text-slate-500">
          {resource.description || "No description provided for this resource."}
        </p>
      </div>

      <div className="mt-6 flex items-center gap-3 pt-4 border-t border-slate-100">
        <Link
          to={`/student/resources/${resource._id || resource.id}`}
          className="flex-1 rounded-xl border border-slate-200 bg-slate-50/50 py-2.5 text-center text-xs font-bold text-slate-700 transition hover:bg-slate-100 active:scale-[0.98]"
        >
          Details
        </Link>
        {resource.url && (
          <a
            href={resource.url}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-sm shadow-indigo-500/20 transition hover:bg-indigo-700 active:scale-[0.98]"
          >
            <ExternalLink size={14} /> Open
          </a>
        )}
      </div>
    </article>
  );
};

export default CourseResources;
