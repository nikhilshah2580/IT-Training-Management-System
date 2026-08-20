import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Award,
  CalendarDays,
  Download,
  Loader2,
  ShieldCheck,
} from "lucide-react";

import { getCertificateById } from "../../api/certificate.services";

const CertificateDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["certificate", id],
    queryFn: () => getCertificateById(id),
    enabled: Boolean(id),
  });

  const certificate = data?.certificate;

  if (isLoading)
    return (
      <div className="flex min-h-100 items-center justify-center">
        <Loader2 size={34} className="animate-spin text-blue-600" />
      </div>
    );
  if (isError || !certificate)
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700">
        {error?.response?.data?.message || "Certificate not found."}
      </div>
    );

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 rounded-lg border bg-white px-4 py-2.5 font-medium hover:bg-gray-50"
      >
        <ArrowLeft size={17} /> Back
      </button>

      <section className="rounded-xl border bg-white p-8 shadow-sm">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
          <div>
            <Award size={42} className="text-blue-600" />
            <h1 className="mt-4 text-2xl font-bold text-gray-900">
              Certificate of Completion
            </h1>
            <p className="mt-2 text-gray-500">
              {certificate.course?.title || "Course"}
            </p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${certificate.status === "Issued" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}
          >
            {certificate.status}
          </span>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <Info label="Certificate No." value={certificate.certificateNumber} />
          <Info
            label="Verification Code"
            value={certificate.verificationCode}
          />
          <Info
            label="Student"
            value={certificate.student?.fullName || "Student"}
          />
          <Info
            label="Issued By"
            value={certificate.issuedBy?.fullName || "N/A"}
          />
          <Info
            label="Issue Date"
            value={
              certificate.issueDate
                ? new Date(certificate.issueDate).toLocaleDateString()
                : "N/A"
            }
            icon={CalendarDays}
          />
          <Info
            label="Completion Date"
            value={
              certificate.completionDate
                ? new Date(certificate.completionDate).toLocaleDateString()
                : "N/A"
            }
            icon={ShieldCheck}
          />
          <Info
            label="Grade"
            value={
              certificate.grade !== null && certificate.grade !== undefined
                ? `${certificate.grade}/100`
                : "N/A"
            }
          />
        </div>

        {certificate.certificateUrl && (
          <a
            href={certificate.certificateUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            <Download size={18} /> Download Certificate
          </a>
        )}
      </section>
    </div>
  );
};

const Info = ({ label, value, icon: Icon }) => (
  <div className="rounded-lg bg-gray-50 p-4">
    <p className="flex items-center gap-2 text-sm text-gray-500">
      {Icon && <Icon size={16} />}
      {label}
    </p>
    <p className="mt-1 wrap-break-word font-semibold text-gray-900">{value}</p>
  </div>
);

export default CertificateDetails;
