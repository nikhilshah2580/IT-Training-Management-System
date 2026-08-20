import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { ClipboardList, Eye, Loader2, RefreshCw } from "lucide-react";

import { getMyAssignments } from "../../api/assignment.services";

const formatDate = (value) => (value ? new Date(value).toLocaleDateString() : "-");

const InstructorSubmissions = () => {
    const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
        queryKey: ["instructor-submission-assignments"],
        queryFn: getMyAssignments,
    });

    const assignments = data?.assignments || [];

    if (isLoading) {
        return (
            <div className="flex min-h-100 items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        );
    }

    if (isError) {
        return (
            <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
                <h2 className="text-xl font-semibold text-red-600">Failed to load submissions</h2>
                <p className="mt-2 text-gray-500">{error?.response?.data?.message || error?.message}</p>
                <button
                    type="button"
                    onClick={() => refetch()}
                    className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
                >
                    <RefreshCw size={17} />
                    Try Again
                </button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Submissions</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Select an assignment to see which students submitted and grade their work.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border bg-white px-4 py-2.5 font-medium hover:bg-gray-50 disabled:opacity-50"
                >
                    <RefreshCw size={17} className={isFetching ? "animate-spin" : ""} />
                    Refresh
                </button>
            </div>

            <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Assignment</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Course</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Due Date</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {assignments.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                                        <ClipboardList size={34} className="mx-auto mb-3 text-gray-400" />
                                        No assignments found.
                                    </td>
                                </tr>
                            ) : (
                                assignments.map((assignment) => (
                                    <tr key={assignment._id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <p className="font-semibold text-gray-900">{assignment.title || "Untitled"}</p>
                                            <p className="line-clamp-1 text-sm text-gray-500">{assignment.description || "No description"}</p>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{assignment.course?.title || "-"}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{formatDate(assignment.dueDate)}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{assignment.status || "-"}</td>
                                        <td className="px-6 py-4">
                                            <Link
                                                to={`/instructor/assignments/${assignment._id}/submissions`}
                                                className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                                            >
                                                <Eye size={16} />
                                                View Submissions
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default InstructorSubmissions;
