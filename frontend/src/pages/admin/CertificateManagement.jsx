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
import { Award, CheckCircle2, XCircle, Sparkles } from "lucide-react";

const getId = (value) => (typeof value === "object" ? value?._id : value);

const readArray = (data, keys) => {
  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key];
    if (Array.isArray(data?.data?.[key])) return data.data[key];
  }
  return [];
};

const CertificateManagement = () => {
  const { data: usersData } = useQuery({
    queryKey: ["certificate-student-options"],
    queryFn: getUsers,
  });

  const { data: coursesData } = useQuery({
    queryKey: ["certificate-course-options"],
    queryFn: () => getAdminCourses({ limit: 100 }),
  });

  const students = useMemo(
    () => readArray(usersData, ["users"]).filter((user) => user.role === "student"),
    [usersData],
  );

  const courses = useMemo(
    () => readArray(coursesData, ["courses"]),
    [coursesData],
  );

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
    [courses, students],
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 pb-12"
    >
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
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-tr from-purple-500 to-indigo-600 text-white shadow-md shadow-indigo-500/20">
                  <Award size={18} />
                </div>
                <div>
                  <span className="font-bold text-gray-900 font-mono text-xs block">
                    {row.certificateNumber || "N/A"}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-purple-600 bg-purple-50 px-1.5 py-0.5 rounded-md mt-0.5 border border-purple-100">
                    <Sparkles size={10} /> Verified Record
                  </span>
                </div>
              </div>
            ),
          },
          {
            label: "Student",
            render: (row) => (
              <div>
                <p className="font-bold text-gray-900">
                  {row.student?.fullName || "Unknown Student"}
                </p>
                <p className="text-xs text-gray-400">
                  {row.student?.email || ""}
                </p>
              </div>
            ),
          },
          {
            label: "Course",
            render: (row) => (
              <span className="font-semibold text-gray-700 max-w-50 truncate block">
                {row.course?.title || "Unknown Course"}
              </span>
            ),
          },
          {
            label: "Status",
            render: (row) => {
              const isIssued = row.status === "Issued";
              return (
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold shadow-xs ${
                    isIssued
                      ? "bg-linear-to-r from-emerald-500/10 to-teal-500/10 text-emerald-700 border border-emerald-200/60"
                      : "bg-linear-to-r from-rose-500/10 to-red-500/10 text-rose-700 border border-rose-200/60"
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
              <span className="inline-block px-2.5 py-1 rounded-lg bg-gray-50 text-gray-600 font-medium text-xs border border-gray-100">
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