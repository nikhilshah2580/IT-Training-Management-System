import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  Award,
  Bell,
  BookOpen,
  Briefcase,
  CalendarDays,
  ClipboardCheck,
  CreditCard,
  FileText,
  GraduationCap,
  Loader2,
  MessageSquare,
  RefreshCw,
  Star,
  UserCheck,
  Users,
} from "lucide-react";
import { getDashboard } from "../../api/dashboard.services";

const AdminDashboard = () => {
  const { data, isLoading, isError, error, refetch, isFetching } = useQuery({
    queryKey: ["admin-dashboard"],
    queryFn: getDashboard,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <Loader2 size={40} className="animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl bg-red-50 p-6 text-center">
        <p className="font-semibold text-red-700">
          {error?.response?.data?.message || "Failed to load dashboard"}
        </p>
        <button
          onClick={() => refetch()}
          className="mt-4 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white hover:bg-blue-700"
        >
          <RefreshCw size={16} /> Retry
        </button>
      </div>
    );
  }

  const dashboardData = data?.dashboard || {};

  const topStats = [
    ["Total Users", dashboardData?.users?.total ?? 0, Users],
    ["Students", dashboardData?.users?.students ?? 0, GraduationCap],
    ["Instructors", dashboardData?.users?.instructors ?? 0, UserCheck],
    ["Active Courses", dashboardData?.courses?.active ?? 0, BookOpen],
    ["Job Placements", dashboardData?.placements?.total ?? 0, Briefcase],
    ["Pending Inquiries", dashboardData?.contacts?.pending ?? 0, MessageSquare],
    ["Paid Payments", dashboardData?.payments?.successful ?? 0, CreditCard],
    ["Certificates", dashboardData?.certificates?.total ?? 0, Award],
  ];

  const dashboardSections = [
    {
      title: "Users",
      path: "/admin/users",
      icon: Users,
      items: [
        ["Total", dashboardData?.users?.total],
        ["Students", dashboardData?.users?.students],
        ["Instructors", dashboardData?.users?.instructors],
        ["Admins", dashboardData?.users?.admins],
        ["Verified", dashboardData?.users?.verified],
      ],
    },
    {
      title: "Courses",
      path: "/admin/courses",
      icon: BookOpen,
      items: [
        ["Total", dashboardData?.courses?.total],
        ["Pending", dashboardData?.courses?.pending],
        ["Active", dashboardData?.courses?.active],
        ["Inactive", dashboardData?.courses?.inactive],
        ["Rejected", dashboardData?.courses?.rejected],
      ],
    },
    {
      title: "Enrollments",
      path: "/admin/enrollments",
      icon: GraduationCap,
      items: [
        ["Total", dashboardData?.enrollments?.total],
        ["Active", dashboardData?.enrollments?.active],
        ["Completed", dashboardData?.enrollments?.completed],
      ],
    },
    {
      title: "Payments",
      path: "/admin/enrollments",
      icon: CreditCard,
      items: [
        ["Total", dashboardData?.payments?.total],
        ["Paid", dashboardData?.payments?.successful],
        ["Pending", dashboardData?.payments?.pending],
        ["Failed", dashboardData?.payments?.failed],
      ],
    },
    {
      title: "Assignments & Submissions",
      path: "/admin/attendance",
      icon: ClipboardCheck,
      items: [
        ["Assignments", dashboardData?.assignments?.total],
        ["Active", dashboardData?.assignments?.active],
        ["Closed", dashboardData?.assignments?.closed],
        ["Submissions", dashboardData?.submissions?.total],
        ["Graded", dashboardData?.submissions?.graded],
        ["Late", dashboardData?.submissions?.late],
      ],
    },
    {
      title: "Attendance",
      path: "/admin/attendance",
      icon: ClipboardCheck,
      items: [
        ["Total", dashboardData?.attendance?.total],
        ["Present", dashboardData?.attendance?.present],
        ["Absent", dashboardData?.attendance?.absent],
        ["Late", dashboardData?.attendance?.late],
      ],
    },
    {
      title: "Certificates",
      path: "/admin/certificates",
      icon: Award,
      items: [["Total", dashboardData?.certificates?.total]],
    },
    {
      title: "Resources",
      path: "/admin/courses",
      icon: FileText,
      items: [
        ["Total", dashboardData?.resources?.total],
        ["Published", dashboardData?.resources?.published],
      ],
    },
    {
      title: "Blogs",
      path: "/admin/blogs",
      icon: FileText,
      items: [
        ["Total", dashboardData?.blogs?.total],
        ["Published", dashboardData?.blogs?.published],
        ["Draft", dashboardData?.blogs?.draft],
        ["Archived", dashboardData?.blogs?.archived],
        ["Featured", dashboardData?.blogs?.featured],
      ],
    },
    {
      title: "Demo Classes",
      path: "/admin/demo-classes",
      icon: CalendarDays,
      items: [
        ["Total", dashboardData?.demoClasses?.total],
        ["Scheduled", dashboardData?.demoClasses?.scheduled],
        ["Completed", dashboardData?.demoClasses?.completed],
        ["Cancelled", dashboardData?.demoClasses?.cancelled],
      ],
    },
    {
      title: "Job Listings",
      path: "/admin/jobs",
      icon: Briefcase,
      items: [
        ["Total", dashboardData?.jobListings?.total],
        ["Published", dashboardData?.jobListings?.published],
        ["Draft", dashboardData?.jobListings?.draft],
        ["Closed", dashboardData?.jobListings?.closed],
        ["Expired", dashboardData?.jobListings?.expired],
      ],
    },
    {
      title: "Job Placements",
      path: "/admin/job-placements",
      icon: Briefcase,
      items: [
        ["Total", dashboardData?.placements?.total],
        ["Placed", dashboardData?.placements?.placed],
        ["Joined", dashboardData?.placements?.joined],
        ["Pending", dashboardData?.placements?.pending],
      ],
    },
    {
      title: "Reviews",
      path: "/admin/reviews",
      icon: Star,
      items: [
        ["Total", dashboardData?.reviews?.total],
        ["Pending", dashboardData?.reviews?.pending],
        ["Approved", dashboardData?.reviews?.approved],
        ["Rejected", dashboardData?.reviews?.rejected],
      ],
    },
    {
      title: "Testimonials",
      path: "/admin/testimonials",
      icon: MessageSquare,
      items: [
        ["Total", dashboardData?.testimonials?.total],
        ["Pending", dashboardData?.testimonials?.pending],
        ["Approved", dashboardData?.testimonials?.approved],
        ["Rejected", dashboardData?.testimonials?.rejected],
        ["Featured", dashboardData?.testimonials?.featured],
      ],
    },
    {
      title: "Instructor Profiles",
      path: "/admin/instructors",
      icon: UserCheck,
      items: [
        ["Total", dashboardData?.instructorProfiles?.total],
        ["Pending", dashboardData?.instructorProfiles?.pending],
        ["Approved", dashboardData?.instructorProfiles?.approved],
        ["Rejected", dashboardData?.instructorProfiles?.rejected],
      ],
    },
    {
      title: "Contacts",
      path: "/admin/contacts",
      icon: MessageSquare,
      items: [
        ["Total", dashboardData?.contacts?.total],
        ["Pending", dashboardData?.contacts?.pending],
      ],
    },
    {
      title: "Notifications",
      path: "/notifications",
      icon: Bell,
      items: [
        ["Total", dashboardData?.notifications?.total],
        ["Unread", dashboardData?.notifications?.unread],
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Dashboard Overview
          </h2>
          <p className="mt-1 text-gray-500">
            Here&apos;s what&apos;s happening in your training platform.
          </p>
        </div>
        <button
          onClick={() => refetch()}
          disabled={isFetching}
          className="inline-flex items-center justify-center gap-2 rounded-lg border bg-white px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw size={16} className={isFetching ? "animate-spin" : ""} />{" "}
          Refresh
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {topStats.map(([title, value, Icon]) => (
          <div key={title} className="rounded-xl border bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <p className="mt-2 text-3xl font-bold text-gray-900">{value}</p>
              </div>
              <div className="rounded-xl bg-blue-50 p-3 text-blue-600">
                <Icon size={25} />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2 2xl:grid-cols-3">
        {dashboardSections.map((section) => (
          <DashboardPanel key={section.title} {...section} />
        ))}
      </div>
    </div>
  );
};

const DashboardPanel = ({ title, items, path, icon: Icon }) => (
  <Link
    to={path}
    className="rounded-xl border bg-white p-6 shadow-sm transition hover:border-blue-200 hover:shadow-md"
  >
    <div className="flex items-center justify-between gap-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      {Icon && <Icon size={21} className="text-blue-600" />}
    </div>
    <div className="mt-4 space-y-3">
      {items.map(([label, value]) => (
        <div
          key={label}
          className="flex items-center justify-between border-b pb-3 last:border-0"
        >
          <span className="text-sm text-gray-500">{label}</span>
          <span className="font-semibold text-gray-900">{value ?? 0}</span>
        </div>
      ))}
    </div>
  </Link>
);

export default AdminDashboard;
