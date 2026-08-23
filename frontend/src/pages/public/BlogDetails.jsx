import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  Eye,
  Loader2,
  Tags,
  UserRound,
  Sparkles,
  Share2,
  AlertCircle,
} from "lucide-react";

import { getBlogById } from "../../api/blog.services";

const BlogDetails = () => {
  const { id } = useParams();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["blog", id],
    queryFn: () => getBlogById(id),
    enabled: Boolean(id),
  });

  const blog = data?.blog;

  if (isLoading) return <LoaderState label="Loading article..." />;
  if (isError || !blog)
    return (
      <ErrorPage
        message={error?.response?.data?.message || "Blog article not found."}
      />
    );

  return (
    <article className="min-h-screen bg-slate-50/50 text-slate-900 pb-20">
      {/* COMPACT & VIBRANT COLORFUL HERO SECTION */}
      <section className="relative overflow-hidden bg-linear-to-r from-indigo-900 via-purple-900 to-blue-900 py-14 px-4 sm:px-6 lg:px-8 text-white shadow-md">
        <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-pink-500/30 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 h-64 w-64 rounded-full bg-cyan-500/30 blur-2xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 mx-auto max-w-4xl"
        >
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-bold text-pink-300 backdrop-blur-md shadow-sm mb-6 transition hover:bg-white/20 active:scale-95"
          >
            <ArrowLeft size={14} />
            Back to Blogs
          </Link>

          <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-pink-300 font-semibold mb-3">
            <span className="inline-flex items-center gap-1.5">
              <Tags size={14} />
              {blog.category}
            </span>
            <span className="inline-flex items-center gap-1.5 text-slate-200">
              <CalendarDays size={14} className="text-pink-300" />
              {formatDate(blog.publishedAt || blog.createdAt)}
            </span>
            <span className="inline-flex items-center gap-1.5 text-slate-200">
              <Eye size={14} className="text-pink-300" />
              {blog.views || 0} views
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white leading-snug">
            {blog.title}
          </h1>

          <p className="mt-4 text-sm sm:text-base leading-relaxed text-slate-200 font-medium">
            {blog.excerpt}
          </p>

          <div className="mt-6 flex items-center justify-between border-t border-white/15 pt-5 text-sm text-slate-200">
            <div className="flex items-center gap-2.5 font-semibold">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 border border-white/20 text-pink-300">
                <UserRound size={18} />
              </div>
              <span>{blog.author?.fullName || "Sipalaya Team"}</span>
            </div>

            {/* Extra SaaS Feature: Quick Actions Bar */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(window.location.href);
                  alert("Article link copied to clipboard!");
                }}
                className="inline-flex items-center gap-1.5 rounded-xl border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold text-white transition hover:bg-white/20 active:scale-95"
                title="Share Article"
              >
                <Share2 size={13} /> Share
              </button>
            </div>
          </div>
        </motion.div>
      </section>

      {/* FEATURED IMAGE */}
      {blog.featuredImage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="mx-auto max-w-5xl px-4 pt-10 sm:px-6 lg:px-8"
        >
          <img
            src={blog.featuredImage}
            alt={blog.title}
            className="max-h-112.5 w-full rounded-3xl border border-slate-200/80 object-cover shadow-xl shadow-indigo-500/5 bg-white"
          />
        </motion.div>
      )}

      {/* ARTICLE CONTENT CARD */}
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 md:p-12 shadow-xs"
        >
          <div className="prose prose-slate max-w-none whitespace-pre-line text-sm md:text-base leading-relaxed text-slate-700 font-medium">
            {blog.content}
          </div>

          {Array.isArray(blog.tags) && blog.tags.length > 0 && (
            <div className="mt-12 flex flex-wrap items-center gap-2 border-t border-slate-100 pt-8">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 mr-2 flex items-center gap-1">
                <Sparkles size={12} className="text-indigo-600" /> Tags:
              </span>
              {blog.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-xl border border-slate-200/80 bg-slate-50 px-3.5 py-1.5 text-xs font-semibold text-slate-600"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      </section>
    </article>
  );
};

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
    <h1 className="text-xl font-bold text-slate-900">Article unavailable</h1>
    <p className="mt-2 text-sm text-slate-500 font-medium">{message}</p>
    <Link
      to="/blogs"
      className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-indigo-500/20 transition hover:scale-[1.02]"
    >
      <ArrowLeft size={16} /> Back to Blogs
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
    : "Draft";

export default BlogDetails;
