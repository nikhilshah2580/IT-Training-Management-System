import { useQuery } from "@tanstack/react-query";
import { Briefcase, Loader2 } from "lucide-react";

import { getMyJobPlacements } from "../../api/jobPlacement.services";

const MyJobPlacements = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["student-job-placements"],
    queryFn: getMyJobPlacements,
  });

  const placements = data?.placements || data?.jobPlacements || [];

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <ErrorMessage
        message={
          error?.response?.data?.message || "Failed to load job placements."
        }
      />
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Job Placements</h1>
        <p className="mt-1 text-sm text-gray-500">
          Placement records connected to your student profile.
        </p>
      </div>
      {placements.length === 0 ? (
        <Empty
          icon={Briefcase}
          title="No placements yet"
          text="Your placement updates will appear here."
        />
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {placements.map((item) => (
            <article
              key={item._id}
              className="rounded-xl border bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {item.companyName || item.company || "Company"}
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    {item.jobTitle || item.position || "Position"}
                  </p>
                </div>
                <Badge status={item.status} />
              </div>
              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p>Course: {item.course?.title || "N/A"}</p>
                <p>Package: {item.package || item.salary || "N/A"}</p>
                <p>
                  Placed Date:{" "}
                  {item.placementDate
                    ? new Date(item.placementDate).toLocaleDateString()
                    : "N/A"}
                </p>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

const Badge = ({ status }) => (
  <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-semibold text-blue-700">
    {status || "Pending"}
  </span>
);
const Loading = () => (
  <div className="flex min-h-100 items-center justify-center">
    <Loader2 size={34} className="animate-spin text-blue-600" />
  </div>
);
const ErrorMessage = ({ message }) => (
  <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
    {message}
  </div>
);
const Empty = ({ icon: Icon, title, text }) => (
  <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
    <Icon size={42} className="mx-auto text-gray-400" />
    <h2 className="mt-4 text-xl font-semibold">{title}</h2>
    <p className="mt-2 text-gray-500">{text}</p>
  </div>
);

export default MyJobPlacements;
