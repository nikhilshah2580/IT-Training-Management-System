import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  Clock,
  GraduationCap,
  Loader2,
  User,
  CreditCard,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  Share2,
  Bookmark,
} from "lucide-react";

import { getCourseById } from "../../api/course.services";
import { getCourseReviews } from "../../api/review.services";
import ReviewList from "../../components/reviews/ReviewList";
import ReviewForm from "../../components/reviews/ReviewForm";
import { createEnrollment } from "../../api/enrollment.services";
import { initiateEsewaPayment } from "../../api/payment.services";
import { useSelector } from "react-redux";

const submitEsewaForm = ({ endpoint, formData }) => {
  const form = document.createElement("form");
  form.method = "POST";
  form.action = endpoint;

  Object.entries(formData).forEach(([name, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  });

  document.body.appendChild(form);
  form.submit();
};

const CourseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showReviewForm, setShowReviewForm] = useState(false);

  // AUTH USER
  const user = useSelector((state) => state.auth.user);

  // GET COURSE
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["course", id],
    queryFn: () => getCourseById(id),
    enabled: !!id,
  });

  const course = data?.course;

  const { data: reviewData, isLoading: reviewsLoading } = useQuery({
    queryKey: ["course-reviews", id],
    queryFn: () => getCourseReviews(id),
    enabled: !!id,
  });

  const reviews = reviewData?.reviews || [];

  const handleWriteReview = () => {
    if (!user) {
      toast.info("Please login to write a review");
      navigate("/login");
      return;
    }

    if (user.role !== "student") {
      toast.error("Only students can write course reviews");
      return;
    }

    setShowReviewForm(true);
  };

  // ENROLLMENT + ESEWA PAYMENT MUTATION
  const enrollMutation = useMutation({
    mutationFn: async (courseId) => {
      try {
        await createEnrollment(courseId);
      } catch (error) {
        const message = error?.response?.data?.message || "";
        if (!message.toLowerCase().includes("already enrolled")) {
          throw error;
        }
      }
      return await initiateEsewaPayment(courseId);
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries({
        queryKey: ["my-enrollments"],
      });

      if (data?.esewa?.endpoint && data?.esewa?.formData) {
        toast.success("Enrollment created. Redirecting to eSewa...");
        submitEsewaForm(data.esewa);
        return;
      }

      toast.error("eSewa payment details were not received.");
    },

    onError: (error) => {
      toast.error(
        error?.response?.data?.message || "Failed to start eSewa payment",
      );
    },
  });

  // ENROLL
  const handleEnroll = () => {
    if (!user) {
      toast.info("Please login to enroll in a course");
      navigate("/login");
      return;
    }

    if (user.role !== "student") {
      toast.error("Only students can enroll in courses");
      return;
    }

    if (!course) return;

    if (course.status !== "Active") {
      toast.error("This course is currently inactive");
      return;
    }

    enrollMutation.mutate(course._id);
  };

  // LOADING
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 size={45} className="mx-auto animate-spin text-blue-600" />
          <p className="mt-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Loading course details...
          </p>
        </div>
      </div>
    );
  }

  // ERROR
  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 bg-slate-50">
        <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-xl">
          <h1 className="text-xl font-black text-rose-600">
            Failed to load course
          </h1>
          <p className="mt-2 text-xs font-medium text-slate-500">
            {error?.response?.data?.message ||
              error?.message ||
              "Course could not be loaded"}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 rounded-2xl bg-slate-900 px-6 py-3 text-xs font-bold text-white transition hover:bg-slate-800"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // COURSE NOT FOUND
  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-slate-900">
            Course not found
          </h1>
          <button
            onClick={() => navigate("/courses")}
            className="mt-5 rounded-2xl bg-blue-600 px-6 py-3 text-xs font-bold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700"
          >
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50/50 pb-20 pt-8 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="mb-6 inline-flex items-center gap-2 rounded-xl bg-white border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 shadow-2xs transition hover:bg-slate-50 hover:text-blue-600"
        >
          <ArrowLeft size={16} />
          Back to Courses
        </button>

        {/* MAIN HERO CONTAINER */}
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-100">
          {/* COURSE BANNER / IMAGE */}
          <div className="relative flex h-72 sm:h-96 w-full items-center justify-center bg-slate-900 overflow-hidden">
            <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-slate-950/20 to-transparent z-10" />
            {course.courseImage ? (
              <img
                src={course.courseImage}
                alt={course.title}
                className="h-full w-full object-cover"
              />
            ) : (
              <GraduationCap size={80} className="text-slate-600 z-0" />
            )}

            {/* Absolute badge overlay */}
            <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-center">
              <span className="rounded-full bg-white/90 backdrop-blur-md px-4 py-1.5 text-xs font-bold text-slate-900 shadow-sm">
                {course.category || "Professional Training"}
              </span>
              <span
                className={`rounded-full px-4 py-1.5 text-xs font-bold shadow-sm backdrop-blur-md ${
                  course.status === "Active"
                    ? "bg-emerald-500/90 text-white"
                    : "bg-rose-500/90 text-white"
                }`}
              >
                {course.status}
              </span>
            </div>

            <div className="absolute bottom-6 left-6 right-6 z-20">
              <div className="flex flex-wrap gap-2 mb-3">
                {course.skillLevel && (
                  <span className="rounded-xl bg-blue-600/90 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-white shadow-sm">
                    {course.skillLevel}
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-4xl font-black tracking-tight text-white drop-shadow-md">
                {course.title}
              </h1>
            </div>
          </div>

          <div className="p-6 sm:p-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* LEFT COLUMN: DESCRIPTION & DETAILS (Takes 2 cols) */}
            <div className="lg:col-span-2 space-y-8">
              {/* METRICS GRID */}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <InfoCard
                  icon={<Clock size={18} className="text-blue-600" />}
                  label="Duration"
                  value={course.duration || "N/A"}
                />
                <InfoCard
                  icon={<CreditCard size={18} className="text-emerald-600" />}
                  label="Course Fee"
                  value={`Rs. ${course.fee?.toLocaleString() ?? 0}`}
                />
                <InfoCard
                  icon={<BookOpen size={18} className="text-purple-600" />}
                  label="Category"
                  value={course.category || "N/A"}
                />
                <InfoCard
                  icon={<User size={18} className="text-amber-600" />}
                  label="Skill Level"
                  value={course.skillLevel || "N/A"}
                />
              </div>

              {/* ABOUT SECTION */}
              <div className="rounded-2xl border border-slate-100 bg-slate-50/50 p-6 sm:p-8">
                <h2 className="text-lg font-black text-slate-900 mb-3 flex items-center gap-2">
                  <Sparkles size={18} className="text-blue-600" /> About This
                  Course
                </h2>
                <p className="text-xs sm:text-sm leading-relaxed text-slate-600 font-medium whitespace-pre-line">
                  {course.description || "No course description available."}
                </p>
              </div>

              {/* INSTRUCTOR CARD */}
              {course.instructor && (
                <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-2xs">
                  <h2 className="text-sm font-bold uppercase tracking-wider text-slate-400 mb-4">
                    Trained By Expert Mentor
                  </h2>
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 font-bold text-lg">
                      {typeof course.instructor === "object" &&
                      course.instructor.fullName ? (
                        course.instructor.fullName.charAt(0)
                      ) : (
                        <User size={24} />
                      )}
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-base">
                        {typeof course.instructor === "object"
                          ? course.instructor.fullName
                          : course.instructor}
                      </h3>
                      {typeof course.instructor === "object" &&
                        course.instructor.email && (
                          <p className="text-xs text-slate-500 font-medium mt-0.5">
                            {course.instructor.email}
                          </p>
                        )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: ACTION STICKY SIDEBAR */}
            <div className="space-y-6">
              <div className="sticky top-6 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-100 space-y-6">
                <div className="border-b border-slate-100 pb-4">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Total Investment
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-black text-slate-900">
                      Rs. {course.fee?.toLocaleString() ?? 0}
                    </span>
                    <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                      Best Value
                    </span>
                  </div>
                </div>

                {course.enrollmentDeadline && (
                  <div className="flex items-center gap-3 text-xs text-slate-600 bg-amber-50/60 border border-amber-200/60 p-3.5 rounded-2xl font-medium">
                    <CalendarDays
                      size={18}
                      className="text-amber-600 shrink-0"
                    />
                    <span>
                      Enrollment deadline:{" "}
                      <strong className="text-amber-900 block sm:inline">
                        {new Date(
                          course.enrollmentDeadline,
                        ).toLocaleDateString()}
                      </strong>
                    </span>
                  </div>
                )}

                <div className="space-y-3 pt-2">
                  {user?.role === "student" ? (
                    <button
                      type="button"
                      onClick={handleEnroll}
                      disabled={
                        enrollMutation.isPending || course.status !== "Active"
                      }
                      className="w-full rounded-2xl bg-blue-600 px-6 py-4 text-xs font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:scale-100"
                    >
                      {enrollMutation.isPending
                        ? "Opening eSewa Secure Gateway..."
                        : course.status === "Active"
                          ? "Enroll & Pay via eSewa"
                          : "Course Inactive"}
                    </button>
                  ) : !user ? (
                    <button
                      type="button"
                      onClick={() => navigate("/login")}
                      className="w-full rounded-2xl bg-blue-600 px-6 py-4 text-xs font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 hover:scale-[1.02]"
                    >
                      Login to Enroll
                    </button>
                  ) : (
                    <div className="text-center p-3 bg-slate-100 rounded-2xl text-xs font-bold text-slate-500">
                      Enrollment is restricted to student accounts.
                    </div>
                  )}

                  <div className="flex items-center justify-center gap-2 text-[11px] font-semibold text-slate-400 pt-2">
                    <ShieldCheck size={14} className="text-emerald-500" />{" "}
                    Secure eSewa & Certificate Guaranteed
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* STUDENT REVIEWS SECTION */}
        <section className="mt-12 rounded-3xl border border-slate-200/80 bg-white p-6 sm:p-10 shadow-xl shadow-slate-100">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-2xl font-black text-slate-900">
                Student Feedback & Reviews
              </h2>
              <p className="mt-1 text-xs sm:text-sm text-slate-500 font-medium">
                Verified reviews and feedback shared by enrolled course
                graduates.
              </p>
            </div>
            {user?.role === "student" && (
              <button
                type="button"
                onClick={handleWriteReview}
                className="w-fit rounded-2xl bg-slate-900 px-5 py-3 text-xs font-bold text-white shadow-md hover:bg-slate-800 transition"
              >
                Write a Review
              </button>
            )}
          </div>

          {showReviewForm && (
            <div className="mb-8 rounded-2xl bg-slate-50 border border-slate-200 p-6">
              <ReviewForm
                fixedCourseId={course._id}
                fixedCourseTitle={course.title}
                embedded
                onCancel={() => setShowReviewForm(false)}
                onSuccess={() => setShowReviewForm(false)}
              />
            </div>
          )}

          <ReviewList reviews={reviews} isLoading={reviewsLoading} />
        </section>
      </div>
    </main>
  );
};

// INFO CARD COMPONENT
const InfoCard = ({ icon, label, value }) => {
  return (
    <div className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-2xs flex flex-col justify-between hover:border-blue-200 transition">
      <div className="flex items-center gap-2 mb-2">
        <span className="p-2 rounded-xl bg-slate-50">{icon}</span>
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          {label}
        </span>
      </div>
      <p className="font-bold text-slate-900 text-sm truncate">{value}</p>
    </div>
  );
};

export default CourseDetails;
