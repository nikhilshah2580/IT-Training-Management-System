import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { BookOpen, Clock, CreditCard, GraduationCap, Loader2, CheckCircle, AlertCircle } from "lucide-react";

import { getMyEnrollments } from "../../api/enrollment.services";

const MyEnrollments = () => {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["my-enrollments"],
        queryFn: getMyEnrollments,
    });

    const enrollments = data?.enrollments || [];

    // ============================================
    // LOADING
    // ============================================

    if (isLoading) {
        return (
            <div className="flex min-h-100 items-center justify-center">
                <Loader2 size={40} className="animate-spin text-blue-600" />
            </div>
        );
    }

    // ============================================
    // ERROR
    // ============================================

    if (isError) {
        return (
            <div className="flex min-h-100 items-center justify-center px-4">
                <div className="w-full max-w-md rounded-xl bg-red-50 p-6 text-center">
                    <AlertCircle size={40} className="mx-auto mb-3 text-red-500" />

                    <h2 className="text-lg font-semibold text-red-700">Failed to load enrollments</h2>

                    <p className="mt-2 text-sm text-red-600">{error?.response?.data?.message || "Something went wrong."}</p>
                </div>
            </div>
        );
    }

    // ============================================
    // EMPTY
    // ============================================

    if (enrollments.length === 0) {
        return (
            <div className="flex min-h-100 items-center justify-center px-4">
                <div className="text-center">
                    <BookOpen size={56} className="mx-auto mb-4 text-gray-400" />

                    <h2 className="text-2xl font-bold text-gray-800">No Enrollments Yet</h2>

                    <p className="mt-2 text-gray-500">You have not enrolled in any courses yet.</p>
                </div>
            </div>
        );
    }

    return (
        <main className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                {/* HEADER */}

                <div className="mb-8">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-blue-100 p-3">
                            <GraduationCap size={26} className="text-blue-600" />
                        </div>

                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">My Enrollments</h1>

                            <p className="mt-1 text-sm text-gray-500">View your enrolled courses and learning progress.</p>
                        </div>
                    </div>
                </div>

                {/* ENROLLMENT CARDS */}

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {enrollments.map((enrollment) => {
                        const course = enrollment.course;

                        const progress = Number(enrollment.progress || 0);

                        return (
                            <div
                                key={enrollment._id}
                                className="overflow-hidden rounded-2xl border bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                            >
                                {/* COURSE HEADER */}

                                <div className="bg-linear-to-r from-blue-600 to-indigo-600 p-6 text-white">
                                    <div className="mb-3 flex items-center justify-between">
                                        <BookOpen size={28} />

                                        <StatusBadge status={enrollment.status} />
                                    </div>

                                    <h2 className="line-clamp-2 text-xl font-bold">{course?.title || "Course"}</h2>
                                </div>

                                {/* CONTENT */}

                                <div className="space-y-5 p-6">
                                    <p className="line-clamp-3 text-sm leading-6 text-gray-600">{course?.description || "No course description available."}</p>

                                    {/* COURSE INFO */}

                                    <div className="grid grid-cols-2 gap-3">
                                        <InfoItem icon={<Clock size={17} />} label="Duration" value={course?.duration || "N/A"} />

                                        <InfoItem icon={<CreditCard size={17} />} label="Fee" value={`Rs. ${course?.fee ?? 0}`} />
                                    </div>

                                    {/* PAYMENT */}

                                    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                                        <span className="text-sm font-medium text-gray-600">Payment</span>

                                        <PaymentBadge status={enrollment.paymentStatus} />
                                    </div>

                                    {/* PROGRESS */}

                                    <div>
                                        <div className="mb-2 flex items-center justify-between">
                                            <span className="text-sm font-semibold text-gray-700">Course Progress</span>

                                            <span className="text-sm font-bold text-blue-600">{progress}%</span>
                                        </div>

                                        <div className="h-3 overflow-hidden rounded-full bg-gray-200">
                                            <div
                                                className="h-full rounded-full bg-blue-600 transition-all duration-500"
                                                style={{
                                                    width: `${Math.min(Math.max(progress, 0), 100)}%`,
                                                }}
                                            />
                                        </div>
                                    </div>

                                    {/* COMPLETED */}

                                    {enrollment.completedAt && (
                                        <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-sm text-green-700">
                                            <CheckCircle size={18} />

                                            <span>Completed on {new Date(enrollment.completedAt).toLocaleDateString()}</span>
                                        </div>
                                    )}

                                    {/* ACTION */}

                                    <button
                                        type="button"
                                        disabled={enrollment.status === "Cancelled" || enrollment.status === "Pending"}
                                        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed"
                                    >
                                        {enrollment.status === "Completed"
                                            ? "View Course"
                                            : enrollment.status === "Active"
                                                ? "Continue Learning"
                                                : enrollment.status === "Cancelled"
                                                    ? "Enrollment Cancelled"
                                                    : "Waiting for Approval"}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </main>
    );
};

// ============================================
// STATUS BADGE
// ============================================

const StatusBadge = ({ status }) => {
    const styles = {
        Pending: "bg-yellow-400/20 text-yellow-100",
        Approved: "bg-green-400/20 text-green-100",
        Active: "bg-green-400/20 text-green-100",
        Completed: "bg-white/20 text-white",
        Cancelled: "bg-red-400/20 text-red-100",
    };

    return (
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[status] || "bg-white/20 text-white"}`}>{status || "Unknown"}</span>
    );
};

// ============================================
// PAYMENT BADGE
// ============================================

const PaymentBadge = ({ status }) => {
    const styles = {
        Pending: "bg-yellow-100 text-yellow-700",
        Paid: "bg-green-100 text-green-700",
        Failed: "bg-red-100 text-red-700",
    };

    return (
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${styles[status] || "bg-gray-100 text-gray-600"}`}>
            {status || "Unknown"}
        </span>
    );
};

// ============================================
// INFO ITEM
// ============================================

const InfoItem = ({ icon, label, value }) => {
    return (
        <div className="rounded-lg bg-gray-50 p-3">
            <div className="mb-1 flex items-center gap-2 text-gray-500">
                {icon}

                <span className="text-xs">{label}</span>
            </div>

            <p className="text-sm font-semibold text-gray-800">{value}</p>
        </div>
    );
};

export default MyEnrollments;
