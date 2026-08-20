import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ExternalLink, FileText, Loader2 } from "lucide-react";

import { getMyEnrollments } from "../../api/enrollment.services";
import { getCourseResources } from "../../api/resource.services";

const CourseResources = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["student-course-resources"],
    queryFn: async () => {
      const enrollmentResponse = await getMyEnrollments();
      const enrollments = enrollmentResponse?.enrollments || [];
      const courses = enrollments.map((item) => item.course).filter(Boolean);
      const resourceResponses = await Promise.all(
        courses.map((course) =>
          getCourseResources(course._id).catch(() => ({ resources: [] })),
        ),
      );

      return resourceResponses.flatMap((response, index) =>
        (response.resources || []).map((resource) => ({
          ...resource,
          course: resource.course || courses[index],
        })),
      );
    },
  });

  const resources = data || [];

  if (isLoading)
    return (
      <div className="flex min-h-100 items-center justify-center">
        <Loader2 size={34} className="animate-spin text-blue-600" />
      </div>
    );
  if (isError)
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        {error?.response?.data?.message || "Failed to load resources."}
      </div>
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Course Resources</h1>
        <p className="mt-1 text-sm text-gray-500">
          Learning materials shared for your enrolled courses.
        </p>
      </div>

      {resources.length === 0 ? (
        <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
          <FileText size={42} className="mx-auto text-gray-400" />
          <h2 className="mt-4 text-xl font-semibold">No resources yet</h2>
          <p className="mt-2 text-gray-500">
            Published resources will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {resources.map((resource) => (
            <ResourceCard key={resource._id} resource={resource} />
          ))}
        </div>
      )}
    </div>
  );
};

const ResourceCard = ({ resource }) => (
  <article className="rounded-xl border bg-white p-5 shadow-sm">
    <div className="flex items-start justify-between gap-4">
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase text-blue-600">
          {resource.type || "resource"}
        </p>
        <h2 className="mt-2 truncate text-lg font-semibold text-gray-900">
          {resource.title}
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          {resource.course?.title || "Course"}
        </p>
      </div>
      <FileText className="shrink-0 text-blue-600" size={22} />
    </div>
    <p className="mt-4 line-clamp-3 text-sm text-gray-600">
      {resource.description || "No description available."}
    </p>
    <div className="mt-5 flex gap-3">
      <Link
        to={`/student/resources/${resource._id}`}
        className="flex-1 rounded-lg border px-4 py-2.5 text-center text-sm font-semibold hover:bg-gray-50"
      >
        Details
      </Link>
      <a
        href={resource.url}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
      >
        <ExternalLink size={16} /> Open
      </a>
    </div>
  </article>
);

export default CourseResources;
