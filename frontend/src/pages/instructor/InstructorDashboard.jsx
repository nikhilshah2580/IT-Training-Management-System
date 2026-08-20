import React, { useEffect, useState } from "react";
import {
    BookOpen,
    ClipboardList,
    Users,
    Award,
    FileText,
    Plus,
    ArrowRight,
    Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
    getMyCourses,
} from "../../api/course.services";

const InstructorDashboard = () => {
    const navigate = useNavigate();

    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getMyCourses();

                const courseData =
                    response?.courses ||
                    response?.data?.courses ||
                    response?.data ||
                    [];

                setCourses(Array.isArray(courseData) ? courseData : []);
            } catch (err) {
                console.error("Instructor dashboard error:", err);

                setError(
                    err?.response?.data?.message ||
                    err?.message ||
                    "Failed to load dashboard.",
                );
            } finally {
                setLoading(false);
            }
        };

        loadDashboard();
    }, []);

    const totalStudents = courses.reduce(
        (total, course) =>
            total +
            Number(
                course?.totalStudents ||
                course?.enrolledStudents?.length ||
                0,
            ),
        0,
    );

    const activeCourses = courses.filter(
        (course) =>
            course?.status === "Active" ||
            course?.status === "Published",
    ).length;

    const stats = [
        {
            title: "Total Courses",
            value: courses.length,
            icon: BookOpen,
            path: "/instructor/courses",
        },
        {
            title: "Active Courses",
            value: activeCourses,
            icon: FileText,
            path: "/instructor/courses",
        },
        {
            title: "Total Students",
            value: totalStudents,
            icon: Users,
            path: "/instructor/courses",
        },
        {
            title: "Assignments",
            value: "Manage",
            icon: ClipboardList,
            path: "/instructor/assignments",
        },
    ];

    if (loading) {
        return (
            <div className="flex min-h-100 items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Loader2
                        size={35}
                        className="animate-spin text-blue-600"
                    />

                    <p className="text-sm text-slate-500">
                        Loading instructor dashboard...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">
                        Instructor Dashboard
                    </h1>

                    <p className="mt-1 text-sm text-slate-500">
                        Manage your courses, students, assignments and
                        learning resources.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        navigate("/instructor/courses/create")
                    }
                    className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                    <Plus size={18} />
                    Create Course
                </button>
            </div>

            {/* Error */}
            {error && (
                <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {error}
                </div>
            )}

            {/* Statistics */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => {
                    const Icon = stat.icon;

                    return (
                        <button
                            key={stat.title}
                            type="button"
                            onClick={() => navigate(stat.path)}
                            className="group rounded-xl border bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                        >
                            <div className="flex items-center justify-between">
                                <div className="rounded-lg bg-blue-50 p-3 text-blue-600">
                                    <Icon size={22} />
                                </div>

                                <ArrowRight
                                    size={18}
                                    className="text-slate-300 transition group-hover:translate-x-1 group-hover:text-blue-600"
                                />
                            </div>

                            <p className="mt-4 text-sm text-slate-500">
                                {stat.title}
                            </p>

                            <h2 className="mt-1 text-2xl font-bold text-slate-800">
                                {stat.value}
                            </h2>
                        </button>
                    );
                })}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-800">
                        Quick Actions
                    </h2>

                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <button
                            type="button"
                            onClick={() =>
                                navigate("/instructor/courses/create")
                            }
                            className="flex items-center gap-3 rounded-lg border p-4 text-left transition hover:border-blue-500 hover:bg-blue-50"
                        >
                            <BookOpen
                                size={20}
                                className="text-blue-600"
                            />

                            <div>
                                <p className="font-medium text-slate-800">
                                    Create Course
                                </p>

                                <p className="text-xs text-slate-500">
                                    Add a new training course
                                </p>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/instructor/assignments/create")
                            }
                            className="flex items-center gap-3 rounded-lg border p-4 text-left transition hover:border-blue-500 hover:bg-blue-50"
                        >
                            <ClipboardList
                                size={20}
                                className="text-blue-600"
                            />

                            <div>
                                <p className="font-medium text-slate-800">
                                    Create Assignment
                                </p>

                                <p className="text-xs text-slate-500">
                                    Give students new work
                                </p>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/instructor/resources")
                            }
                            className="flex items-center gap-3 rounded-lg border p-4 text-left transition hover:border-blue-500 hover:bg-blue-50"
                        >
                            <FileText
                                size={20}
                                className="text-blue-600"
                            />

                            <div>
                                <p className="font-medium text-slate-800">
                                    Manage Resources
                                </p>

                                <p className="text-xs text-slate-500">
                                    Manage course materials
                                </p>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/instructor/certificates")
                            }
                            className="flex items-center gap-3 rounded-lg border p-4 text-left transition hover:border-blue-500 hover:bg-blue-50"
                        >
                            <Award
                                size={20}
                                className="text-blue-600"
                            />

                            <div>
                                <p className="font-medium text-slate-800">
                                    Certificates
                                </p>

                                <p className="text-xs text-slate-500">
                                    Manage student certificates
                                </p>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Recent Courses */}
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold text-slate-800">
                            My Courses
                        </h2>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/instructor/courses")
                            }
                            className="text-sm font-medium text-blue-600 hover:underline"
                        >
                            View All
                        </button>
                    </div>

                    <div className="mt-4 space-y-3">
                        {courses.length === 0 ? (
                            <div className="rounded-lg bg-slate-50 p-6 text-center">
                                <BookOpen
                                    size={30}
                                    className="mx-auto text-slate-400"
                                />

                                <p className="mt-2 text-sm text-slate-500">
                                    You have not created any courses yet.
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate(
                                            "/instructor/courses/create",
                                        )
                                    }
                                    className="mt-3 text-sm font-semibold text-blue-600"
                                >
                                    Create your first course
                                </button>
                            </div>
                        ) : (
                            courses.slice(0, 5).map((course) => (
                                <div
                                    key={course._id || course.id}
                                    className="flex items-center justify-between rounded-lg border p-3"
                                >
                                    <div className="min-w-0">
                                        <p className="truncate font-medium text-slate-800">
                                            {course.title ||
                                                "Untitled Course"}
                                        </p>

                                        <p className="text-xs text-slate-500">
                                            {Number(
                                                course.totalStudents ||
                                                course.enrolledStudents
                                                    ?.length ||
                                                0,
                                            )}{" "}
                                            students
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            navigate(
                                                `/instructor/courses/${course._id ||
                                                course.id
                                                }/edit`,
                                            )
                                        }
                                        className="ml-3 text-sm font-medium text-blue-600"
                                    >
                                        Manage
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default InstructorDashboard;