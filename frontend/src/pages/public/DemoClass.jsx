import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import {
  CalendarDays,
  Clock,
  Loader2,
  MapPin,
  Monitor,
  Users,
} from "lucide-react";

import { bookDemoClass, getDemoClasses } from "../../api/demoClass.services";
import useAuth from "../../hooks/useAuth";

const DemoClass = () => {
  const { isAuthenticated, user } = useAuth();
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["demo-classes", "scheduled"],
    queryFn: () => getDemoClasses({ status: "Scheduled" }),
    enabled: isAuthenticated,
  });

  const demoClasses = useMemo(() => data?.demoClasses || [], [data]);

  const bookingMutation = useMutation({
    mutationFn: bookDemoClass,
    onSuccess: (response) => {
      toast.success(response?.message || "Demo class booked successfully");
      queryClient.invalidateQueries({ queryKey: ["demo-classes"] });
    },
    onError: (bookingError) => {
      toast.error(
        bookingError?.response?.data?.message || "Failed to book demo class",
      );
    },
  });

  return (
    <div className="bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Demo Classes
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight">
            Try a course before enrollment.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
            Browse scheduled online and offline demo sessions, check available
            seats, and book your spot from the student account.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {!isAuthenticated ? (
          <div className="rounded-lg border border-blue-100 bg-blue-50 p-8 text-center">
            <h2 className="text-2xl font-bold text-slate-900">
              Login to view and book demos
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-slate-600">
              Demo class schedules are connected to your student profile so
              bookings and cancellations can be tracked properly.
            </p>
            <div className="mt-6 flex justify-center gap-3">
              <Link
                to="/login"
                className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-lg border border-blue-200 bg-white px-5 py-3 text-sm font-semibold text-blue-700 hover:bg-blue-50"
              >
                Create Account
              </Link>
            </div>
          </div>
        ) : isLoading ? (
          <LoaderState label="Loading demo classes..." />
        ) : isError ? (
          <ErrorState
            message={
              error?.response?.data?.message || "Failed to load demo classes."
            }
          />
        ) : demoClasses.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            {demoClasses.map((demoClass) => {
              const seatsLeft = Math.max(
                Number(demoClass.maxSeats || 0) -
                  Number(demoClass.bookedSeats || 0),
                0,
              );
              const isStudent = user?.role === "student";
              return (
                <article
                  key={demoClass._id}
                  className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-sm font-semibold text-blue-600">
                        {demoClass.course?.title || "Course demo"}
                      </p>
                      <h2 className="mt-1 text-xl font-bold text-slate-900">
                        {demoClass.title}
                      </h2>
                    </div>
                    <span className="rounded-md bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                      {seatsLeft} seats left
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-6 text-slate-600">
                    {demoClass.description ||
                      "Join this demo session to understand the course flow, instructor style, and learning outcomes."}
                  </p>

                  <div className="mt-5 grid gap-3 text-sm text-slate-700 sm:grid-cols-2">
                    <Info icon={CalendarDays}>
                      {formatDate(demoClass.date)}
                    </Info>
                    <Info icon={Clock}>
                      {demoClass.startTime} - {demoClass.endTime}
                    </Info>
                    <Info icon={demoClass.mode === "Online" ? Monitor : MapPin}>
                      {demoClass.mode}
                    </Info>
                    <Info icon={Users}>
                      {demoClass.instructor?.fullName || "Instructor"}
                    </Info>
                  </div>

                  {demoClass.mode === "Offline" && demoClass.location && (
                    <p className="mt-4 rounded-lg bg-slate-50 px-4 py-3 text-sm text-slate-600">
                      Location: {demoClass.location}
                    </p>
                  )}

                  <button
                    type="button"
                    disabled={
                      !isStudent || seatsLeft === 0 || bookingMutation.isPending
                    }
                    onClick={() => bookingMutation.mutate(demoClass._id)}
                    className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {!isStudent
                      ? "Student login required"
                      : seatsLeft === 0
                        ? "Fully Booked"
                        : bookingMutation.isPending
                          ? "Booking..."
                          : "Book Demo Class"}
                  </button>
                </article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

const Info = ({ icon: Icon, children }) => (
  <div className="flex items-center gap-2">
    <Icon size={17} className="text-blue-600" />
    <span>{children}</span>
  </div>
);
const LoaderState = ({ label }) => (
  <div className="flex items-center justify-center py-16 text-slate-500">
    <Loader2 size={22} className="mr-2 animate-spin" />
    {label}
  </div>
);
const ErrorState = ({ message }) => (
  <div className="rounded-lg border border-red-100 bg-red-50 p-6 text-sm text-red-700">
    {message}
  </div>
);
const EmptyState = () => (
  <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
    <h2 className="text-xl font-bold">No scheduled demo classes</h2>
    <p className="mt-2 text-sm text-slate-600">
      New demo sessions will appear here after instructors or admins schedule
      them.
    </p>
  </div>
);
const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      })
    : "Date not set";

export default DemoClass;
