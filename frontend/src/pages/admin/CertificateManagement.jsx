import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import AdminModulePage from "./AdminModulePage";
import {
  createCertificate,
  getCertificates,
  updateCertificate,
} from "../../api/certificate.services";
import { getAdminCourses } from "../../api/course.services";
import { getUsers } from "../../api/user.services";
import {
  Award,
  CheckCircle2,
  XCircle,
  Sparkles,
  FileBadge2,
  GraduationCap,
  Ban,
} from "lucide-react";

const getId = (value) => (typeof value === "object" ? value?._id : value);

const readArray = (data, keys) => {
  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key];
    if (Array.isArray(data?.data?.[key])) return data.data[key];
  }
  return [];
};

const CertificateManagement = () => {
  // FETCH STUDENTS FOR SELECT OPTIONS
  const { data: usersData } = useQuery({
    queryKey: ["certificate-student-options"],
    queryFn: getUsers,
  });

  // FETCH COURSES FOR SELECT OPTIONS
  const { data: coursesData } = useQuery({
    queryKey: ["certificate-course-options"],
    queryFn: () => getAdminCourses({ limit: 100 }),
  });

  // FETCH CERTIFICATES FOR STATS SUMMARY
  const { data: certificatesData } = useQuery({
    queryKey: ["admin-certificates-stats"],
    queryFn: () => getCertificates({ limit: 500 }),
  });

  const students = useMemo(
    () =>
      readArray(usersData, ["users"]).filter(
        (user) => user.role === "student"
      ),
    [usersData]
  );

  const courses = useMemo(
    () => readArray(coursesData, ["courses"]),
    [coursesData]
  );

  const rawCertificates = useMemo(
    () => readArray(certificatesData, ["certificates"]),
    [certificatesData]
  );

  // OVERVIEW STATS
  const stats = useMemo(() => {
    const total = rawCertificates.length;
    const issued = rawCertificates.filter(
      (c) => (c.status || "Issued") === "Issued"
    ).length;
    const revoked = rawCertificates.filter(
      (c) => c.status === "Revoked"
    ).length;

    return { total, issued, revoked };
  }, [rawCertificates]);

  // FORM FIELDS CONFIGURATION
  const fields = useMemo(
    () => [
      {
        name: "student",
        label: "Select Student",
        type: "select",
        required: true,
        read: (row) => getId(row.student),
        options: students.map((student) => ({
          value: student._id,
          label: `${student.fullName || "Unnamed Student"}${
            student.email ? ` - ${student.email}` : ""
          }`,
        })),
      },
      {
        name: "course",
        label: "Select Course",
        type: "select",
        required: true,
        read: (row) => getId(row.course),
        options: courses.map((course) => ({
          value: course._id,
          label: course.title || "Untitled Course",
        })),
      },
      { name: "completionDate", label: "Completion Date", type: "date" },
      { name: "grade", label: "Grade (0-100)", type: "number" },
      { name: "certificateUrl", label: "Certificate URL / PDF Link" },
      {
        name: "status",
        label: "Status",
        type: "select",
        defaultValue: "Issued",
        options: ["Issued", "Revoked"].map((value) => ({
          value,
          label: value,
        })),
      },
    ],
    [courses, students]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 pb-12 font-sans text-slate-800"
    >
      {/* 1. OVERVIEW STAT CARDS */}
      <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
        <div className="flex items-center justify-between rounded-2xl bg-indigo-600 p-4 text-white shadow-xs">
          <div>
            <p className="text-xs font-semibold text-indigo-100">
              Total Certificates
            </p>
            <p className="mt-1 text-2xl font-black">{stats.total}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-xs">
            <FileBadge2 size={20} />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-emerald-500 p-4 text-white shadow-xs">
          <div>
            <p className="text-xs font-semibold text-emerald-100">
              Active / Issued
            </p>
            <p className="mt-1 text-2xl font-black">{stats.issued}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-xs">
            <Award size={20} />
          </div>
        </div>

        <div className="flex items-center justify-between rounded-2xl bg-rose-500 p-4 text-white shadow-xs">
          <div>
            <p className="text-xs font-semibold text-rose-100">
              Revoked Records
            </p>
            <p className="mt-1 text-2xl font-black">{stats.revoked}</p>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-white backdrop-blur-xs">
            <Ban size={20} />
          </div>
        </div>
      </div>

      {/* 2. MAIN MODULE DATA WRAPPER */}
      <AdminModulePage
        title="Certificate Management"
        description="Issue, track, and manage official academic completion certificates for students."
        queryKey="admin-certificates"
        listFn={() => getCertificates({ limit: 100 })}
        listKeys={["certificates"]}
        createFn={createCertificate}
        updateFn={updateCertificate}
        deleteFn={null}
        allowDelete={false}
        createLabel="Issue Certificate"
        fields={fields}
        columns={[
          {
            label: "Certificate ID",
            render: (row) => (
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-tr from-purple-600 to-indigo-600 text-white shadow-xs">
                  <Award size={18} />
                </div>
                <div>
                  <span className="block font-mono text-xs font-bold text-slate-900">
                    {row.certificateNumber || "N/A"}
                  </span>
                  <span className="mt-0.5 inline-flex items-center gap-1 rounded-md border border-purple-100 bg-purple-50 px-1.5 py-0.5 text-[10px] font-semibold text-purple-700">
                    <Sparkles size={10} /> Verified Record
                  </span>
                </div>
              </div>
            ),
          },
          {
            label: "Student",
            render: (row) => (
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-slate-100 text-slate-500">
                  <GraduationCap size={15} />
                </div>
                <div>
                  <p className="font-bold text-slate-900">
                    {row.student?.fullName || "Unknown Student"}
                  </p>
                  <p className="text-xs text-slate-400">
                    {row.student?.email || "—"}
                  </p>
                </div>
              </div>
            ),
          },
          {
            label: "Course",
            render: (row) => (
              <span className="block max-w-52 truncate font-semibold text-slate-700">
                {row.course?.title || "Unknown Course"}
              </span>
            ),
          },
          {
            label: "Status",
            render: (row) => {
              const isIssued = (row.status || "Issued") === "Issued";
              return (
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold shadow-xs ${
                    isIssued
                      ? "border border-emerald-200/80 bg-emerald-50 text-emerald-700"
                      : "border border-rose-200/80 bg-rose-50 text-rose-700"
                  }`}
                >
                  {isIssued ? (
                    <CheckCircle2 size={12} className="text-emerald-600" />
                  ) : (
                    <XCircle size={12} className="text-rose-600" />
                  )}
                  {row.status || "Issued"}
                </span>
              );
            },
          },
          {
            label: "Issued Date",
            render: (row, formatDate) => (
              <span className="inline-block rounded-lg border border-slate-200/70 bg-slate-50 px-2.5 py-1 text-xs font-medium text-slate-600">
                {formatDate(row.issueDate || row.createdAt)}
              </span>
            ),
          },
        ]}
      />
    </motion.div>
  );
};

export default CertificateManagement;