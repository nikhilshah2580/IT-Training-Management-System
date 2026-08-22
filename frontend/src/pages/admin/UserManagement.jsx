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
  ChevronLeft,
  ChevronRight,
  LayoutGrid,
  List,
  Users,
  GraduationCap,
  UserCheck,
  ShieldAlert,
  UserPlus,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-toastify";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { getErrorMessage } from "../../utils/toast";
import { createUserByAdmin, getUsers, deleteUser } from "../../api/user.services";

const UserManagement = () => {
  const queryClient = useQueryClient();

  // Filters & UI State
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [activeTab, setActiveTab] = useState("all");
  const [viewMode, setViewMode] = useState("list"); // 'list' | 'grid'
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [createForm, setCreateForm] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "student",
    phone: "",
    address: "",
  });

  const limit = 10;

  // FETCH USERS
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["admin-users"],
    queryFn: getUsers,
  });

  // DELETE MUTATION
  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: (resData) => {
      toast.success(resData?.message || "User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, "Failed to delete user"));
    },
  });

  const createMutation = useMutation({
    mutationFn: createUserByAdmin,
    onSuccess: (response) => {
      toast.success(response?.message || "User created successfully");
      setCreateForm({
        fullName: "",
        email: "",
        password: "",
        role: "student",
        phone: "",
        address: "",
      });
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (err) => {
      toast.error(getErrorMessage(err, "Failed to create user"));
    },
  });

  const users = data?.users || data?.data || [];

  // STATS CALCULATIONS
  const stats = useMemo(() => {
    return {
      total: users.length,
      students: users.filter((u) => u.role === "student").length,
      instructors: users.filter((u) => u.role === "instructor").length,
      admins: users.filter((u) => u.role === "admin").length,
      verified: users.filter((u) => u.isVerified).length,
    };
  }, [users]);

  // FILTERING
  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const searchText = search.toLowerCase().trim();
      const matchesSearch =
        !searchText ||
        user.fullName?.toLowerCase().includes(searchText) ||
        user.email?.toLowerCase().includes(searchText);

      const activeRole = roleFilter !== "all" ? roleFilter : activeTab;
      const matchesRole = activeRole === "all" || user.role === activeRole;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter, activeTab]);

  // PAGINATION
  const totalPages = Math.ceil(filteredUsers.length / limit) || 1;
  const paginatedUsers = useMemo(() => {
    const start = (page - 1) * limit;
    return filteredUsers.slice(start, start + limit);
  }, [filteredUsers, page, limit]);

  // HANDLERS
  const handleTabChange = (role) => {
    setActiveTab(role);
    setRoleFilter(role);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch("");
    setRoleFilter("all");
    setActiveTab("all");
    setPage(1);
  };

  const handleCreateSubmit = (event) => {
    event.preventDefault();
    createMutation.mutate(createForm);
  };

  const handleDelete = (user) => {
    if (user.role === "admin") {
      toast.error("Admin users cannot be deleted from this page.");
      return;
    }
    setDeleteTarget(user);
  };

  if (isLoading) {
    return (
      <div className="flex min-h-96 items-center justify-center rounded-2xl bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-600 border-t-transparent" />
          <p className="text-xs font-semibold text-slate-500">
            Loading user profiles...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-2xl border border-rose-100 bg-white p-8 text-center shadow-xs">
        <AlertCircle className="mx-auto mb-2 text-rose-500" size={32} />
        <p className="text-sm font-bold text-slate-900">Failed to load users</p>
        <p className="mt-1 text-xs text-slate-400">
          {getErrorMessage(error, "Please check your network connection.")}
        </p>
        <button
          onClick={() => refetch()}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-xs font-bold text-white shadow-xs transition hover:bg-indigo-700"
        >
          <RefreshCw size={14} /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 font-sans text-slate-800">
      {/* 1. HEADER & ACTIONS */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            User Directory
          </h1>
          <p className="mt-1 text-xs text-slate-500">
            Monitor accounts, verify roles, and manage permissions across your
            platform.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center gap-2 self-start rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-xs hover:bg-slate-50 disabled:opacity-50"
        >
          <RefreshCw size={14} className={isFetching ? "animate-spin" : ""} />
          Refresh Directory
        </button>
      </div>

      {/* 2. OVERVIEW STAT CARDS */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        <div className="rounded-xl bg-indigo-600 p-4 text-white shadow-xs">
          <p className="text-xs font-semibold opacity-90">Total Accounts</p>
          <p className="mt-1 text-2xl font-black">{stats.total}</p>
        </div>
        <div className="rounded-xl bg-emerald-500 p-4 text-white shadow-xs">
          <p className="text-xs font-semibold opacity-90">Students</p>
          <p className="mt-1 text-2xl font-black">{stats.students}</p>
        </div>
        <div className="rounded-xl bg-amber-500 p-4 text-white shadow-xs">
          <p className="text-xs font-semibold opacity-90">Instructors</p>
          <p className="mt-1 text-2xl font-black">{stats.instructors}</p>
        </div>
        <div className="rounded-xl bg-purple-600 p-4 text-white shadow-xs">
          <p className="text-xs font-semibold opacity-90">Administrators</p>
          <p className="mt-1 text-2xl font-black">{stats.admins}</p>
        </div>
        <div className="col-span-2 rounded-xl bg-sky-500 p-4 text-white shadow-xs sm:col-span-1">
          <p className="text-xs font-semibold opacity-90">Verified Users</p>
          <p className="mt-1 text-2xl font-black">{stats.verified}</p>
        </div>
      </div>

      <form
        onSubmit={handleCreateSubmit}
        className="rounded-2xl border border-indigo-200 bg-linear-to-br from-indigo-50 via-white to-cyan-50 p-5 shadow-xs"
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-xs">
            <UserPlus size={19} />
          </div>
          <div>
            <h2 className="font-bold text-indigo-950">Create User Account</h2>
            <p className="text-xs text-slate-500">
              Add a new administrator or student account.
            </p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          <input
            required
            value={createForm.fullName}
            onChange={(event) =>
              setCreateForm({ ...createForm, fullName: event.target.value })
            }
            placeholder="Full name"
            className="rounded-xl border border-indigo-100 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
          />
          <input
            required
            type="email"
            value={createForm.email}
            onChange={(event) =>
              setCreateForm({ ...createForm, email: event.target.value })
            }
            placeholder="Email address"
            className="rounded-xl border border-indigo-100 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
          />
          <input
            required
            minLength={6}
            type="password"
            value={createForm.password}
            onChange={(event) =>
              setCreateForm({ ...createForm, password: event.target.value })
            }
            placeholder="Temporary password"
            className="rounded-xl border border-indigo-100 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
          />
          <select
            value={createForm.role}
            onChange={(event) =>
              setCreateForm({ ...createForm, role: event.target.value })
            }
            className="rounded-xl border border-indigo-100 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
          >
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
            <option value="admin">Admin</option>
          </select>
          <input
            value={createForm.phone}
            onChange={(event) =>
              setCreateForm({ ...createForm, phone: event.target.value })
            }
            placeholder="Phone (optional)"
            className="rounded-xl border border-indigo-100 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
          />
          <input
            value={createForm.address}
            onChange={(event) =>
              setCreateForm({ ...createForm, address: event.target.value })
            }
            placeholder="Address (optional)"
            className="rounded-xl border border-indigo-100 bg-white px-3 py-2.5 text-sm outline-none focus:border-indigo-500"
          />
        </div>
        <button
          type="submit"
          disabled={createMutation.isPending}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <UserPlus size={15} />
          {createMutation.isPending ? "Creating..." : "Create Account"}
        </button>
      </form>

      {/* 3. SEARCH & FILTERS TOOLBAR */}
      <div className="space-y-3 rounded-2xl border border-slate-100 bg-white p-4 shadow-xs">
        <div className="grid gap-3 sm:grid-cols-[1fr_220px]">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search users by name or email address..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50/50 py-2 pl-9 pr-3 text-xs outline-none focus:border-indigo-500 focus:bg-white"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => handleTabChange(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 text-xs font-medium text-slate-700 outline-none focus:border-indigo-500"
          >
            <option value="all">All Access Roles</option>
            <option value="student">Students</option>
            <option value="instructor">Instructors</option>
            <option value="admin">Administrators</option>
          </select>
        </div>

        {(search || roleFilter !== "all" || activeTab !== "all") && (
          <button
            onClick={handleResetFilters}
            className="text-xs font-bold text-rose-500 hover:underline"
          >
            Clear All Filters
          </button>
        )}
      </div>

      {/* 4. TAB PILLS & VIEW TOGGLE */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">User Accounts</h3>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setViewMode("list")}
              className={`rounded-lg p-2 transition ${
                viewMode === "list"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
              title="List View"
            >
              <List size={16} />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded-lg p-2 transition ${
                viewMode === "grid"
                  ? "bg-indigo-600 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
              title="Grid View"
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        </div>

        {/* Dynamic Role Tab Pills */}
        <div className="flex flex-wrap items-center gap-2 border-b border-slate-100 pb-3">
          {[
            { id: "all", label: "All Users" },
            { id: "student", label: "Students" },
            { id: "instructor", label: "Instructors" },
            { id: "admin", label: "Admins" },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-xs"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* 5. USER DISPLAY */}
      {filteredUsers.length === 0 ? (
        <div className="rounded-2xl bg-slate-50 py-16 text-center text-slate-400">
          <UserRound size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm font-semibold text-slate-600">
            No users match your criteria.
          </p>
          <p className="mt-1 text-xs text-slate-400">
            Try tweaking your search query or role filter settings.
          </p>
        </div>
      ) : viewMode === "list" ? (
        /* TABLE VIEW */
        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full min-w-190 border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/75 font-bold uppercase tracking-wider text-slate-400">
                  <th className="px-6 py-4">User Details</th>
                  <th className="px-6 py-4">Email Address</th>
                  <th className="px-6 py-4">Phone</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Verification</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <AnimatePresence>
                  {paginatedUsers.map((user, idx) => (
                    <motion.tr
                      key={user._id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2, delay: idx * 0.02 }}
                      className="group transition-colors hover:bg-slate-50/80"
                    >
                      {/* USER DETAILS */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3.5">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-indigo-100 bg-indigo-50 font-bold text-indigo-600 shadow-xs">
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
                            <p className="font-bold text-slate-900 transition-colors group-hover:text-indigo-600">
                              {user.fullName}
                            </p>
                            <p className="font-mono text-[11px] text-slate-400">
                              ID: {user._id.slice(-6)}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* EMAIL */}
                      <td className="px-6 py-4 font-medium text-slate-600">
                        {user.email}
                      </td>

                      {/* PHONE */}
                      <td className="px-6 py-4 font-mono text-slate-500">
                        {user.phone || "—"}
                      </td>

                      {/* ROLE */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold capitalize ${
                            user.role === "admin"
                              ? "border border-purple-100 bg-purple-50 text-purple-700"
                              : user.role === "instructor"
                                ? "border border-amber-100 bg-amber-50 text-amber-700"
                                : "border border-indigo-100 bg-indigo-50 text-indigo-700"
                          }`}
                        >
                          {user.role === "admin" && <Shield size={12} />}
                          {user.role}
                        </span>
                      </td>

                      {/* VERIFICATION STATUS */}
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold ${
                            user.isVerified
                              ? "border border-emerald-100 bg-emerald-50 text-emerald-700"
                              : "border border-amber-100 bg-amber-50 text-amber-700"
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

                      {/* ACTIONS */}
                      <td className="px-6 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => handleDelete(user)}
                          disabled={
                            deleteMutation.isPending || user.role === "admin"
                          }
                          className="rounded-xl p-2.5 text-slate-400 transition-colors hover:bg-rose-50 hover:text-rose-600 disabled:cursor-not-allowed disabled:opacity-30"
                          title={
                            user.role === "admin"
                              ? "Admins cannot be deleted"
                              : "Delete user"
                          }
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* GRID VIEW */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {paginatedUsers.map((user, idx) => (
              <motion.div
                key={user._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2, delay: idx * 0.03 }}
                className="group flex flex-col justify-between rounded-2xl border border-slate-100 bg-white p-5 shadow-xs transition hover:shadow-md"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-indigo-100 bg-indigo-50 font-bold text-indigo-600 shadow-xs">
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
                        <h4 className="font-bold text-slate-900 transition-colors group-hover:text-indigo-600">
                          {user.fullName}
                        </h4>
                        <p className="text-[11px] text-slate-400">
                          {user.email}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between rounded-xl bg-slate-50/70 p-3 text-xs">
                    <div>
                      <p className="text-[10px] font-bold uppercase text-slate-400">
                        Phone
                      </p>
                      <p className="font-mono text-slate-700">
                        {user.phone || "—"}
                      </p>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold capitalize ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : user.role === "instructor"
                            ? "bg-amber-100 text-amber-700"
                            : "bg-indigo-100 text-indigo-700"
                      }`}
                    >
                      {user.role}
                    </span>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3 text-xs font-semibold">
                  <span
                    className={`inline-flex items-center gap-1 text-[11px] ${
                      user.isVerified ? "text-emerald-600" : "text-amber-600"
                    }`}
                  >
                    {user.isVerified ? (
                      <CheckCircle2 size={13} />
                    ) : (
                      <AlertCircle size={13} />
                    )}
                    {user.isVerified ? "Verified Account" : "Pending Action"}
                  </span>
                  <button
                    onClick={() => handleDelete(user)}
                    disabled={
                      deleteMutation.isPending || user.role === "admin"
                    }
                    className="flex items-center gap-1 text-slate-400 transition-colors hover:text-rose-500 disabled:opacity-30"
                  >
                    <Trash2 size={14} /> Remove
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* 6. PAGINATION */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between pt-4">
          <p className="text-xs text-slate-400">
            Page <strong className="text-slate-700">{page}</strong> of{" "}
            <strong className="text-slate-700">{totalPages}</strong> (
            {filteredUsers.length} accounts)
          </p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`h-8 w-8 rounded-full text-xs font-bold transition ${
                  page === p
                    ? "bg-indigo-600 text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* CONFIRMATION DIALOG */}
      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Permanently Delete User"
        message={
          deleteTarget
            ? `Are you sure you want to remove ${deleteTarget.fullName}? This will delete all associated profile data and cannot be undone.`
            : ""
        }
        confirmLabel="Yes, Delete User"
        tone="destructive"
        loading={deleteMutation.isPending}
        onConfirm={() =>
          deleteMutation.mutate(deleteTarget._id, {
            onSuccess: () => setDeleteTarget(null),
          })
        }
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default UserManagement;