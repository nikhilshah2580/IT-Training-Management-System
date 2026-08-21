import { motion } from "framer-motion";
import AdminModulePage from "./AdminModulePage";
import {
  getContacts,
  updateContactStatus,
  deleteContact,
} from "../../api/contact.services";
import {
  Mail,
  MessageSquare,
  CheckCircle2,
  XCircle,
  Clock,
  RefreshCw,
  User,
} from "lucide-react";

const ContactManagement = () => (
  <motion.div
    initial={{ opacity: 0, y: 15 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
    className="space-y-6 pb-12"
  >
    <AdminModulePage
      title="Contact Management"
      description="Review inquiries, manage customer messages, and track support ticket resolution progress."
      queryKey="admin-contacts"
      listFn={() => getContacts({ limit: 100 })}
      listKeys={["contacts"]}
      showForm={false}
      allowEdit={false}
      deleteFn={deleteContact}
      statusFn={updateContactStatus}
      statusOptions={[
        {
          value: "Pending",
          label: "Pending",
          className:
            "bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200/60 font-semibold",
        },
        {
          value: "In Progress",
          label: "In Progress",
          className:
            "bg-sky-50 text-sky-700 hover:bg-sky-100 border border-sky-200/60 font-semibold",
        },
        {
          value: "Resolved",
          label: "Resolved",
          className:
            "bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200/60 font-semibold",
        },
        {
          value: "Rejected",
          label: "Reject",
          className:
            "bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200/60 font-semibold",
        },
      ]}
      columns={[
        {
          label: "Sender",
          render: (row) => (
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-tr from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/20">
                <User size={18} />
              </div>
              <div>
                <p className="font-bold text-gray-900">
                  {row.name || row.fullName || "Unknown Sender"}
                </p>
                <p className="text-xs text-gray-400">
                  {row.email || "No email provided"}
                </p>
              </div>
            </div>
          ),
        },
        {
          label: "Subject",
          render: (row) => (
            <span className="font-semibold text-gray-800 max-w-45 truncate block">
              {row.subject || "General Inquiry"}
            </span>
          ),
        },
        {
          label: "Message Preview",
          render: (row) => (
            <div className="flex items-center gap-2 max-w-55">
              <MessageSquare size={14} className="text-gray-400 shrink-0" />
              <p className="text-xs text-gray-600 truncate">
                {row.message || "No content provided..."}
              </p>
            </div>
          ),
        },
        {
          label: "Status",
          render: (row) => {
            const status = row.status || "Pending";
            const isResolved = status === "Resolved";
            const isInProgress = status === "In Progress";
            const isRejected = status === "Rejected";

            return (
              <span
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold shadow-xs ${
                  isResolved
                    ? "bg-linear-to-r from-emerald-500/10 to-teal-500/10 text-emerald-700 border border-emerald-200/60"
                    : isInProgress
                      ? "bg-linear-to-r from-sky-500/10 to-blue-500/10 text-sky-700 border border-sky-200/60"
                      : isRejected
                        ? "bg-linear-to-r from-rose-500/10 to-red-500/10 text-rose-700 border border-rose-200/60"
                        : "bg-linear-to-r from-amber-500/10 to-orange-500/10 text-amber-700 border border-amber-200/60"
                }`}
              >
                {isResolved && (
                  <CheckCircle2 size={12} className="text-emerald-600" />
                )}
                {isInProgress && (
                  <RefreshCw size={12} className="text-sky-600 animate-spin" />
                )}
                {isRejected && <XCircle size={12} className="text-rose-600" />}
                {!isResolved && !isInProgress && !isRejected && (
                  <Clock size={12} className="text-amber-600" />
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

export default ContactManagement;
