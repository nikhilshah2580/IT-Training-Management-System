import { useMemo } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  CalendarDays,
  Clock,
  Loader2,
  MapPin,
  Monitor,
  Users,
  Sparkles,
  Lock,
  AlertCircle,
  CalendarCheck,
} from "lucide-react";

import { bookDemoClass, getDemoClasses } from "../../api/demoClass.services";
import useAuth from "../../hooks/useAuth";
import PublicPageHero from "../../components/common/PublicPageHero";

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
    <div className="min-h-screen bg-slate-50/50 text-slate-900 pb-20">
      <PublicPageHero
        title="Experience Learning"
        accent="First"
        description="Join a live demo session, meet your instructor, and see how practical learning can shape your next career move."
      />

      {/* MAIN CONTENT SECTION */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {!isAuthenticated ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="rounded-3xl border border-indigo-200/60 bg-white p-8 md:p-12 text-center shadow-xs"
          >
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-200/60 mb-4">
              <Lock size={24} />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
              Login to view and book demos
            </h2>
            <p className="mx-auto mt-2 max-w-xl text-sm leading-relaxed text-slate-500 font-medium">
              Demo class schedules are connected to your student profile so
              bookings and cancellations can be tracked properly.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-2xl bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-3 text-sm font-bold text-white shadow-md shadow-indigo-500/20 transition hover:scale-[1.02]"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="inline-flex items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 shadow-2xs transition hover:bg-slate-50"
              >
                Create Account
              </Link>
            </div>
          </motion.div>
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
            {demoClasses.map((demoClass, index) => {
              const seatsLeft = Math.max(
                Number(demoClass.maxSeats || 0) -
                  Number(demoClass.bookedSeats || 0),
                0,
              );
              const isStudent = user?.role === "student";
              return (
                <motion.article
                  key={demoClass._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-xs hover:shadow-xl transition-all duration-300"
                >
                  <div>
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div>
                        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 uppercase tracking-wider mb-1">
                          <Sparkles size={12} />{" "}
                          {demoClass.course?.title || "Course demo"}
                        </span>
                        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
                          {demoClass.title}
                        </h2>
                      </div>
                      <span className="rounded-xl border border-emerald-200/60 bg-emerald-50/50 px-3 py-1 text-xs font-bold text-emerald-700">
                        {seatsLeft} seats left
                      </span>
                    </div>

                    <p className="mt-3 text-sm leading-relaxed text-slate-600 font-medium">
                      {demoClass.description ||
                        "Join this demo session to understand the course flow, instructor style, and learning outcomes."}
                    </p>

                    <div className="mt-6 grid gap-3 text-sm text-slate-700 sm:grid-cols-2 border-t border-slate-100 pt-5">
                      <Info icon={CalendarDays}>
                        {formatDate(demoClass.date)}
                      </Info>
                      <Info icon={Clock}>
                        {demoClass.startTime} - {demoClass.endTime}
                      </Info>
                      <Info
                        icon={demoClass.mode === "Online" ? Monitor : MapPin}
                      >
                        {demoClass.mode}
                      </Info>
                      <Info icon={Users}>
                        {demoClass.instructor?.fullName || "Instructor"}
                      </Info>
                    </div>

                    {demoClass.mode === "Offline" && demoClass.location && (
                      <p className="mt-4 rounded-2xl border border-slate-200/60 bg-slate-50/50 px-4 py-3 text-xs font-semibold text-slate-600">
                        Location: {demoClass.location}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    disabled={
                      !isStudent || seatsLeft === 0 || bookingMutation.isPending
                    }
                    onClick={() => bookingMutation.mutate(demoClass._id)}
                    className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition hover:scale-[1.01] active:scale-95 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:scale-100"
                  >
                    {!isStudent
                      ? "Student login required"
                      : seatsLeft === 0
                        ? "Fully Booked"
                        : bookingMutation.isPending
                          ? "Booking..."
                          : "Book Demo Class"}
                  </button>
                </motion.article>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

const Info = ({ icon: Icon, children }) => (
  <span className="inline-flex items-center gap-2 font-medium text-slate-600">
    <Icon size={16} className="text-indigo-600 shrink-0" />
    <span>{children}</span>
  </span>
);

const LoaderState = ({ label }) => (
  <div className="flex items-center justify-center py-20 text-slate-500 font-semibold">
    <Loader2 size={22} className="mr-2 animate-spin text-indigo-600" />
    {label}
  </div>
);

const ErrorState = ({ message }) => (
  <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-sm font-medium text-red-700 flex items-center gap-3">
    <AlertCircle size={18} className="shrink-0 text-red-600" />
    <span>{message}</span>
  </div>
);

const EmptyState = () => (
  <div className="rounded-3xl border border-slate-200/80 bg-white p-12 text-center shadow-xs">
    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500/10 to-purple-500/10 text-indigo-600 border border-indigo-200/60 mb-4">
      <CalendarCheck size={24} />
    </div>
    <h2 className="text-lg font-bold text-slate-900">
      No scheduled demo classes
    </h2>
    <p className="mt-1 text-sm text-slate-500 font-medium">
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
