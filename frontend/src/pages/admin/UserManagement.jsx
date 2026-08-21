import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Search,
  Trash2,
  UserRound,
  RefreshCw,
  Shield,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { getErrorMessage } from "../../utils/toast";

import { getUsers, deleteUser } from "../../api/user.services";

const UserManagement = () => {
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["admin-users"],
    queryFn: getUsers,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: (data) => {
      toast.success(data?.message || "User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Failed to delete user"));
    },
  });

  const users = data?.users || data?.data || [];

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchText = search.toLowerCase().trim();
      const matchesSearch =
        !searchText ||
        user.fullName?.toLowerCase().includes(searchText) ||
        user.email?.toLowerCase().includes(searchText);

      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const handleDelete = (user) => {
    if (user.role === "admin") {
      toast.error("Admin users cannot be deleted from this page.");
      return;
    }
    setDeleteTarget(user);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-96 items-center justify-center bg-gray-50 rounded-2xl">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p className="text-sm font-medium text-gray-500">
            Loading user profiles...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-red-100 bg-white p-8 text-center shadow-sm">
        <AlertCircle className="mx-auto h-12 w-12 text-red-500 mb-3" />
        <p className="font-bold text-gray-900 text-lg">Failed to load users</p>
        <p className="text-sm text-gray-500 mt-1">
          Please check your network connection and try again.
        </p>
        <button
          onClick={() => refetch()}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition"
        >
          <RefreshCw size={16} /> Try Again
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-6 pb-12"
    >
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center bg-white p-6 rounded-2xl border border-gray-100 shadow-xs">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-gray-900">
            User Directory
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Monitor accounts, verify roles, and manage permissions across your
            platform.
          </p>
        </div>

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-semibold text-gray-700 shadow-xs hover:bg-gray-50 disabled:opacity-50 transition"
        >
          <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />
          Refresh Directory
        </motion.button>
      </div>

      {/* Advanced Filter Toolbar */}
      <div className="rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-[1fr_220px]">
          {/* Search Bar */}
          <div className="relative">
            <Search
              size={18}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search users by name or email address..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-10 pr-4 text-sm outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>

          {/* Role Filter Selector */}
          <select
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
            className="rounded-xl border border-gray-200 bg-gray-50/50 px-3.5 py-2.5 text-sm font-medium text-gray-700 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
          >
            <option value="all">All Access Roles</option>
            <option value="student">Students</option>
            <option value="instructor">Instructors</option>
            <option value="admin">Administrators</option>
          </select>
        </div>
      </div>

      {/* Modern Styled Table Container */}
      <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-190 text-left border-collapse">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/75 text-xs font-bold uppercase tracking-wider text-gray-400">
                <th className="px-6 py-4">User Details</th>
                <th className="px-6 py-4">Email Address</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Role</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50 text-sm">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-16 text-center text-gray-400"
                  >
                    <UserRound
                      size={40}
                      className="mx-auto mb-3 opacity-30 text-gray-600"
                    />
                    <p className="font-semibold text-gray-600">
                      No users match your criteria.
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Try tweaking your search query or filter settings.
                    </p>
                  </td>
                </tr>
              ) : (
                <AnimatePresence>
                  {filteredUsers.map((user, idx) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2, delay: idx * 0.02 }}
                      className="group hover:bg-gray-50/80 transition-colors"
                    >
                      {/* User Info */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-indigo-50 text-indigo-600 font-bold border border-indigo-100 shadow-xs">
                            {user.photo ? (
                              <img
                                src={user.photo}
                                alt={user.fullName}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <span>
                                {user.fullName?.charAt(0)?.toUpperCase() || "U"}
                              </span>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                              {user.fullName}
                            </p>
                            <p className="text-xs text-gray-400 font-mono">
                              ID: {user._id.slice(-6)}...
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="px-6 py-4 text-gray-600 font-medium">
                        {user.email}
                      </td>

                      {/* Phone */}
                      <td className="px-6 py-4 text-gray-500 font-mono text-xs">
                        {user.phone || "—"}
                      </td>

                      {/* Role Badge */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold capitalize ${
                            user.role === "admin"
                              ? "bg-purple-50 text-purple-700 border border-purple-100"
                              : user.role === "instructor"
                                ? "bg-amber-50 text-amber-700 border border-amber-100"
                                : "bg-indigo-50 text-indigo-700 border border-indigo-100"
                          }`}
                        >
                          {user.role === "admin" && <Shield size={12} />}
                          {user.role}
                        </span>
                      </td>

                      {/* Verification Status */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-bold ${
                            user.isVerified
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
                              : "bg-amber-50 text-amber-700 border border-amber-100"
                          }`}
                        >
                          {user.isVerified ? (
                            <CheckCircle2 size={12} />
                          ) : (
                            <AlertCircle size={12} />
                          )}
                          {user.isVerified ? "Verified" : "Pending"}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 text-right">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(user)}
                          disabled={
                            deleteMutation.isPending || user.role === "admin"
                          }
                          className="rounded-xl p-2.5 text-gray-400 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-30 transition-colors"
                          title={
                            user.role === "admin"
                              ? "Admins cannot be deleted"
                              : "Delete user"
                          }
                        >
                          <Trash2 size={17} />
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info count */}
        <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-4 text-xs font-semibold text-gray-500 flex items-center justify-between">
          <span>
            Showing{" "}
            <strong className="text-gray-900">{filteredUsers.length}</strong> of{" "}
            <strong className="text-gray-900">{users.length}</strong> accounts
          </span>
          <span className="text-gray-400 font-normal">
            Real-time synchronized
          </span>
        </div>
      </div>

      {/* Confirmation Modal */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Permanently Delete User"
        message={
          deleteTarget
            ? `Are you sure you want to remove ${deleteTarget.fullName}? This will delete all user data and cannot be undone.`
            : ""
        }
        confirmLabel="Yes, Delete User"
        loading={deleteMutation.isPending}
        onConfirm={() =>
          deleteMutation.mutate(deleteTarget._id, {
            onSuccess: () => setDeleteTarget(null),
          })
        }
        onCancel={() => setDeleteTarget(null)}
      />
    </motion.div>
  );
};

export default UserManagement;
