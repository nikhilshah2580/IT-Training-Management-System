import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Trash2, UserRound, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { getErrorMessage } from "../../utils/toast";

import { getUsers, deleteUser } from "../../api/user.services";

const UserManagement = () => {
    const queryClient = useQueryClient();

    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("all");
    const [deleteTarget, setDeleteTarget] = useState(null);

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["admin-users"],
        queryFn: getUsers,
    });

    const deleteMutation = useMutation({
        mutationFn: deleteUser,

        onSuccess: (data) => {
            toast.success(data?.message || "User deleted successfully");

            queryClient.invalidateQueries({
                queryKey: ["admin-users"],
            });
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
            <div className="flex min-h-64 items-center justify-center">
                <div className="text-gray-500">Loading users...</div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="rounded-xl border bg-white p-8 text-center">
                <p className="text-red-500">Failed to load users.</p>

                <button
                    onClick={() => refetch()}
                    className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white"
                >
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">User Management</h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage students, instructors and administrators.
                    </p>
                </div>

                <button
                    onClick={() => refetch()}
                    className="flex items-center justify-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-medium hover:bg-gray-50"
                >
                    <RefreshCw size={17} />
                    Refresh
                </button>
            </div>

            {/* Filters */}
            <div className="rounded-xl border bg-white p-4 shadow-sm">
                <div className="grid gap-3 md:grid-cols-[1fr_200px]">
                    {/* Search */}
                    <div className="relative">
                        <Search
                            size={19}
                            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search by name or email..."
                            className="w-full rounded-lg border py-2.5 pl-10 pr-4 outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Role */}
                    <select
                        value={roleFilter}
                        onChange={(event) => setRoleFilter(event.target.value)}
                        className="rounded-lg border px-3 py-2.5 outline-none focus:border-blue-500"
                    >
                        <option value="all">All Roles</option>

                        <option value="student">Students</option>

                        <option value="instructor">Instructors</option>

                        <option value="admin">Admins</option>
                    </select>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-200">
                        <thead className="border-b bg-gray-50">
                            <tr>
                                <th className="px-5 py-4 text-left text-sm font-semibold">
                                    User
                                </th>

                                <th className="px-5 py-4 text-left text-sm font-semibold">
                                    Email
                                </th>

                                <th className="px-5 py-4 text-left text-sm font-semibold">
                                    Phone
                                </th>

                                <th className="px-5 py-4 text-left text-sm font-semibold">
                                    Role
                                </th>

                                <th className="px-5 py-4 text-left text-sm font-semibold">
                                    Verified
                                </th>

                                <th className="px-5 py-4 text-right text-sm font-semibold">
                                    Action
                                </th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {filteredUsers.length === 0 ? (
                                <tr>
                                    <td
                                        colSpan="6"
                                        className="px-5 py-12 text-center text-gray-500"
                                    >
                                        No users found.
                                    </td>
                                </tr>
                            ) : (
                                filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50">
                                        {/* User */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-blue-100 text-blue-600">
                                                    {user.photo ? (
                                                        <img
                                                            src={user.photo}
                                                            alt={user.fullName}
                                                            className="h-full w-full object-cover"
                                                        />
                                                    ) : (
                                                        <UserRound size={20} />
                                                    )}
                                                </div>

                                                <div>
                                                    <p className="font-medium text-gray-900">
                                                        {user.fullName}
                                                    </p>

                                                    <p className="text-xs text-gray-500">
                                                        ID: {user._id}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Email */}
                                        <td className="px-5 py-4 text-sm text-gray-600">
                                            {user.email}
                                        </td>

                                        {/* Phone */}
                                        <td className="px-5 py-4 text-sm text-gray-600">
                                            {user.phone || "—"}
                                        </td>

                                        {/* Role */}
                                        <td className="px-5 py-4">
                                            <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold capitalize text-blue-700">
                                                {user.role}
                                            </span>
                                        </td>

                                        {/* Verified */}
                                        <td className="px-5 py-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${user.isVerified
                                                        ? "bg-green-50 text-green-700"
                                                        : "bg-yellow-50 text-yellow-700"
                                                    }`}
                                            >
                                                {user.isVerified ? "Verified" : "Not Verified"}
                                            </span>
                                        </td>

                                        {/* Action */}
                                        <td className="px-5 py-4 text-right">
                                            <button
                                                onClick={() => handleDelete(user)}
                                                disabled={
                                                    deleteMutation.isPending || user.role === "admin"
                                                }
                                                className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-40"
                                                title={
                                                    user.role === "admin"
                                                        ? "Admin cannot be deleted"
                                                        : "Delete user"
                                                }
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Footer */}
                <div className="border-t px-5 py-4 text-sm text-gray-500">
                    Showing{" "}
                    <span className="font-semibold text-gray-900">
                        {filteredUsers.length}
                    </span>{" "}
                    of <span className="font-semibold text-gray-900">{users.length}</span>{" "}
                    users
                </div>
            </div>
            <ConfirmDialog open={Boolean(deleteTarget)} title="Delete user" message={deleteTarget ? `Delete ${deleteTarget.fullName}? This action cannot be undone.` : ""} confirmLabel="Delete" loading={deleteMutation.isPending} onConfirm={() => deleteMutation.mutate(deleteTarget._id, { onSuccess: () => setDeleteTarget(null) })} onCancel={() => setDeleteTarget(null)} />
        </div>
    );
};

export default UserManagement;

