import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowRight,
  CalendarDays,
  Eye,
  Loader2,
  Search,
  Tags,
  BookOpen,
  AlertCircle,
} from "lucide-react";

import { getBlogs } from "../../api/blog.services";
import PublicPageHero from "../../components/common/PublicPageHero";

const categories = [
  "All",
  "Programming",
  "Web Development",
  "Data Science",
  "Cyber Security",
  "Graphic Design",
  "Career",
  "Technology",
  "Other",
];

const Blog = () => {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["blogs", { category }],
    queryFn: () =>
      getBlogs(
        category === "All"
          ? { status: "Published" }
          : { status: "Published", category },
      ),
  });

  const blogs = useMemo(() => {
    const list = data?.blogs || [];
    const keyword = search.trim().toLowerCase();
    if (!keyword) return list;
    return list.filter((blog) =>
      [blog.title, blog.excerpt, blog.category, ...(blog.tags || [])]
        .join(" ")
        .toLowerCase()
        .includes(keyword),
    );
  }, [data, search]);

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 pb-20">
      <PublicPageHero
        title="Our"
        accent="Blogs"
        description="Explore practical insights on programming, web development, design, career growth, and technology from the GyanTech team."
      />

      {/* FILTER & SEARCH TOOLBAR */}
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="grid gap-4 rounded-3xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-xs md:grid-cols-[1fr_260px]"
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
              placeholder="Search blog articles..."
            />
          </div>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-base sm:text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
          >
            {categories.map((item) => (
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
          <LoaderState label="Loading blogs..." />
        ) : isError ? (
          <ErrorState
            message={error?.response?.data?.message || "Failed to load blogs."}
          />
        ) : blogs.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog, index) => (
              <BlogCard key={blog._id} blog={blog} index={index} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const BlogCard = ({ blog, index }) => (
  <motion.article
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4, delay: index * 0.05 }}
    className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xs hover:shadow-xl transition-all duration-300"
  >
    {blog.featuredImage ? (
      <img
        src={blog.featuredImage}
        alt={blog.title}
        className="h-48 w-full object-cover border-b border-slate-100"
      />
    ) : (
      <div className="flex h-48 w-full items-center justify-center bg-linear-to-br from-indigo-500/10 to-purple-500/10 text-sm font-bold text-indigo-600 border-b border-slate-100">
        {blog.category || "Technology"}
      </div>
    )}

    <div className="flex flex-1 flex-col p-6 md:p-8">
      <div className="flex flex-wrap gap-4 text-xs font-semibold text-slate-400">
        <span className="inline-flex items-center gap-1.5">
          <CalendarDays size={14} className="text-indigo-600" />
          {formatDate(blog.publishedAt || blog.createdAt)}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Eye size={14} className="text-indigo-600" />
          {blog.views || 0} views
        </span>
      </div>

      <h2 className="mt-3 line-clamp-2 text-lg md:text-xl font-bold text-slate-900 tracking-tight group-hover:text-indigo-600 transition-colors">
        {blog.title}
      </h2>

      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-slate-600 font-medium">
        {blog.excerpt}
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 rounded-xl border border-indigo-200/60 bg-indigo-50/50 px-3 py-1 text-xs font-bold text-indigo-600">
          <Tags size={13} />
          {blog.category}
        </span>
        {(blog.tags || []).slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="rounded-xl border border-slate-200/60 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-600"
          >
            {tag}
          </span>
        ))}
      </div>

      <Link
        to={`/blog/${blog._id}`}
        className="mt-auto inline-flex items-center gap-2 pt-6 text-sm font-bold text-indigo-600 hover:text-indigo-700 transition"
      >
        Read Article <ArrowRight size={16} />
      </Link>
    </div>
  </motion.article>
);

const LoaderState = ({ label }) => (
  <div className="flex items-center justify-center py-20 text-slate-500 font-semibold">
    <Loader2 size={22} className="mr-2 animate-spin text-indigo-600" />
    {label}
  </div>
);

const ErrorState = ({ message }) => (
  <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm font-medium text-red-700 flex items-center gap-3">
    <AlertCircle size={18} className="shrink-0 text-red-600" />
    <span>{message}</span>
  </div>
);

const EmptyState = () => (
  <div className="rounded-3xl border border-slate-200/80 bg-white p-12 text-center shadow-xs">
    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500/10 to-purple-500/10 text-indigo-600 border border-indigo-200/60 mb-4">
      <BookOpen size={24} />
    </div>
    <h2 className="text-lg font-bold text-slate-900">
      No published blogs found
    </h2>
    <p className="mt-1 text-sm text-slate-500 font-medium">
      Articles created in the backend will appear here after publishing.
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
    : "Draft";

export default Blog;
