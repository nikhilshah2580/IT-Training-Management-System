import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { Users, GraduationCap, BookOpen, Briefcase, UserCheck, MessageSquare, CreditCard, Award, Loader2, RefreshCw } from "lucide-react";
import { getDashboard } from "../../api/dashboard.services";

const AdminDashboard = () => {
    const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
        queryKey: ["admin-dashboard"],
        queryFn: getDashboard,
    });

    if (isLoading) {
        return <div className="flex min-h-100 items-center justify-center"><Loader2 size={40} className="animate-spin text-blue-600" /></div>;
    }

    if (isError) {
        return (
            <div className="rounded-xl bg-red-50 p-6 text-center">
                <p className="font-semibold text-red-700">{error?.response?.data?.message || "Failed to load dashboard"}</p>
                <button onClick={() => refetch()} className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"><RefreshCw size={16} /> Retry</button>
            </div>
        );
    }

    // Extract dashboard data safely
    const dashboardData = data?.dashboard || {};

    const stats = [
        ["Total Users", dashboardData?.users?.total ?? 0, Users],
        ["Students", dashboardData?.users?.students ?? 0, GraduationCap],
        ["Instructors", dashboardData?.users?.instructors ?? 0, UserCheck],
        ["Active Courses", dashboardData?.courses?.active ?? 0, BookOpen],
        ["Job Placements", dashboardData?.placements?.total ?? 0, Briefcase],
        ["Pending Inquiries", dashboardData?.contacts?.pending ?? 0, MessageSquare],
        ["Paid Payments", dashboardData?.payments?.successful ?? 0, CreditCard],
        ["Certificates", dashboardData?.certificates?.total ?? 0, Award],
    ];

    return (
        <div className="space-y-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
                    <p className="mt-1 text-gray-500">Here's what's happening in your training platform.</p>
                </div>
                <button onClick={() => refetch()} disabled={isFetching} className="inline-flex items-center justify-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50">
                    <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} /> Refresh
                </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map(([title, value, Icon]) => (
                    <div key={title} className="rounded-xl border bg-white p-5 shadow-sm">
                        <div className="flex items-center justify-between">
                            <div><p className="text-sm font-medium text-gray-500">{title}</p><p className="mt-2 text-3xl font-bold text-gray-900">{value}</p></div>
                            <div className="rounded-xl bg-blue-50 p-3 text-blue-600"><Icon size={25} /></div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
                <DashboardPanel title="Courses" items={[["Total", dashboardData?.courses?.total], ["Pending", dashboardData?.courses?.pending], ["Active", dashboardData?.courses?.active], ["Rejected", dashboardData?.courses?.rejected]]} />
                <DashboardPanel title="Enrollments" items={[["Total", dashboardData?.enrollments?.total], ["Active", dashboardData?.enrollments?.active], ["Completed", dashboardData?.enrollments?.completed]]} />
                <DashboardPanel title="Payments" items={[["Total", dashboardData?.payments?.total], ["Paid", dashboardData?.payments?.successful], ["Pending", dashboardData?.payments?.pending], ["Failed", dashboardData?.payments?.failed]]} />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
                <Link to="/admin/enrollments" className="rounded-xl border bg-white p-6 shadow-sm hover:bg-gray-50"><h3 className="font-semibold">Enrollment Management</h3><p className="mt-2 text-sm text-gray-500">Review and manage student enrollments.</p></Link>
                <Link to="/admin/courses" className="rounded-xl border bg-white p-6 shadow-sm hover:bg-gray-50"><h3 className="font-semibold">Course Management</h3><p className="mt-2 text-sm text-gray-500">Approve, reject, edit, and manage courses.</p></Link>
            </div>
        </div>
    );
};

const DashboardPanel = ({ title, items }) => (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h3 className="text-lg font-semibold">{title}</h3>
        <div className="mt-4 space-y-3">
            {items.map(([label, value]) => <div key={label} className="flex items-center justify-between border-b pb-3 last:border-0"><span className="text-sm text-gray-500">{label}</span><span className="font-semibold text-gray-900">{value ?? 0}</span></div>)}
        </div>
    </div>
);

export default AdminDashboard;