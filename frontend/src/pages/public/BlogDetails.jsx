import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import {
  ArrowLeft,
  CalendarDays,
  Eye,
  Loader2,
  Tags,
  UserRound,
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
    <article className="bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft size={16} />
            Back to Blogs
          </Link>
          <div className="mt-6 flex flex-wrap gap-3 text-xs font-medium text-slate-500">
            <span className="inline-flex items-center gap-1">
              <Tags size={14} />
              {blog.category}
            </span>
            <span className="inline-flex items-center gap-1">
              <CalendarDays size={14} />
              {formatDate(blog.publishedAt || blog.createdAt)}
            </span>
            <span className="inline-flex items-center gap-1">
              <Eye size={14} />
              {blog.views || 0} views
            </span>
          </div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight">
            {blog.title}
          </h1>
          <p className="mt-5 text-base leading-7 text-slate-600">
            {blog.excerpt}
          </p>
          <div className="mt-6 flex items-center gap-3 text-sm text-slate-600">
            <UserRound size={18} className="text-blue-600" />
            {blog.author?.fullName || "Sipalaya Team"}
          </div>
        </div>
      </section>

      {blog.featuredImage && (
        <div className="mx-auto max-w-5xl px-4 pt-10 sm:px-6 lg:px-8">
          <img
            src={blog.featuredImage}
            alt={blog.title}
            className="max-h-115 w-full rounded-lg object-cover"
          />
        </div>
      )}

      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="prose prose-slate max-w-none whitespace-pre-line text-sm leading-7 text-slate-700">
          {blog.content}
        </div>
        {Array.isArray(blog.tags) && blog.tags.length > 0 && (
          <div className="mt-10 flex flex-wrap gap-2 border-t border-slate-200 pt-6">
            {blog.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </section>
    </article>
  );
};

const LoaderState = ({ label }) => (
  <div className="flex min-h-105 items-center justify-center text-slate-500">
    <Loader2 size={22} className="mr-2 animate-spin" />
    {label}
  </div>
);
const ErrorPage = ({ message }) => (
  <div className="mx-auto max-w-3xl px-4 py-16 text-center">
    <h1 className="text-2xl font-bold">Article unavailable</h1>
    <p className="mt-3 text-sm text-slate-600">{message}</p>
    <Link
      to="/blogs"
      className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
    >
      Back to Blogs
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
