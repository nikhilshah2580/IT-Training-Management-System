import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { BookOpen, Pencil, Plus, RefreshCw, Trash2, Users } from "lucide-react";
import { toast } from "react-toastify";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { getErrorMessage } from "../../utils/toast";

import { deleteCourse, getMyCourses } from "../../api/course.services";

const statusClass = {
    Active: "bg-green-100 text-green-700",
    Pending: "bg-yellow-100 text-yellow-700",
    Rejected: "bg-red-100 text-red-700",
    Inactive: "bg-gray-100 text-gray-700",
};

const MyCourses = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [page] = useState(1);
    const [deleteTarget, setDeleteTarget] = useState(null);

    const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
        queryKey: ["instructor-courses", { page }],
        queryFn: () => getMyCourses({ page, limit: 12 }),
    });

    const courses = data?.courses || data?.data?.courses || [];

    const deleteMutation = useMutation({
        mutationFn: deleteCourse,
        onSuccess: (response) => {
            toast.success(response?.message || "Course deleted successfully");
            queryClient.invalidateQueries({ queryKey: ["instructor-courses"] });
            queryClient.invalidateQueries({ queryKey: ["instructor-dashboard"] });
        },
        onError: (error) => {
            toast.error(getErrorMessage(error, "Failed to delete course"));
        },
    });

    const handleDelete = (course) => {
        setDeleteTarget(course);
    };

    if (isLoading) {
        return (
            <div className="flex min-h-100 items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
                    <p className="mt-4 text-gray-500">Loading your courses...</p>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
                <h2 className="text-xl font-semibold text-red-600">
                    Failed to load your courses
                </h2>
                <p className="mt-2 text-gray-500">
                    {error?.response?.data?.message || error?.message || "Something went wrong"}
                </p>
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
                    <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>
                    <p className="mt-1 text-sm text-gray-500">
                        Manage the courses you created and track their approval status.
                    </p>
                </div>

                <div className="flex gap-3">
                    <button
                        type="button"
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="inline-flex items-center justify-center gap-2 rounded-lg border bg-white px-4 py-2.5 font-medium hover:bg-gray-50 disabled:opacity-50"
                    >
                        <RefreshCw size={17} className={isFetching ? "animate-spin" : ""} />
                        Refresh
                    </button>
                    <button
                        type="button"
                        onClick={() => navigate("/instructor/courses/create")}
                        className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white hover:bg-blue-700"
                    >
                        <Plus size={18} />
                        Create Course
                    </button>
                </div>
            </div>

            {courses.length === 0 ? (
                <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
                    <BookOpen size={36} className="mx-auto text-gray-400" />
                    <h2 className="mt-4 text-xl font-semibold text-gray-800">
                        No courses yet
                    </h2>
                    <p className="mt-2 text-gray-500">
                        Create your first course and send it for admin approval.
                    </p>
                    <button
                        type="button"
                        onClick={() => navigate("/instructor/courses/create")}
                        className="mt-6 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
                    >
                        Create Course
                    </button>
                </div>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                    {courses.map((course) => (
                        <article
                            key={course._id}
                            className="overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md"
                        >
                            <div className="flex h-44 items-center justify-center bg-gray-100">
                                {course.courseImage ? (
                                    <img
                                        src={course.courseImage}
                                        alt={course.title}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <span className="text-sm text-gray-400">No Image</span>
                                )}
                            </div>

                            <div className="p-5">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <h2 className="truncate text-lg font-bold text-gray-900">
                                            {course.title || "Untitled Course"}
                                        </h2>
                                        <p className="mt-1 text-sm text-gray-500">
                                            {course.category || "Uncategorized"} - {course.skillLevel || "Level not set"}
                                        </p>
                                    </div>
                                    <span
                                        className={`shrink-0 rounded-full px-3 py-1 text-xs font-semibold ${statusClass[course.status] || statusClass.Inactive}`}
                                    >
                                        {course.status || "Inactive"}
                                    </span>
                                </div>

                                <p className="mt-3 line-clamp-2 min-h-10 text-sm text-gray-600">
                                    {course.description || "No description available."}
                                </p>

                                <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                                    <div className="rounded-lg bg-gray-50 p-3">
                                        <p className="text-gray-500">Fee</p>
                                        <p className="mt-1 font-semibold text-gray-900">
                                            Rs. {Number(course.fee || 0).toLocaleString()}
                                        </p>
                                    </div>
                                    <div className="rounded-lg bg-gray-50 p-3">
                                        <p className="flex items-center gap-1 text-gray-500">
                                            <Users size={15} />
                                            Students
                                        </p>
                                        <p className="mt-1 font-semibold text-gray-900">
                                            {course.totalStudents || course.enrolledStudents?.length || 0}
                                        </p>
                                    </div>
                                </div>

                                <div className="mt-5 flex gap-2">
                                    <button
                                        type="button"
                                        onClick={() => navigate(`/instructor/courses/${course._id}/edit`)}
                                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
                                    >
                                        <Pencil size={16} />
                                        Edit
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => handleDelete(course)}
                                        disabled={deleteMutation.isPending}
                                        className="inline-flex items-center justify-center rounded-lg border px-3 py-2.5 text-red-600 hover:bg-red-50 disabled:opacity-50"
                                        title="Delete Course"
                                    >
                                        <Trash2 size={17} />
                                    </button>
                                </div>
                            </div>
                        </article>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyCourses;

