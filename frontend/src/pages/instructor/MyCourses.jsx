import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Search, RefreshCw, Plus, Pencil, Trash2, BookOpen } from "lucide-react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { getMyCourses, deleteCourse } from "../../api/instructorCourse.services";

const MyCourses = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("all");
    const [status, setStatus] = useState("all");

    const { data, isLoading, isError, refetch } = useQuery({
        queryKey: ["my-courses"],
        queryFn: () =>
            getMyCourses({
                page: 1,
                limit: 100,
            }),
    });

    const deleteMutation = useMutation({
        mutationFn: deleteCourse,

        onSuccess: (data) => {
            toast.success(data?.message || "Course deleted successfully");

            queryClient.invalidateQueries({
                queryKey: ["my-courses"],
            });
        },

        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to delete course");
        },
    });

    const courses = data?.courses || data?.data || [];

    const filteredCourses = useMemo(() => {
        return courses.filter((course) => {
            const searchText = search.toLowerCase().trim();

            const matchesSearch =
                !searchText || course.title?.toLowerCase().includes(searchText) || course.description?.toLowerCase().includes(searchText);

            const matchesCategory = category === "all" || course.category === category;

            const matchesStatus = status === "all" || course.status === status;

            return matchesSearch && matchesCategory && matchesStatus;
        });
    }, [courses, search, category, status]);

    const handleDelete = (course) => {
        const confirmed = window.confirm(`Are you sure you want to delete "${course.title}"?`);

        if (!confirmed) return;

        deleteMutation.mutate(course._id);
    };

    if (isLoading) {
        return (
            <div className="flex min-h-64 items-center justify-center">
                <p className="text-gray-500">Loading your courses...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
                <p className="text-red-500">Failed to load your courses.</p>

                <button
                    onClick={() => refetch()}
                    className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
                >
                    <RefreshCw size={17} />
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
                    <h1 className="text-2xl font-bold text-gray-900">My Courses</h1>

                    <p className="mt-1 text-sm text-gray-500">Create and manage your training courses.</p>
                </div>

                <button
                    onClick={() => navigate("/instructor/courses/create")}
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 font-medium text-white hover:bg-blue-700"
                >
                    <Plus size={18} />
                    Create Course
                </button>
            </div>

            {/* Filters */}
            <div className="rounded-xl border bg-white p-4 shadow-sm">
                <div className="grid gap-3 md:grid-cols-3">
                    {/* Search */}
                    <div className="relative">
                        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />

                        <input
                            type="text"
                            value={search}
                            onChange={(event) => setSearch(event.target.value)}
                            placeholder="Search your courses..."
                            className="w-full rounded-lg border py-2.5 pl-10 pr-4 outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* Category */}
                    <select
                        value={category}
                        onChange={(event) => setCategory(event.target.value)}
                        className="rounded-lg border px-3 py-2.5 outline-none focus:border-blue-500"
                    >
                        <option value="all">All Categories</option>

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

                    {/* Status */}
                    <select
                        value={status}
                        onChange={(event) => setStatus(event.target.value)}
                        className="rounded-lg border px-3 py-2.5 outline-none focus:border-blue-500"
                    >
                        <option value="all">All Status</option>

                        <option value="Pending">Pending</option>

                        <option value="Active">Active</option>

                        <option value="Inactive">Inactive</option>

                        <option value="Rejected">Rejected</option>
                    </select>
                </div>
            </div>

            {/* Course Table */}
            <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full min-w-237.5">
                        <thead className="border-b bg-gray-50">
                            <tr>
                                <th className="px-5 py-4 text-left text-sm font-semibold">Course</th>

                                <th className="px-5 py-4 text-left text-sm font-semibold">Category</th>

                                <th className="px-5 py-4 text-left text-sm font-semibold">Level</th>

                                <th className="px-5 py-4 text-left text-sm font-semibold">Fee</th>

                                <th className="px-5 py-4 text-left text-sm font-semibold">Students</th>

                                <th className="px-5 py-4 text-left text-sm font-semibold">Status</th>

                                <th className="px-5 py-4 text-right text-sm font-semibold">Actions</th>
                            </tr>
                        </thead>

                        <tbody className="divide-y">
                            {filteredCourses.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-5 py-12 text-center text-gray-500">
                                        You have no courses yet.
                                    </td>
                                </tr>
                            ) : (
                                filteredCourses.map((course) => (
                                    <tr key={course._id} className="hover:bg-gray-50">
                                        {/* Course */}
                                        <td className="px-5 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-blue-50 text-blue-600">
                                                    {course.courseImage ? (
                                                        <img src={course.courseImage} alt={course.title} className="h-full w-full object-cover" />
                                                    ) : (
                                                        <BookOpen size={21} />
                                                    )}
                                                </div>

                                                <div>
                                                    <p className="font-semibold text-gray-900">{course.title}</p>

                                                    <p className="max-w-xs truncate text-xs text-gray-500">{course.duration}</p>
                                                </div>
                                            </div>
                                        </td>

                                        {/* Category */}
                                        <td className="px-5 py-4 text-sm text-gray-600">{course.category}</td>

                                        {/* Level */}
                                        <td className="px-5 py-4">
                                            <span className="rounded-full bg-purple-50 px-3 py-1 text-xs font-semibold text-purple-700">{course.skillLevel}</span>
                                        </td>

                                        {/* Fee */}
                                        <td className="px-5 py-4 text-sm font-medium">Rs. {course.fee?.toLocaleString() || 0}</td>

                                        {/* Students */}
                                        <td className="px-5 py-4 text-sm text-gray-600">{course.totalStudents}</td>

                                        {/* Status */}
                                        <td className="px-5 py-4">
                                            <span
                                                className={`rounded-full px-3 py-1 text-xs font-semibold ${course.status === "Active"
                                                        ? "bg-green-50 text-green-700"
                                                        : course.status === "Rejected"
                                                            ? "bg-red-50 text-red-700"
                                                            : course.status === "Inactive"
                                                                ? "bg-gray-100 text-gray-700"
                                                                : "bg-yellow-50 text-yellow-700"
                                                    }`}
                                            >
                                                {course.status}
                                            </span>
                                        </td>

                                        {/* Actions */}
                                        <td className="px-5 py-4">
                                            <div className="flex justify-end gap-2">
                                                {/* Edit */}
                                                <button
                                                    onClick={() => navigate( `/instructor/courses/${course._id}/edit`)}
                                                    className="rounded-lg p-2 text-blue-600 hover:bg-blue-50"
                                                    title="Edit course"
                                                >
                                                    <Pencil size={18} />
                                                </button>

                                                {/* Delete */}
                                                <button
                                                    onClick={() => handleDelete(course)}
                                                    disabled={deleteMutation.isPending}
                                                    className="rounded-lg p-2 text-red-600 hover:bg-red-50 disabled:opacity-50"
                                                    title="Delete course"
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

                {/* Footer */}
                <div className="border-t px-5 py-4 text-sm text-gray-500">
                    Showing <span className="font-semibold text-gray-900">{filteredCourses.length}</span> of{" "}
                    <span className="font-semibold text-gray-900">{courses.length}</span> courses
                </div>
            </div>
        </div>
    );
};

export default MyCourses;
