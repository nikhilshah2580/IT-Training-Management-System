import { Users, GraduationCap, BookOpen, Briefcase, UserCheck, MessageSquare } from "lucide-react";

const statistics = [
    {
        title: "Total Users",
        value: "0",
        icon: Users,
    },
    {
        title: "Students",
        value: "0",
        icon: GraduationCap,
    },
    {
        title: "Instructors",
        value: "0",
        icon: UserCheck,
    },
    {
        title: "Courses",
        value: "0",
        icon: BookOpen,
    },
    {
        title: "Job Placements",
        value: "0",
        icon: Briefcase,
    },
    {
        title: "New Inquiries",
        value: "0",
        icon: MessageSquare,
    },
];

const AdminDashboard = () => {
    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>

                <p className="mt-1 text-gray-500">Here's what's happening in your training platform.</p>
            </div>

            {/* Statistics */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {statistics.map((item) => {
                    const Icon = item.icon;

                    return (
                        <div key={item.title} className="rounded-xl border bg-white p-5 shadow-sm">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-500">{item.title}</p>

                                    <p className="mt-2 text-3xl font-bold text-gray-900">{item.value}</p>
                                </div>

                                <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                                    <Icon size={25} />
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Dashboard Sections */}
            <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Enrollments */}
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Recent Enrollments</h3>

                        <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View All</button>
                    </div>

                    <div className="mt-6 flex min-h-40 items-center justify-center">
                        <p className="text-sm text-gray-500">No recent enrollments</p>
                    </div>
                </div>

                {/* Recent Job Placements */}
                <div className="rounded-xl border bg-white p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">Recent Job Placements</h3>

                        <button className="text-sm font-medium text-blue-600 hover:text-blue-700">View All</button>
                    </div>

                    <div className="mt-6 flex min-h-40 items-center justify-center">
                        <p className="text-sm text-gray-500">No recent job placements</p>
                    </div>
                </div>
            </div>

            {/* System Activity */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
                <h3 className="text-lg font-semibold">System Activity</h3>

                <div className="mt-6 flex min-h-32 items-center justify-center">
                    <p className="text-sm text-gray-500">No recent activity</p>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
