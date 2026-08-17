import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, Eye, Pencil, Trash2, Check, X, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { getCourses, deleteCourse, approveCourse, rejectCourse } from "../../api/course.services";

const CourseManagement = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("");
    const [skillLevel, setSkillLevel] = useState("");
    const [status, setStatus] = useState("");
    const [page, setPage] = useState(1);

    const limit = 10;

 
    // GET COURSES

    const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
        queryKey: [
            "courses",
            {
                search,
                category,
                skillLevel,
                status,
                page,
                limit,
            },
        ],

        queryFn: () =>
            getCourses({
                search: search || undefined,
                category: category || undefined,
                skillLevel: skillLevel || undefined,
                status: status || undefined,
                page,
                limit,
            }),

        keepPreviousData: true,
    });

    const courses = data?.courses || [];

    const totalPages = data?.totalPages || Math.ceil((data?.total || 0) / limit) || 1;

    // DELETE COURSE

    const deleteMutation = useMutation({
        mutationFn: deleteCourse,

        onSuccess: (response) => {
            toast.success(response?.message || "Course deleted successfully");

            queryClient.invalidateQueries({
                queryKey: ["courses"],
            });
        },

        onError: (error) => {
            console.error("Delete course error:", error?.response?.data || error);

            toast.error(error?.response?.data?.message || "Failed to delete course");
        },
    });

    // APPROVE COURSE

    const approveMutation = useMutation({
        mutationFn: approveCourse,

        onSuccess: (response) => {
            toast.success(response?.message || "Course approved successfully");

            queryClient.invalidateQueries({
                queryKey: ["courses"],
            });
        },

        onError: (error) => {
            console.error("Approve course error:", error?.response?.data || error);

            toast.error(error?.response?.data?.message || "Failed to approve course");
        },
    });


    // REJECT COURSE

    const rejectMutation = useMutation({
        mutationFn: rejectCourse,

        onSuccess: (response) => {
            toast.success(response?.message || "Course rejected successfully");

            queryClient.invalidateQueries({
                queryKey: ["courses"],
            });
        },

        onError: (error) => {
            console.error("Reject course error:", error?.response?.data || error);

            toast.error(error?.response?.data?.message || "Failed to reject course");
        },
    });


    // HANDLERS

    const handleSearch = (event) => {
        setSearch(event.target.value);
        setPage(1);
    };

    const handleCategoryChange = (event) => {
        setCategory(event.target.value);
        setPage(1);
    };

    const handleSkillLevelChange = (event) => {
        setSkillLevel(event.target.value);
        setPage(1);
    };

    const handleStatusChange = (event) => {
        setStatus(event.target.value);
        setPage(1);
    };

    const handleApprove = (course) => {
        const confirmed = window.confirm(`Are you sure you want to approve "${course.title}"?`);

        if (!confirmed) return;

        approveMutation.mutate(course._id);
    };

    const handleReject = (course) => {
        const confirmed = window.confirm(`Are you sure you want to reject "${course.title}"?`);

        if (!confirmed) return;

        rejectMutation.mutate(course._id);
    };

    const handleDelete = (course) => {
        const confirmed = window.confirm(`Are you sure you want to delete "${course.title}"?`);

        if (!confirmed) return;

        deleteMutation.mutate(course._id);
    };

    const handleReset = () => {
        setSearch("");
        setCategory("");
        setSkillLevel("");
        setStatus("");
        setPage(1);
    };

    // LOADING

    if (isLoading) {
        return (
            <div className="flex min-h-100 items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />

                    <p className="mt-4 text-gray-500">Loading courses...</p>
                </div>
            </div>
        );
    }

    // ERROR

    if (isError) {
        return (
            <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
                <h2 className="text-xl font-semibold text-red-600">Failed to load courses</h2>

                <p className="mt-2 text-gray-500">{error?.response?.data?.message || error?.message || "Something went wrong"}</p>

                <button
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

            {/* HEADER */}

            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Course Management</h1>

                    <p className="mt-1 text-sm text-gray-500">Manage, approve, reject and monitor courses.</p>
                </div>

                <button
                    onClick={() => refetch()}
                    disabled={isFetching}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border bg-white px-4 py-2.5 font-medium hover:bg-gray-50 disabled:opacity-50"
                >
                    <RefreshCw size={17} className={isFetching ? "animate-spin" : ""} />
                    Refresh
                </button>
            </div>


            {/* FILTERS */}

            <div className="rounded-xl border bg-white p-5 shadow-sm">
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    {/* Search */}

                    <div className="relative lg:col-span-2">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                        <input
                            type="text"
                            value={search}
                            onChange={handleSearch}
                            placeholder="Search courses..."
                            className="w-full rounded-lg border py-2.5 pl-10 pr-4 outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Category */}

                    <select value={category} onChange={handleCategoryChange} className="rounded-lg border px-3 py-2.5 outline-none focus:border-blue-500">
                        <option value="">All Categories</option>

                        <option value="Programming">Programming</option>

                        <option value="Web Development">Web Development</option>

                        <option value="Data Science & Analytics">Data Science & Analytics</option>

                        <option value="Graphic Design">Graphic Design</option>

                        <option value="Networking">Networking</option>

                        <option value="Cyber Security">Cyber Security</option>

                        <option value="Database">Database</option>

                        <option value="Cloud Computing">Cloud Computing</option>

                        <option value="Other">Other</option>
                    </select>

                    {/* Skill Level */}

                    <select
                        value={skillLevel}
                        onChange={handleSkillLevelChange}
                        className="rounded-lg border px-3 py-2.5 outline-none focus:border-blue-500"
                    >
                        <option value="">All Levels</option>

                        <option value="Beginner">Beginner</option>

                        <option value="Intermediate">Intermediate</option>

                        <option value="Advanced">Advanced</option>
                    </select>

                    {/* Status */}

                    <select value={status} onChange={handleStatusChange} className="rounded-lg border px-3 py-2.5 outline-none focus:border-blue-500">
                        <option value="">All Status</option>

                        <option value="Pending">Pending</option>

                        <option value="Active">Active</option>

                        <option value="Inactive">Inactive</option>

                        <option value="Rejected">Rejected</option>
                    </select>
                </div>

                {/* Reset */}

                {(search || category || skillLevel || status) && (
                    <button onClick={handleReset} className="mt-4 text-sm font-medium text-blue-600 hover:underline">
                        Clear Filters
                    </button>
                )}
            </div>

            {/* -------------------------------- */}
            {/* COURSE TABLE */}
            {/* -------------------------------- */}

            <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-250">
                        <thead className="border-b bg-gray-50">
                            <tr>
                                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">Course</th>

                                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">Instructor</th>

                                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">Category</th>

                                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">Fee</th>

                                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">Students</th>

                                <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">Status</th>

                                <th className="px-5 py-4 text-right text-sm font-semibold text-gray-600">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {courses.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-5 py-16 text-center">
                                        <p className="font-medium text-gray-700">No courses found</p>

                                        <p className="mt-1 text-sm text-gray-500">Try changing your filters.</p>
                                    </td>
                                </tr>
                            ) : (
                                courses.map((course) => (
                                    <tr key={course._id} className="hover:bg-gray-50">
                                        {/* Course */}

                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-gray-100">
                                                    {course.courseImage ? (
                                                        <img src={course.courseImage} alt={course.title} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <div className="flex h-full w-full items-center justify-center text-xs text-gray-400">No Image</div>
                                                    )}
                                                </div>

                                                <div className="max-w-62.5">
                                                    <p className="truncate font-semibold text-gray-900">{course.title}</p>

                                                    <p className="text-xs text-gray-500">{course.skillLevel}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Instructor */}

                                        <td className="px-5 py-4">
                                            <p className="font-medium text-gray-800">{course.instructor?.fullName || "Unknown"}</p>

                                            <p className="text-xs text-gray-500">{course.instructor?.email || ""}</p>
                                        </td>

                                        {/* Category */}

                                        <td className="px-5 py-4 text-sm text-gray-600">{course.category}</td>

                                        {/* Fee */}

                                        <td className="px-5 py-4 text-sm font-medium text-gray-800">Rs. {Number(course.fee || 0).toLocaleString()}</td>

                                        {/* Students */}

                                        <td className="px-5 py-4 text-sm text-gray-600">{course.totalStudents || 0}</td>

                                        {/* Status */}

                                        <td className="px-5 py-4">
                                            <span
                                                className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${course.status === "Active"
                                                        ? "bg-green-100 text-green-700"
                                                        : course.status === "Pending"
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : course.status === "Rejected"
                                                                ? "bg-red-100 text-red-700"
                                                                : "bg-gray-100 text-gray-700"
                                                    }`}
                                            >
                                                {course.status}
                                            </span>
                                        </td>

                                        {/* Actions */}

                                        <td className="px-5 py-4">
                                            <div className="flex justify-end gap-1">
                                                {/* View */}

                                                <button
                                                    onClick={() => navigate(`/admin/courses/${course._id}`)}
                                                    className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                                                    title="View Course"
                                                >
                                                    <Eye size={18} />
                                                </button>

                                                {/* Edit */}

                                                <button
                                                    onClick={() => navigate(`/admin/courses/${course._id}/edit`)}
                                                    className="rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                                                    title="Edit Course"
                                                >
                                                    <Pencil size={18} />
                                                </button>

                                                {/* Approve */}

                                                {course.status === "Pending" && (
                                                    <button
                                                        onClick={() => handleApprove(course)}
                                                        disabled={approveMutation.isPending || rejectMutation.isPending}
                                                        className="rounded-lg p-2 text-green-600 hover:bg-green-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                        title="Approve Course"
                                                    >
                                                        <Check size={18} />
                                                    </button>
                                                )}

                                                {/* Reject */}

                                                {course.status === "Pending" && (
                                                    <button
                                                        onClick={() => handleReject(course)}
                                                        disabled={approveMutation.isPending || rejectMutation.isPending}
                                                        className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                        title="Reject Course"
                                                    >
                                                        <X size={18} />
                                                    </button>
                                                )}

                                                {/* Delete */}

                                                <button
                                                    onClick={() => handleDelete(course)}
                                                    disabled={deleteMutation.isPending}
                                                    className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                                                    title="Delete Course"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* PAGINATION */}

            {totalPages > 1 && (
                <div className="flex items-center justify-between rounded-xl border bg-white px-5 py-4 shadow-sm">
                    <p className="text-sm text-gray-500">
                        Page <span className="font-semibold text-gray-800">{page}</span> of{" "}
                        <span className="font-semibold text-gray-800">{totalPages}</span>
                    </p>

                    <div className="flex items-center gap-2">
                        <button
                            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                            disabled={page === 1}
                            className="rounded-lg border p-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ChevronLeft size={18} />
                        </button>

                        <button
                            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={page === totalPages}
                            className="rounded-lg border p-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CourseManagement;
