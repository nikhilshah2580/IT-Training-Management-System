import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Award,
  CalendarDays,
  Download,
  Loader2,
  AlertCircle,
  Sparkles,
  ExternalLink,
  CheckCircle2,
} from "lucide-react";

import { getMyCertificates } from "../../api/certificate.services";

const MyCertificates = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["student-certificates"],
    queryFn: getMyCertificates,
  });

  const certificates = data?.certificates || data?.data?.certificates || [];

  // LOADING STATE
  if (isLoading) {
    return (
      <div className="flex min-h-112.5 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={38} className="animate-spin text-indigo-600" />
          <p className="text-sm font-medium text-slate-500">
            Loading your certificates...
          </p>
        </div>
      </div>
    );
  }

  // ERROR STATE
  if (isError) {
    const errorMsg =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to load certificates.";

    return (
      <div className="flex min-h-112.5 items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-red-100 bg-red-50/70 p-8 text-center shadow-sm backdrop-blur-md">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-100 text-red-600 mb-4">
            <AlertCircle size={24} />
          </div>
          <h2 className="text-base font-bold text-red-800">
            Failed to Load Certificates
          </h2>
          <p className="mt-1 text-xs text-red-600 leading-relaxed">
            {errorMsg}
          </p>
        </div>
      </div>
    );
  }

  return (
    <motion.main
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-8 pb-12"
    >
      {/* HEADER BANNER */}
      <div className="relative overflow-hidden rounded-2xl bg-linear-to-r from-indigo-900 via-purple-900 to-blue-900 p-6 md:p-8 text-white shadow-xl">
        <div className="absolute right-0 top-0 -mt-10 -mr-10 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-3 py-1 text-xs font-semibold text-indigo-200 border border-white/15 mb-3">
              <Sparkles size={13} className="text-amber-300" /> Professional
              Credentials
            </div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight">
              My Certificates
            </h1>
            <p className="mt-1.5 text-sm text-indigo-100 max-w-xl">
              View, verify, and download official credentials and certificates
              earned for your completed courses.
            </p>
          </div>
        </div>
      </div>

      {/* EMPTY STATE */}
      {certificates.length === 0 ? (
        <div className="flex min-h-87.5 items-center justify-center px-4 rounded-2xl border border-slate-100 bg-white p-10 text-center shadow-xs">
          <div className="max-w-md text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 shadow-xs mb-4">
              <Award size={30} />
            </div>
            <h2 className="text-xl font-black text-slate-800 tracking-tight">
              No Certificates Yet
            </h2>
            <p className="mt-1.5 text-xs text-slate-400 max-w-xs mx-auto leading-relaxed">
              Successfully complete your enrolled courses to earn verified
              certificates.
            </p>
          </div>
        </div>
      ) : (
        /* CERTIFICATE GRID */
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {certificates.map((certificate, idx) => {
            const isIssued = certificate.status === "Issued";

            return (
              <motion.article
                key={certificate._id || certificate.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-6 shadow-xs transition-all hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl hover:shadow-indigo-500/5"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 mb-1">
                        <Award size={14} />{" "}
                        {certificate.course?.title || "Completed Course"}
                      </span>
                      <h2 className="line-clamp-1 text-sm font-bold text-slate-800 tracking-tight group-hover:text-indigo-600 transition font-mono">
                        {certificate.certificateNumber || "CERT-ID"}
                      </h2>
                    </div>
                    <StatusBadge status={certificate.status} />
                  </div>

                  <div className="mt-5 space-y-2.5 rounded-xl bg-slate-50/70 p-3.5 border border-slate-100 text-xs text-slate-600">
                    <p className="flex items-center gap-2">
                      <CalendarDays size={15} className="text-slate-400" />
                      <span>
                        Issued:{" "}
                        {certificate.issueDate
                          ? new Date(certificate.issueDate).toLocaleDateString()
                          : "N/A"}
                      </span>
                    </p>
                    {certificate.grade !== null &&
                      certificate.grade !== undefined && (
                        <p className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                          <span className="text-slate-500">Final Grade:</span>
                          <span className="font-bold text-slate-800">
                            {certificate.grade}/100
                          </span>
                        </p>
                      )}
                  </div>
                </div>

                <div className="mt-6 flex gap-3 pt-4 border-t border-slate-100">
                  <Link
                    to={`/student/certificates/${certificate._id || certificate.id}`}
                    className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-center text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 transition flex items-center justify-center gap-1.5"
                  >
                    View Details
                  </Link>
                  {certificate.certificateUrl && (
                    <a
                      href={certificate.certificateUrl}
                      target="_blank"
                      rel="noreferrer"
                      title="Download Certificate"
                      className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-4 py-2.5 text-white hover:bg-indigo-700 transition shadow-xs shadow-indigo-500/20"
                    >
                      <Download size={16} />
                    </a>
                  )}
                </div>
              </motion.article>
            );
          })}
        </div>
      )}
    </motion.main>
  );
};

// STATUS BADGE COMPONENT
const StatusBadge = ({ status }) => {
  const isIssued = status === "Issued";

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold shrink-0 border ${
        isIssued
          ? "bg-emerald-50 text-emerald-700 border-emerald-200/60"
          : "bg-rose-50 text-rose-700 border-rose-200/60"
      }`}
    >
      {isIssued && <CheckCircle2 size={11} />} {status || "Unknown"}
    </span>
  );
};

export default MyCertificates;
