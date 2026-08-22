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
  Users,
  FileText,
  ExternalLink,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Star,
  Tv,
  Award,
  Video,
  FileCheck,
  Heart,
  Share2,
  UserRound,
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
  const [syllabusOpen, setSyllabusOpen] = useState(true);

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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <Loader2 size={40} className="mx-auto animate-spin text-indigo-600" />
          <p className="mt-3 text-xs font-semibold text-slate-500 uppercase tracking-wider">
            Loading course details...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4 bg-slate-50">
        <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-lg font-bold text-slate-900">
            Failed to load course
          </h1>
          <p className="mt-2 text-xs text-slate-500">
            {error?.response?.data?.message ||
              error?.message ||
              "Course could not be loaded"}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="mt-6 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-semibold text-white hover:bg-slate-800 transition"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <h1 className="text-xl font-bold text-slate-900">Course not found</h1>
          <button
            onClick={() => navigate("/courses")}
            className="mt-4 rounded-xl bg-indigo-600 px-5 py-2.5 text-xs font-semibold text-white hover:bg-indigo-700 transition"
          >
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  // Instructor Helpers
  const instructorObj =
    typeof course.instructor === "object" ? course.instructor : null;
  const instructorId = instructorObj?._id || course.instructor;
  const instructorName =
    instructorObj?.fullName ||
    (typeof course.instructor === "string" ? course.instructor : "Instructor");
  const instructorPhoto =
    instructorObj?.profilePhoto || instructorObj?.photo || "";
  const instructorInitials = instructorName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <main className="min-h-screen bg-[#F8F9FA] text-slate-800 pb-20 pt-6 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* BACK BUTTON */}
        <button
          onClick={() => navigate(-1)}
          className="mb-5 inline-flex items-center gap-2 rounded-lg bg-white border border-slate-200 px-3.5 py-1.5 text-xs font-semibold text-slate-600 shadow-2xs hover:bg-slate-50 transition"
        >
          <ArrowLeft size={14} />
          Back to Courses
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT MAIN CONTENT */}
          <div className="lg:col-span-2 space-y-8">
            {/* HERO BANNER IMAGE */}
            <div className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xs">
              <div className="relative h-64 sm:h-80 w-full bg-slate-100">
                {course.courseImage ? (
                  <img
                    src={course.courseImage}
                    alt={course.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-indigo-50">
                    <GraduationCap size={64} className="text-indigo-400" />
                  </div>
                )}
              </div>
            </div>

            {/* OVERVIEW & DESCRIPTION */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-2xs space-y-6">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block mb-1">
                  Overview
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                  {course.title}
                </h1>
              </div>

              <div>
                <h2 className="text-sm font-bold text-slate-900 mb-2">
                  Course Description
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal whitespace-pre-line">
                  {course.description || "No course description available."}
                </p>
              </div>

              {/* WHAT YOU'LL LEARN / PREREQUISITES */}
              {course.prerequisites && (
                <div className="border-t border-slate-100 pt-5">
                  <h2 className="text-sm font-bold text-slate-900 mb-3">
                    Requirements & Prerequisites
                  </h2>
                  <ul className="space-y-2 text-xs sm:text-sm text-slate-600">
                    {course.prerequisites.split("\n").map((req, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <span className="text-indigo-600 mt-1">•</span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* COURSE CONTENT / SYLLABUS */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-2xs">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-base font-bold text-slate-900">
                  Course Content
                </h2>
                <span className="text-xs text-rose-500 font-semibold">
                  {course.duration || "Self-Paced"}
                </span>
              </div>

              <div className="rounded-xl border border-slate-200 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setSyllabusOpen(!syllabusOpen)}
                  className="w-full flex items-center justify-between bg-slate-50 px-4 py-3 text-left border-b border-slate-200"
                >
                  <span className="text-xs font-bold text-slate-800">
                    Course Modules & Syllabus
                  </span>
                  {syllabusOpen ? (
                    <ChevronUp size={16} className="text-slate-500" />
                  ) : (
                    <ChevronDown size={16} className="text-slate-500" />
                  )}
                </button>

                {syllabusOpen && (
                  <div className="p-4 bg-white text-xs text-slate-700 leading-relaxed whitespace-pre-line border-t border-slate-100">
                    {course.syllabus || "No syllabus detailed for this course."}
                  </div>
                )}
              </div>
            </div>

            {/* COURSE RESOURCES */}
            {course.resources && course.resources.length > 0 && (
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-2xs">
                <h2 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <FileText size={18} className="text-indigo-600" />
                  Downloadable Resources
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                  {course.resources.map((res, index) => (
                    <a
                      key={res._id || index}
                      href={res.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-between p-3 rounded-xl border border-slate-200 hover:border-indigo-500 transition group"
                    >
                      <div>
                        <p className="text-xs font-bold text-slate-800 group-hover:text-indigo-600">
                          {res.title || "Untitled Resource"}
                        </p>
                        <span className="text-[10px] font-semibold text-slate-400 uppercase">
                          {res.type || "Resource"}
                        </span>
                      </div>
                      <ExternalLink
                        size={14}
                        className="text-slate-400 group-hover:text-indigo-600"
                      />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* ABOUT THE INSTRUCTOR */}
            {course.instructor && (
              <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-2xs">
                <h2 className="text-base font-bold text-slate-900 mb-4">
                  About the Instructor
                </h2>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    {instructorPhoto ? (
                      <img
                        src={instructorPhoto}
                        alt={instructorName}
                        className="h-14 w-14 shrink-0 rounded-full object-cover border border-slate-200 shadow-xs"
                      />
                    ) : (
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-indigo-50 text-indigo-600 font-bold border border-slate-200">
                        {instructorInitials || <User size={20} />}
                      </div>
                    )}
                    <div>
                      <h3 className="text-sm font-bold text-slate-900">
                        {instructorName}
                      </h3>
                      <p className="text-xs text-indigo-600 font-medium">
                        Course Mentor
                      </p>
                      {instructorObj?.email && (
                        <p className="text-xs text-slate-500 mt-0.5">
                          {instructorObj.email}
                        </p>
                      )}
                    </div>
                  </div>

                  {instructorId && (
                    <button
                      type="button"
                      onClick={() =>
                        navigate(`/instructor/profile/${instructorId}`)
                      }
                      className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-indigo-600 transition"
                    >
                      View Profile
                      <ExternalLink size={13} />
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* STUDENT REVIEWS SECTION */}
            <div className="rounded-2xl border border-slate-200/80 bg-white p-6 sm:p-8 shadow-2xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base font-bold text-slate-900">
                    Student Feedback
                  </h2>
                  <p className="text-xs text-slate-500">
                    Reviews from verified course students
                  </p>
                </div>
                {user?.role === "student" && (
                  <button
                    type="button"
                    onClick={handleWriteReview}
                    className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 transition"
                  >
                    Write Review
                  </button>
                )}
              </div>

              {showReviewForm && (
                <div className="mb-6 rounded-xl bg-slate-50 p-4 border border-slate-200">
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
            </div>
          </div>

          {/* RIGHT SIDEBAR - PURCHASE & FEATURES */}
          <div className="space-y-6">
            <div className="sticky top-6 rounded-2xl border border-slate-200/80 bg-white p-6 shadow-2xs space-y-6">
              {/* PRICE */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div>
                  <span className="text-2xl font-black text-emerald-500">
                    {course.fee ? `Rs. ${course.fee.toLocaleString()}` : "FREE"}
                  </span>
                </div>
              </div>

              {/* ENROLL BUTTON */}
              {user?.role === "student" ? (
                <button
                  type="button"
                  onClick={handleEnroll}
                  disabled={
                    enrollMutation.isPending || course.status !== "Active"
                  }
                  className="w-full rounded-xl bg-[#5C42BD] hover:bg-[#4c35a3] py-3 text-xs font-bold text-white shadow-md shadow-indigo-200 transition disabled:opacity-50"
                >
                  {enrollMutation.isPending
                    ? "Redirecting to eSewa..."
                    : course.status === "Active"
                      ? "Enroll Now"
                      : "Course Inactive"}
                </button>
              ) : !user ? (
                <button
                  type="button"
                  onClick={() => navigate("/login")}
                  className="w-full rounded-xl bg-[#5C42BD] hover:bg-[#4c35a3] py-3 text-xs font-bold text-white shadow-md shadow-indigo-200 transition"
                >
                  Enroll Now
                </button>
              ) : (
                <div className="text-center p-3 bg-slate-100 rounded-xl text-xs text-slate-500 font-medium">
                  Students only
                </div>
              )}

              {/* INCLUDES CHECKLIST */}
              <div className="space-y-3 border-t border-slate-100 pt-5">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Includes
                </h3>
                <ul className="space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-center gap-2">
                    <Video size={14} className="text-rose-500 shrink-0" />
                    <span>On-demand learning material</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <FileCheck size={14} className="text-indigo-500 shrink-0" />
                    <span>
                      {course.resources?.length || 0} Downloadable resources
                    </span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Award size={14} className="text-amber-500 shrink-0" />
                    <span>Certificate of Completion</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Tv size={14} className="text-rose-500 shrink-0" />
                    <span>Access on mobile and desktop</span>
                  </li>
                </ul>
              </div>

              {/* COURSE FEATURES SUMMARY */}
              <div className="space-y-3 border-t border-slate-100 pt-5">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Course Features
                </h3>
                <ul className="space-y-2.5 text-xs text-slate-600">
                  <li className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Users size={14} className="text-indigo-500" /> Enrolled:
                    </span>
                    <span className="font-semibold text-slate-800">
                      {course.totalStudents ||
                        course.enrolledStudents?.length ||
                        0}{" "}
                      students
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <Clock size={14} className="text-indigo-500" /> Duration:
                    </span>
                    <span className="font-semibold text-slate-800">
                      {course.duration || "N/A"}
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <BookOpen size={14} className="text-indigo-500" />{" "}
                      Category:
                    </span>
                    <span className="font-semibold text-slate-800">
                      {course.category || "General"}
                    </span>
                  </li>
                  <li className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <GraduationCap size={14} className="text-indigo-500" />{" "}
                      Level:
                    </span>
                    <span className="font-semibold text-slate-800">
                      {course.skillLevel || "All Levels"}
                    </span>
                  </li>
                </ul>
              </div>

              {/* DEADLINE BADGE */}
              {course.enrollmentDeadline && (
                <div className="flex items-center gap-2 text-xs text-amber-800 bg-amber-50 p-3 rounded-xl border border-amber-200">
                  <CalendarDays size={16} className="text-amber-600 shrink-0" />
                  <span>
                    Deadline:{" "}
                    <strong>
                      {new Date(course.enrollmentDeadline).toLocaleDateString()}
                    </strong>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default CourseDetails;
