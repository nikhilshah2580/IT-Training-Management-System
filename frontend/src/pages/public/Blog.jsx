import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  CalendarDays,
  Eye,
  Loader2,
  Search,
  Tags,
} from "lucide-react";

import { getBlogs } from "../../api/blog.services";

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
    <div className="bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Blog
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight">
            IT trends, learning tips, and career guidance.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
            Read backend-managed articles from Sipalaya instructors and admins.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-[1fr_260px]">
          <div className="relative">
            <Search
              size={17}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="w-full rounded-lg border border-slate-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              placeholder="Search blog articles..."
            />
          </div>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          >
            {categories.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
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
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

const BlogCard = ({ blog }) => (
  <article className="flex h-full flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
    {blog.featuredImage ? (
      <img
        src={blog.featuredImage}
        alt={blog.title}
        className="h-48 w-full object-cover"
      />
    ) : (
      <div className="flex h-48 w-full items-center justify-center bg-blue-50 text-sm font-semibold text-blue-700">
        {blog.category || "Technology"}
      </div>
    )}
    <div className="flex flex-1 flex-col p-5">
      <div className="flex flex-wrap gap-3 text-xs font-medium text-slate-500">
        <span className="inline-flex items-center gap-1">
          <CalendarDays size={14} />
          {formatDate(blog.publishedAt || blog.createdAt)}
        </span>
        <span className="inline-flex items-center gap-1">
          <Eye size={14} />
          {blog.views || 0} views
        </span>
      </div>
      <h2 className="mt-3 line-clamp-2 text-xl font-bold text-slate-900">
        {blog.title}
      </h2>
      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-600">
        {blog.excerpt}
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        <span className="inline-flex items-center gap-1 rounded-md bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
          <Tags size={13} />
          {blog.category}
        </span>
        {(blog.tags || []).slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600"
          >
            {tag}
          </span>
        ))}
      </div>
      <Link
        to={`/blog/${blog._id}`}
        className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-semibold text-blue-600 hover:text-blue-700"
      >
        Read Article <ArrowRight size={16} />
      </Link>
    </div>
  </article>
);

const LoaderState = ({ label }) => (
  <div className="flex items-center justify-center py-16 text-slate-500">
    <Loader2 size={22} className="mr-2 animate-spin" />
    {label}
  </div>
);
const ErrorState = ({ message }) => (
  <div className="rounded-lg border border-red-100 bg-red-50 p-6 text-sm text-red-700">
    {message}
  </div>
);
const EmptyState = () => (
  <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
    <h2 className="text-xl font-bold">No published blogs found</h2>
    <p className="mt-2 text-sm text-slate-600">
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
