import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Award, CalendarDays, Download, Loader2 } from "lucide-react";

import { getMyCertificates } from "../../api/certificate.services";

const MyCertificates = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["student-certificates"],
    queryFn: getMyCertificates,
  });

  const certificates = data?.certificates || [];

  if (isLoading) return <Loading />;
  if (isError)
    return (
      <ErrorMessage
        message={
          error?.response?.data?.message || "Failed to load certificates."
        }
      />
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Certificates</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and verify certificates issued for completed courses.
        </p>
      </div>

      {certificates.length === 0 ? (
        <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
          <Award size={42} className="mx-auto text-gray-400" />
          <h2 className="mt-4 text-xl font-semibold">No certificates yet</h2>
          <p className="mt-2 text-gray-500">
            Completed course certificates will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {certificates.map((certificate) => (
            <article
              key={certificate._id}
              className="rounded-xl border bg-white p-5 shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-blue-600">
                    {certificate.course?.title || "Course"}
                  </p>
                  <h2 className="mt-2 text-lg font-semibold text-gray-900">
                    {certificate.certificateNumber}
                  </h2>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${certificate.status === "Issued" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
                >
                  {certificate.status}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <p className="flex items-center gap-2">
                  <CalendarDays size={16} /> Issued{" "}
                  {certificate.issueDate
                    ? new Date(certificate.issueDate).toLocaleDateString()
                    : "N/A"}
                </p>
                {certificate.grade !== null &&
                  certificate.grade !== undefined && (
                    <p>
                      Grade:{" "}
                      <span className="font-semibold text-gray-900">
                        {certificate.grade}/100
                      </span>
                    </p>
                  )}
              </div>

              <div className="mt-5 flex gap-3">
                <Link
                  to={`/student/certificates/${certificate._id}`}
                  className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-700"
                >
                  Details
                </Link>
                {certificate.certificateUrl && (
                  <a
                    href={certificate.certificateUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-lg border px-3 py-2.5 text-blue-600 hover:bg-blue-50"
                  >
                    <Download size={18} />
                  </a>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

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

export default MyCertificates;
