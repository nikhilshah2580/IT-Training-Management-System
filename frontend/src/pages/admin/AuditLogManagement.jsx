import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, RefreshCw, Search, ShieldCheck } from "lucide-react";

import { getAuditLogs } from "../../api/auditLog.services";
import { getErrorMessage } from "../../utils/toast";

const formatDateTime = (value) => (value ? new Date(value).toLocaleString() : "-");

const AuditLogManagement = () => {
    const [search, setSearch] = useState("");
    const [targetType, setTargetType] = useState("");
    const [page, setPage] = useState(1);
    const limit = 10;

    const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
        queryKey: ["audit-logs", { search, targetType, page, limit }],
        queryFn: () => getAuditLogs({ search: search || undefined, targetType: targetType || undefined, page, limit }),
        keepPreviousData: true,
    });

    const logs = data?.logs || [];
    const totalPages = data?.pagination?.totalPages || 1;

    const handleSearch = (event) => {
        setSearch(event.target.value);
        setPage(1);
    };

    const handleTargetType = (event) => {
        setTargetType(event.target.value);
        setPage(1);
    };

    if (isLoading) {
        return <div className="flex min-h-100 items-center justify-center text-gray-500">Loading audit logs...</div>;
    }

    if (isError) {
        return (
            <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
                <h2 className="text-xl font-semibold text-red-600">Failed to load audit logs</h2>
                <p className="mt-2 text-gray-500">{getErrorMessage(error, "Something went wrong")}</p>
                <button type="button" onClick={() => refetch()} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"><RefreshCw size={17} />Try Again</button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
                    <p className="mt-1 text-sm text-gray-500">Review admin actions across users, courses, and other records.</p>
                </div>
                <button type="button" onClick={() => refetch()} disabled={isFetching} className="inline-flex items-center justify-center gap-2 rounded-lg border bg-white px-4 py-2.5 font-medium hover:bg-gray-50 disabled:opacity-50"><RefreshCw size={17} className={isFetching ? "animate-spin" : ""} />Refresh</button>
            </div>

            <div className="rounded-xl border bg-white p-5 shadow-sm">
                <div className="grid gap-4 md:grid-cols-[1fr_220px]">
                    <div className="relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" value={search} onChange={handleSearch} placeholder="Search action or target..." className="w-full rounded-lg border py-2.5 pl-10 pr-4 outline-none focus:border-blue-500" />
                    </div>
                    <select value={targetType} onChange={handleTargetType} className="rounded-lg border px-3 py-2.5 outline-none focus:border-blue-500">
                        <option value="">All targets</option>
                        <option value="User">Users</option>
                        <option value="Course">Courses</option>
                        <option value="Payment">Payments</option>
                    </select>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[64rem]">
                        <thead className="border-b bg-gray-50">
                            <tr>
                                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">Action</th>
                                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">Actor</th>
                                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">Target</th>
                                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">Metadata</th>
                                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {logs.length === 0 ? (
                                <tr><td colSpan="5" className="px-5 py-14 text-center text-gray-500">No audit logs found.</td></tr>
                            ) : logs.map((log) => (
                                <tr key={log._id} className="hover:bg-gray-50">
                                    <td className="px-5 py-4"><span className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700"><ShieldCheck size={14} />{log.action}</span></td>
                                    <td className="px-5 py-4 text-sm text-gray-700"><p className="font-medium text-gray-900">{log.actor?.fullName || "Unknown"}</p><p className="text-xs text-gray-500">{log.actor?.email || "-"}</p></td>
                                    <td className="px-5 py-4 text-sm text-gray-700"><p>{log.targetType}</p><p className="text-xs text-gray-500">{log.targetId || "-"}</p></td>
                                    <td className="px-5 py-4 text-xs text-gray-600"><pre className="max-w-80 overflow-x-auto rounded-lg bg-gray-50 p-2">{JSON.stringify(log.metadata || {}, null, 2)}</pre></td>
                                    <td className="px-5 py-4 text-sm text-gray-600">{formatDateTime(log.createdAt)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {totalPages > 1 && (
                <div className="flex items-center justify-between rounded-xl border bg-white px-5 py-4 shadow-sm">
                    <p className="text-sm text-gray-500">Page <span className="font-semibold text-gray-800">{page}</span> of <span className="font-semibold text-gray-800">{totalPages}</span></p>
                    <div className="flex items-center gap-2">
                        <button type="button" onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1} className="rounded-lg border p-2 hover:bg-gray-50 disabled:opacity-40"><ChevronLeft size={18} /></button>
                        <button type="button" onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))} disabled={page === totalPages} className="rounded-lg border p-2 hover:bg-gray-50 disabled:opacity-40"><ChevronRight size={18} /></button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AuditLogManagement;

