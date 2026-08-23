import { motion } from "framer-motion";
import AdminModulePage from "./AdminModulePage";
import {
  getDemoClasses,
  updateDemoClassStatus,
  deleteDemoClass,
} from "../../api/demoClass.services";
import {
  Calendar,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Monitor,
  MapPin,
  User,
} from "lucide-react";

const DemoClassManagement = () => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="space-y-6 pb-12"
  >
    <AdminModulePage
      title="Demo Class Management"
      description="Review student demo class requests, coordinate schedules, and manage session statuses."
      queryKey="admin-demo-classes"
      listFn={() => getDemoClasses({ limit: 100 })}
      listKeys={["demoClasses"]}
      showForm={false}
      allowEdit={false}
      deleteFn={deleteDemoClass}
      statusFn={updateDemoClassStatus}
      statusOptions={[
        { value: "Scheduled", label: "Scheduled" },
        {
          value: "Completed",
          label: "Completed",
          className:
            "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60 font-semibold",
        },
        {
          value: "Cancelled",
          label: "Cancel",
          className:
            "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/60 font-semibold",
        },
      ]}
      columns={[
        {
          label: "Student",
          render: (row) => (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-tr from-sky-500 to-indigo-600 text-white shadow-md shadow-indigo-500/20">
                <User size={18} />
              </div>
              <div>
                <p className="font-bold text-gray-900">
                  {row.student?.fullName || row.name || "Unknown Student"}
                </p>
                <p className="text-xs text-gray-400">
                  {row.student?.email || row.email || "No email provided"}
                </p>
              </div>
            </div>
          ),
        },
        {
          label: "Course",
          render: (row) => (
            <span className="font-semibold text-gray-800 max-w-50 truncate block">
              {row.course?.title || "General Session"}
            </span>
          ),
        },
        {
          label: "Schedule",
          render: (row, formatDate) => (
            <div className="flex items-center gap-2 text-xs font-medium text-gray-600">
              <div className="flex items-center gap-1 bg-gray-50 px-2.5 py-1 rounded-lg border border-gray-100">
                <Calendar size={13} className="text-indigo-500" />
                <span>{formatDate(row.scheduledAt || row.date)}</span>
              </div>
            </div>
          ),
        },
        {
          label: "Mode",
          render: (row) => {
            const isOnline = (row.mode || "").toLowerCase() === "online";
            return (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-gray-50 text-xs font-semibold text-gray-700 border border-gray-100">
                {isOnline ? (
                  <Monitor size={13} className="text-indigo-600" />
                ) : (
                  <MapPin size={13} className="text-amber-600" />
                )}
                {row.mode || "Online"}
              </span>
            );
          },
        },
        {
          label: "Status",
          render: (row) => {
            const status = row.status || "Scheduled";
            const isCompleted = status === "Completed";
            const isCancelled = status === "Cancelled";

            return (
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold shadow-xs ${
                  isCompleted
                    ? "bg-linear-to-r from-emerald-500/10 to-teal-500/10 text-emerald-700 border border-emerald-200/60"
                    : isCancelled
                      ? "bg-linear-to-r from-rose-500/10 to-red-500/10 text-rose-700 border border-rose-200/60"
                      : "bg-linear-to-r from-amber-500/10 to-orange-500/10 text-amber-700 border border-amber-200/60"
                }`}
              >
                {isCompleted && (
                  <CheckCircle2 size={12} className="text-emerald-600" />
                )}
                {isCancelled && <XCircle size={12} className="text-rose-600" />}
                {!isCompleted && !isCancelled && (
                  <AlertCircle size={12} className="text-amber-600" />
                )}
                {status}
              </span>
            );
          },
        },
      ]}
    />
  </motion.div>
);

export default DemoClassManagement;
