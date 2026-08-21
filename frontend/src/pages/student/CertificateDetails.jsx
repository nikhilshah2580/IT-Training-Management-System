import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Award,
  CalendarDays,
  Download,
  Loader2,
  ShieldCheck,
  Sparkles,
  AlertCircle,
  Hash,
  KeyRound,
  User,
  Building,
  CheckCircle2,
  XCircle,
  ExternalLink,
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

  const certificate =
    data?.certificate || data?.data?.certificate || data?.data;

  if (isLoading) {
    return (
      <div className="flex min-h-112.5 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={38} className="animate-spin text-indigo-600" />
          <p className="text-sm font-medium text-slate-500">
            Loading certificate details...
          </p>
        </div>
      </div>
    );
  }

  if (isError || !certificate) {
    return (
      <div className="rounded-2xl border border-red-100 bg-red-50/70 p-8 text-center shadow-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600 mb-4">
          <AlertCircle size={24} />
        </div>
        <h2 className="text-base font-bold text-red-800">
          Certificate Not Found
        </h2>
        <p className="mt-1 text-xs text-red-600 leading-relaxed">
          {error?.response?.data?.message ||
            error?.message ||
            "The requested certificate could not be found or does not exist."}
        </p>
      </div>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-4xl space-y-8 pb-12"
    >
      {/* NAVIGATION BACK */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs md:text-sm font-semibold text-slate-700 shadow-xs transition-all hover:bg-slate-50 hover:border-slate-300"
      >
        <ArrowLeft size={16} /> Back to Certificates
      </button>

      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-indigo-900 via-purple-900 to-blue-900 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-xs font-semibold text-indigo-200 border border-white/15 mb-3">
              <Sparkles size={13} className="text-amber-300" /> Official
              Credential
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              Certificate of Completion
            </h1>
            <p className="mt-1.5 text-sm text-indigo-100 max-w-xl">
              {certificate.course?.title || "Completed Course"}
            </p>
          </div>
          <Badge status={certificate.status || "Issued"} />
        </div>
      </div>

      {/* DETAILS CARD */}
      <section className="rounded-2xl border border-slate-100 bg-white p-6 md:p-8 shadow-xs space-y-8">
        <div className="grid gap-4 md:grid-cols-2">
          <Info
            label="Certificate No."
            value={certificate.certificateNumber || "N/A"}
            icon={Hash}
          />
          <Info
            label="Verification Code"
            value={certificate.verificationCode || "N/A"}
            icon={KeyRound}
          />
          <Info
            label="Student Name"
            value={certificate.student?.fullName || "Student"}
            icon={User}
          />
          <Info
            label="Issued By"
            value={certificate.issuedBy?.fullName || "Platform Admin"}
            icon={Building}
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
            label="Final Grade"
            value={
              certificate.grade !== null && certificate.grade !== undefined
                ? `${certificate.grade} / 100`
                : "N/A"
            }
            icon={Award}
          />
        </div>

        {certificate.certificateUrl && (
          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <a
              href={certificate.certificateUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-linear-to-r from-indigo-600 to-blue-600 px-6 py-3.5 text-xs md:text-sm font-bold text-white shadow-lg shadow-indigo-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              <Download size={16} /> Download Certificate{" "}
              <ExternalLink size={14} />
            </a>
          </div>
        )}
      </section>
    </motion.main>
  );
};

// STATUS BADGE COMPONENT
const Badge = ({ status }) => {
  const normalizedStatus = (status || "Issued").toLowerCase();

  const styles = {
    issued: "bg-emerald-50 text-emerald-700 border-emerald-200/60",
    revoked: "bg-rose-50 text-rose-700 border-rose-200/60",
    pending: "bg-amber-50 text-amber-700 border-amber-200/60",
  };

  const icons = {
    issued: <CheckCircle2 size={12} className="shrink-0" />,
    revoked: <XCircle size={12} className="shrink-0" />,
    pending: <ShieldCheck size={12} className="shrink-0" />,
  };

  const matchedStyle =
    styles[normalizedStatus] ||
    "bg-indigo-50 text-indigo-700 border-indigo-200/60";
  const matchedIcon = icons[normalizedStatus] || (
    <CheckCircle2 size={12} className="shrink-0" />
  );

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-bold border uppercase tracking-wider ${matchedStyle}`}
    >
      {matchedIcon} {status || "Issued"}
    </span>
  );
};

const Info = ({ label, value, icon: Icon }) => (
  <div className="rounded-xl border border-slate-100 bg-slate-50/60 p-4 transition-all hover:bg-slate-50">
    <p className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 mb-1">
      {Icon && <Icon size={14} className="text-indigo-500" />}
      {label}
    </p>
    <p className="text-xs md:text-sm font-bold text-slate-800 break-all">
      {value}
    </p>
  </div>
);

export default CertificateDetails;
