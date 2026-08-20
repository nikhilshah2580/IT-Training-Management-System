import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ExternalLink, FileText, Loader2 } from "lucide-react";

import { getResourceById } from "../../api/resource.services";

const ResourceDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["resource", id],
    queryFn: () => getResourceById(id),
    enabled: Boolean(id),
  });

  const resource = data?.resource;

  if (isLoading)
    return (
      <div className="flex min-h-100 items-center justify-center">
        <Loader2 size={34} className="animate-spin text-blue-600" />
      </div>
    );
  if (isError || !resource)
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        {error?.response?.data?.message || "Resource not found."}
      </div>
    );

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2.5 font-medium hover:bg-gray-50"
      >
        <ArrowLeft size={17} /> Back
      </button>

      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <FileText size={38} className="text-blue-600" />
        <p className="mt-4 text-xs font-semibold uppercase text-blue-600">
          {resource.type}
        </p>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">
          {resource.title}
        </h1>
        <p className="mt-2 text-sm text-gray-500">
          {resource.course?.title || "Course"}
        </p>
        <p className="mt-6 whitespace-pre-line leading-7 text-gray-700">
          {resource.description || "No description available."}
        </p>
        <a
          href={resource.url}
          target="_blank"
          rel="noreferrer"
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
        >
          <ExternalLink size={18} /> Open Resource
        </a>
      </section>
    </div>
  );
};

export default ResourceDetails;
