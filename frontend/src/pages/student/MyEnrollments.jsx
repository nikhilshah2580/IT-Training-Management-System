import { useQuery } from "@tanstack/react-query";

import { getMyEnrollments } from "../../api/enrollment.services";

import { BookOpen, Clock, CreditCard, GraduationCap, Loader2, CalendarDays } from "lucide-react";

const MyEnrollments = () => {
    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["my-enrollments"],

        queryFn: getMyEnrollments,
    });

    const enrollments = data?.enrollments || [];

    // LOADING

    if (isLoading) {
        return (
            <div className="flex min-h-100 items-center justify-center">
                <div className="text-center">
                    <Loader2 size={40} className="mx-auto animate-spin text-blue-600" />

                    <p className="mt-4 text-gray-500">Loading your enrollments...</p>
                </div>
            </div>
        );
    }

    // ERROR

    if (isError) {
        return (
            <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
                <h2 className="text-xl font-semibold text-red-600">Failed to load enrollments</h2>

                <p className="mt-2 text-gray-500">{error?.response?.data?.message || error?.message || "Something went wrong"}</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* HEADER */}

            <div>
                <h1 className="text-2xl font-bold text-gray-900">My Enrollments</h1>

                <p className="mt-1 text-sm text-gray-500">View your enrolled courses and track your progress.</p>
            </div>

            {/* EMPTY */}

            {enrollments.length === 0 ? (
                <div className="rounded-xl border bg-white p-12 text-center shadow-sm">
                    <BookOpen size={48} className="mx-auto text-gray-300" />

                    <h2 className="mt-4 text-xl font-semibold text-gray-800">No enrollments yet</h2>

                    <p className="mt-2 text-gray-500">You haven't enrolled in any courses yet.</p>
                </div>
            ) : (
                /* ENROLLMENTS */

                <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                    {enrollments.map((enrollment) => {
                        const course = enrollment.course;

                        const progress = Number(enrollment.progress || 0);

                        return (
                            <div key={enrollment._id} className="overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md">
                                {/* COURSE IMAGE */}

                                <div className="flex h-40 items-center justify-center bg-gray-100">
                                    {course?.courseImage ? (
                                        <img src={course.courseImage} alt={course.title} className="h-full w-full object-cover" />
                                    ) : (
                                        <GraduationCap size={52} className="text-gray-300" />
                                    )}
                                </div>

                                {/* CONTENT */}

                                <div className="p-5">
                                    <h2 className="line-clamp-2 text-lg font-bold text-gray-900">{course?.title || "Course unavailable"}</h2>

                                    <div className="mt-4 space-y-3">
                                        {/* DURATION */}

                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <Clock size={16} />

                                            <span>{course?.duration || "N/A"}</span>
                                        </div>

                                        {/* FEE */}

                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <CreditCard size={16} />

                                            <span>Rs. {course?.fee ?? 0}</span>
                                        </div>

                                        {/* ENROLLED DATE */}

                                        <div className="flex items-center gap-2 text-sm text-gray-600">
                                            <CalendarDays size={16} />

                                            <span>{enrollment.createdAt ? new Date(enrollment.createdAt).toLocaleDateString() : "N/A"}</span>
                                        </div>
                                    </div>

                                    {/* STATUS */}

                                    <div className="mt-5 flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-600">Status</span>

                                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClass(enrollment.status)}`}>
                                            {enrollment.status}
                                        </span>
                                    </div>

                                    {/* PAYMENT */}

                                    <div className="mt-3 flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-600">Payment</span>

                                        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getPaymentClass(enrollment.paymentStatus)}`}>
                                            {enrollment.paymentStatus || "Pending"}
                                        </span>
                                    </div>

                                    {/* PROGRESS */}

                                    <div className="mt-5">
                                        <div className="mb-2 flex items-center justify-between">
                                            <span className="text-sm font-medium text-gray-700">Progress</span>

                                            <span className="text-sm font-semibold text-blue-600">{progress}%</span>
                                        </div>

                                        <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                                            <div
                                                className="h-full rounded-full bg-blue-600 transition-all"
                                                style={{
                                                    width: `${progress}%`,
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

// STATUS STYLE

const getStatusClass = (status) => {
    switch (status) {
        case "Approved":
            return "bg-blue-100 text-blue-700";

        case "Active":
            return "bg-green-100 text-green-700";

        case "Completed":
            return "bg-purple-100 text-purple-700";

        case "Cancelled":
            return "bg-red-100 text-red-700";

        default:
            return "bg-yellow-100 text-yellow-700";
    }
};

// PAYMENT 

const getPaymentClass = (status) => {
    switch (status) {
        case "Paid":
            return "bg-green-100 text-green-700";

        case "Failed":
            return "bg-red-100 text-red-700";

        default:
            return "bg-yellow-100 text-yellow-700";
    }
};

export default MyEnrollments;
