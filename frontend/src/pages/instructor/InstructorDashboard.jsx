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
  UploadCloud,
  CheckCircle2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

import { getInstructorDashboard } from "../../api/dashboard.services";

const InstructorDashboard = () => {
  const navigate = useNavigate();

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getInstructorDashboard();
        setDashboard(response?.dashboard || null);
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

  const statsData = dashboard?.stats || {};
  const courses = dashboard?.recentCourses || [];
  const submissions = dashboard?.recentSubmissions || [];

  const stats = [
    {
      title: "Total Courses",
      value: statsData.totalCourses || 0,
      icon: BookOpen,
      path: "/instructor/courses",
    },
    {
      title: "Active Courses",
      value: statsData.activeCourses || 0,
      icon: CheckCircle2,
      path: "/instructor/courses",
    },
    {
      title: "Active Students",
      value: statsData.totalStudents || 0,
      icon: Users,
      path: "/instructor/courses",
    },
    {
      title: "Assignments",
      value: statsData.totalAssignments || 0,
      icon: ClipboardList,
      path: "/instructor/assignments",
    },
    {
      title: "Resources",
      value: statsData.totalResources || 0,
      icon: FileText,
      path: "/instructor/resources",
    },
    {
      title: "Certificates",
      value: statsData.totalCertificates || 0,
      icon: Award,
      path: "/instructor/certificates",
    },
    {
      title: "Submissions",
      value: statsData.totalSubmissions || 0,
      icon: UploadCloud,
      path: "/instructor/assignments",
    },
    {
      title: "Need Review",
      value: statsData.pendingSubmissions || 0,
      icon: ClipboardList,
      path: "/instructor/assignments",
    },
  ];

  if (loading) {
    return (
      <div className="flex min-h-100 items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={35} className="animate-spin text-blue-600" />
          <p className="text-sm text-slate-500">
            Loading instructor dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Instructor Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage your courses, students, assignments and learning resources.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/instructor/courses/create")}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Plus size={18} />
          Create Course
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

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
              <p className="mt-4 text-sm text-slate-500">{stat.title}</p>
              <h2 className="mt-1 text-2xl font-bold text-slate-800">
                {stat.value}
              </h2>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-800">
            Quick Actions
          </h2>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <QuickAction
              icon={BookOpen}
              title="Create Course"
              description="Add a new training course"
              onClick={() => navigate("/instructor/courses/create")}
            />
            <QuickAction
              icon={ClipboardList}
              title="Create Assignment"
              description="Give students new work"
              onClick={() => navigate("/instructor/assignments/create")}
            />
            <QuickAction
              icon={FileText}
              title="Manage Resources"
              description="Manage course materials"
              onClick={() => navigate("/instructor/resources")}
            />
            <QuickAction
              icon={Award}
              title="Certificates"
              description="Manage student certificates"
              onClick={() => navigate("/instructor/certificates")}
            />
          </div>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">My Courses</h2>
            <button
              type="button"
              onClick={() => navigate("/instructor/courses")}
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              View All
            </button>
          </div>

          <div className="mt-4 space-y-3">
            {courses.length === 0 ? (
              <EmptyCourses
                onCreate={() => navigate("/instructor/courses/create")}
              />
            ) : (
              courses.map((course) => (
                <div
                  key={course._id || course.id}
                  className="flex items-center justify-between rounded-lg border p-3"
                >
                  <div className="min-w-0">
                    <p className="truncate font-medium text-slate-800">
                      {course.title || "Untitled Course"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {course.status || "Pending"} ·{" "}
                      {Number(
                        course.totalStudents ||
                          course.enrolledStudents?.length ||
                          0,
                      )}{" "}
                      students
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      navigate(
                        `/instructor/courses/${course._id || course.id}/edit`,
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

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-800">
            Recent Submissions
          </h2>
          <button
            type="button"
            onClick={() => navigate("/instructor/assignments")}
            className="text-sm font-medium text-blue-600 hover:underline"
          >
            View Assignments
          </button>
        </div>

        <div className="mt-4 space-y-3">
          {submissions.length === 0 ? (
            <div className="rounded-lg bg-slate-50 p-6 text-center text-sm text-slate-500">
              No student submissions yet.
            </div>
          ) : (
            submissions.map((submission) => (
              <div
                key={submission._id}
                className="flex flex-col gap-2 rounded-lg border p-3 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-800">
                    {submission.assignment?.title || "Assignment"}
                  </p>
                  <p className="text-xs text-slate-500">
                    {submission.student?.fullName || "Student"} ·{" "}
                    {submission.assignment?.course?.title || "Course"}
                  </p>
                </div>
                <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                  {submission.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

const QuickAction = ({ icon: Icon, title, description, onClick }) => (
  <button
    type="button"
    onClick={onClick}
    className="flex items-center gap-3 rounded-lg border p-4 text-left transition hover:border-blue-500 hover:bg-blue-50"
  >
    <Icon size={20} className="text-blue-600" />
    <div>
      <p className="font-medium text-slate-800">{title}</p>
      <p className="text-xs text-slate-500">{description}</p>
    </div>
  </button>
);

const EmptyCourses = ({ onCreate }) => (
  <div className="rounded-lg bg-slate-50 p-6 text-center">
    <BookOpen size={30} className="mx-auto text-slate-400" />
    <p className="mt-2 text-sm text-slate-500">
      You have not created any courses yet.
    </p>
    <button
      type="button"
      onClick={onCreate}
      className="mt-3 text-sm font-semibold text-blue-600"
    >
      Create your first course
    </button>
  </div>
);

export default InstructorDashboard;
