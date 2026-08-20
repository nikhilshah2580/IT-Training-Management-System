import React, { useEffect, useState } from "react";
import {
    BookOpen,
    ClipboardList,
    Award,
    CalendarCheck,
    Briefcase,
    Star,
    MessageSquareQuote,
    ArrowRight,
    Loader2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
    getMyEnrollments,
} from "../../api/enrollment.services";

const StudentDashboard = () => {
    const navigate = useNavigate();

    const [enrollments, setEnrollments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadDashboard = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await getMyEnrollments();

                const enrollmentData =
                    response?.enrollments ||
                    response?.data?.enrollments ||
                    response?.data ||
                    [];

                setEnrollments(
                    Array.isArray(enrollmentData)
                        ? enrollmentData
                        : [],
                );
            } catch (err) {
                console.error("Student dashboard error:", err);

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

    const activeEnrollments = enrollments.filter(
        (item) =>
            item?.status === "Active" ||
            item?.paymentStatus === "Paid",
    ).length;

    const completedCourses = enrollments.filter(
        (item) =>
            item?.status === "Completed" ||
            Number(item?.progress) === 100,
    ).length;

    const stats = [
        {
            title: "My Courses",
            value: enrollments.length,
            icon: BookOpen,
            path: "/student/my-courses",
        },
        {
            title: "Active Courses",
            value: activeEnrollments,
            icon: CalendarCheck,
            path: "/student/my-courses",
        },
        {
            title: "Completed",
            value: completedCourses,
            icon: Award,
            path: "/student/certificates",
        },
        {
            title: "Assignments",
            value: "View",
            icon: ClipboardList,
            path: "/student/assignments",
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
                        Loading student dashboard...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-2xl font-bold text-slate-800">
                    Student Dashboard
                </h1>

                <p className="mt-1 text-sm text-slate-500">
                    Track your courses, assignments, attendance and
                    learning progress.
                </p>
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

            {/* My learning */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-800">
                                My Learning
                            </h2>

                            <p className="mt-1 text-xs text-slate-500">
                                Your recently enrolled courses
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/student/my-courses")
                            }
                            className="text-sm font-medium text-blue-600 hover:underline"
                        >
                            View All
                        </button>
                    </div>

                    <div className="mt-5 space-y-3">
                        {enrollments.length === 0 ? (
                            <div className="rounded-lg bg-slate-50 p-6 text-center">
                                <BookOpen
                                    size={30}
                                    className="mx-auto text-slate-400"
                                />

                                <p className="mt-2 text-sm text-slate-500">
                                    You are not enrolled in any course.
                                </p>

                                <button
                                    type="button"
                                    onClick={() =>
                                        navigate("/courses")
                                    }
                                    className="mt-3 text-sm font-semibold text-blue-600"
                                >
                                    Browse Courses
                                </button>
                            </div>
                        ) : (
                            enrollments
                                .slice(0, 5)
                                .map((enrollment) => {
                                    const course =
                                        enrollment.course || {};

                                    const progress = Math.min(
                                        Math.max(
                                            Number(
                                                enrollment.progress || 0,
                                            ),
                                            0,
                                        ),
                                        100,
                                    );

                                    return (
                                        <div
                                            key={
                                                enrollment._id ||
                                                enrollment.id
                                            }
                                            className="rounded-lg border p-4"
                                        >
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="min-w-0">
                                                    <h3 className="truncate font-medium text-slate-800">
                                                        {course.title ||
                                                            "Course"}
                                                    </h3>

                                                    <p className="mt-1 text-xs text-slate-500">
                                                        Status:{" "}
                                                        {enrollment.status ||
                                                            "Pending"}
                                                    </p>
                                                </div>

                                                <span className="whitespace-nowrap rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-600">
                                                    {progress}%
                                                </span>
                                            </div>

                                            <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                                                <div
                                                    className="h-full rounded-full bg-blue-600 transition-all"
                                                    style={{
                                                        width: `${progress}%`,
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    );
                                })
                        )}
                    </div>
                </div>

                {/* Quick actions */}
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-slate-800">
                        Quick Actions
                    </h2>

                    <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <button
                            type="button"
                            onClick={() =>
                                navigate("/student/assignments")
                            }
                            className="flex items-center gap-3 rounded-lg border p-4 text-left transition hover:border-blue-500 hover:bg-blue-50"
                        >
                            <ClipboardList
                                size={20}
                                className="text-blue-600"
                            />

                            <div>
                                <p className="font-medium text-slate-800">
                                    Assignments
                                </p>

                                <p className="text-xs text-slate-500">
                                    View your assignments
                                </p>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/student/attendance")
                            }
                            className="flex items-center gap-3 rounded-lg border p-4 text-left transition hover:border-blue-500 hover:bg-blue-50"
                        >
                            <CalendarCheck
                                size={20}
                                className="text-blue-600"
                            />

                            <div>
                                <p className="font-medium text-slate-800">
                                    Attendance
                                </p>

                                <p className="text-xs text-slate-500">
                                    Check your attendance
                                </p>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/student/certificates")
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
                                    View earned certificates
                                </p>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/student/job-placements")
                            }
                            className="flex items-center gap-3 rounded-lg border p-4 text-left transition hover:border-blue-500 hover:bg-blue-50"
                        >
                            <Briefcase
                                size={20}
                                className="text-blue-600"
                            />

                            <div>
                                <p className="font-medium text-slate-800">
                                    Job Placement
                                </p>

                                <p className="text-xs text-slate-500">
                                    Find placement opportunities
                                </p>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/student/reviews")
                            }
                            className="flex items-center gap-3 rounded-lg border p-4 text-left transition hover:border-blue-500 hover:bg-blue-50"
                        >
                            <Star
                                size={20}
                                className="text-blue-600"
                            />

                            <div>
                                <p className="font-medium text-slate-800">
                                    Reviews
                                </p>

                                <p className="text-xs text-slate-500">
                                    Manage your course reviews
                                </p>
                            </div>
                        </button>

                        <button
                            type="button"
                            onClick={() =>
                                navigate("/student/testimonials")
                            }
                            className="flex items-center gap-3 rounded-lg border p-4 text-left transition hover:border-blue-500 hover:bg-blue-50"
                        >
                            <MessageSquareQuote
                                size={20}
                                className="text-blue-600"
                            />

                            <div>
                                <p className="font-medium text-slate-800">
                                    Testimonials
                                </p>

                                <p className="text-xs text-slate-500">
                                    Manage your testimonials
                                </p>
                            </div>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;