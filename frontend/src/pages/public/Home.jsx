import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Award,
  Building2,
  Star,
  MessageSquareQuote,
  Clock,
  ArrowRight,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  ChevronDown,
  Database,
} from "lucide-react";

import { FaFacebookF, FaTiktok, FaInstagram } from "react-icons/fa";

import { getApprovedTestimonials } from "../../api/testimonial.services";
import { getCourses } from "../../api/course.services";
import { createContact } from "../../api/contact.services";

// Contact form initial state & options
const initialForm = {
  name: "",
  email: "",
  subject: "Course Inquiry",
  message: "",
};

const purposes = [
  "Course Inquiry",
  "Demo Class Booking",
  "Admission Support",
  "Corporate Workshop",
  "Technical Support",
  "Job Placement",
];

const contactItems = [
  {
    icon: MapPin,
    label: "Address",
    value: "Narephat-32, Koteshwor, Kathmandu",
    color:
      "from-amber-500/10 to-orange-500/10 text-orange-600 border-orange-200/60",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "9851344071",
    href: "tel:9851344071",
    color:
      "from-emerald-500/10 to-teal-500/10 text-emerald-600 border-emerald-200/60",
  },
  {
    icon: Mail,
    label: "Email",
    value: "infotech@sipalaya.com",
    href: "mailto:infotech@sipalaya.com",
    color:
      "from-blue-500/10 to-indigo-500/10 text-indigo-600 border-indigo-200/60",
  },
];

// FAQ Data structure
const faqCategories = [
  {
    name: "Courses & Learning",
    faqs: [
      {
        question: "Are there any assessments or projects during the course?",
        answer:
          "Yes. Most courses include practical assignments, mini-projects, and assessments to ensure you are building real skills, not just theoretical knowledge.",
      },
      {
        question: "Can I switch courses after enrolling?",
        answer:
          "If you feel a course isn't the right fit, please contact our team as early as possible. We will do our best to accommodate a course change based on availability and timing.",
      },
      {
        question: "What if I miss a live training session?",
        answer:
          "We provide session recordings or backup support for students who miss individual classes, ensuring you never fall behind.",
      },
    ],
  },
  {
    name: "Enrollment & Registration",
    faqs: [
      {
        question: "How do I register for a course?",
        answer:
          "You can enroll directly through our website by selecting a course or by filling out the contact form below to schedule an admission counseling session.",
      },
      {
        question: "Are there prerequisites for joining advanced courses?",
        answer:
          "Some advanced technical courses require basic programming knowledge or completion of our beginner tracks. Check individual course descriptions for specific prerequisites.",
      },
    ],
  },
  {
    name: "General",
    faqs: [
      {
        question: "Where is Sipalaya InfoTech located?",
        answer: "We are located at Narephat-32, Koteshwor, Kathmandu, Nepal.",
      },
      {
        question: "Do you provide job placement support?",
        answer:
          "Yes! We offer career counseling, resume building sessions, interview preparation, and placement assistance with our partner tech companies in Nepal.",
      },
    ],
  },
  {
    name: "Payments & Pricing",
    faqs: [
      {
        question: "What payment methods are accepted?",
        answer:
          "We accept bank transfers, digital wallets (eSewa, Khalti), and cash payments directly at our Kathmandu office.",
      },
      {
        question: "Are there installment options available?",
        answer:
          "Yes, we offer flexible split-payment options for select professional certification and long-term bootcamps.",
      },
    ],
  },
  {
    name: "Technical Support",
    faqs: [
      {
        question: "How can I get help if I run into technical problems?",
        answer:
          "You can reach out via our technical support contact purpose on this page or drop us a message through our student portal channels.",
      },
    ],
  },
];

const Home = () => {
  const navigate = useNavigate();

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");

  // Banner Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);

  // FAQ Active Category and Open Accordion States
  const [activeFaqCategory, setActiveFaqCategory] =
    useState("Courses & Learning");
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Contact Form State
  const [form, setForm] = useState(initialForm);

  // Fetch Testimonials
  const { data: testimonialData } = useQuery({
    queryKey: ["public-testimonials", { limit: 6 }],
    queryFn: () => getApprovedTestimonials({ limit: 6 }),
  });

  // Fetch Popular IT Courses from Backend
  const { data: courseData, isLoading: coursesLoading } = useQuery({
    queryKey: ["popular-courses"],
    queryFn: () => getCourses({ status: "Active" }),
  });

  // Contact Form Mutation
  const contactMutation = useMutation({
    mutationFn: createContact,
    onSuccess: (response) => {
      toast.success(response?.message || "Message sent successfully");
      setForm(initialForm);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to send message");
    },
  });

  const testimonials = testimonialData?.testimonials || [];
  const courses = courseData?.courses?.slice(0, 6) || [];

  // Banner slides configured with standard bold text
  const bannerSlides = [
    {
      badge: "Nepal's Data Science Specialists",
      titleFirst: "Data Science Training in Nepal — ",
      titleHighlight: "and the data products",
      titleRest: " we build for clients",
      description:
        "Python, machine learning, data engineering and generative AI — taught by engineers who build the same systems for clients. One domain, done to depth, with internship and placement support in Kathmandu.",
      primaryCtaText: "Explore Courses",
      primaryCtaLink: "/courses",
      secondaryCtaText: "Hire Our Data Team",
      secondaryCtaLink: "/contact",
      inquiryText: "Free Inquiry",
    },
    {
      badge: "Nepal's Software Engineering Hub",
      titleFirst: "Full Stack Development — ",
      titleHighlight: "and the web applications",
      titleRest: " we build for clients",
      description:
        "React, Node.js, Cloud deployment and DevOps — practical learning guided by senior developers building scalable client applications.",
      primaryCtaText: "Explore Courses",
      primaryCtaLink: "/courses",
      secondaryCtaText: "Hire Our Tech Team",
      secondaryCtaLink: "/contact",
      inquiryText: "Free Inquiry",
    },
    {
      badge: "Career & Certification Program",
      titleFirst: "Professional Certification — ",
      titleHighlight: "and career pathways",
      titleRest: " for your future",
      description:
        "Get guidance on industry-recognized professional certifications with complete placement assistance in Kathmandu.",
      primaryCtaText: "Explore Courses",
      primaryCtaLink: "/courses",
      secondaryCtaText: "Schedule a Demo",
      secondaryCtaLink: "/contact",
      inquiryText: "Free Inquiry",
    },
  ];

  // Auto run banner slider every 5 seconds (5000 ms)
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % bannerSlides.length);
    }, 5000);

    return () => clearInterval(slideTimer);
  }, [bannerSlides.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % bannerSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) => (prev - 1 + bannerSlides.length) % bannerSlides.length,
    );
  };

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(
      `/courses?query=${encodeURIComponent(searchQuery)}&category=${selectedCategory}&level=${selectedLevel}`,
    );
  };

  const updateContactField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleContactSubmit = (event) => {
    event.preventDefault();
    contactMutation.mutate(form);
  };

  const currentCategoryObj =
    faqCategories.find((cat) => cat.name === activeFaqCategory) ||
    faqCategories[0];

  const slide = bannerSlides[currentSlide];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* 1. Clean Banner Section (Auto-runs every 5 sec) */}
      <section className="relative overflow-hidden bg-white text-slate-900 py-16 lg:py-24 transition-all duration-500 border-b border-gray-100">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/60 px-4 py-1.5 text-xs font-semibold text-blue-600 mb-6">
              <Award size={14} /> {slide.badge}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.15]">
              {slide.titleFirst}
              <span className="text-blue-600">{slide.titleHighlight}</span>
              {slide.titleRest}
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-3xl">
              {slide.description}
            </p>

            <div className="mt-10 flex flex-wrap items-center gap-4">
              <Link
                to={slide.primaryCtaLink}
                className="rounded-xl bg-orange-500 hover:bg-orange-600 px-7 py-3.5 font-bold text-white shadow-md shadow-orange-500/20 transition-all text-sm flex items-center gap-2"
              >
                {slide.primaryCtaText} <ChevronRight size={16} />
              </Link>
              <Link
                to={slide.secondaryCtaLink}
                className="rounded-xl bg-blue-600 hover:bg-blue-700 px-7 py-3.5 font-bold text-white shadow-md shadow-blue-500/20 transition-all text-sm flex items-center gap-2"
              >
                {slide.secondaryCtaText} <Database size={16} />
              </Link>
              <Link
                to="#contact-section"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("contact-section")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="rounded-xl border border-blue-600 hover:bg-blue-50/50 px-7 py-3.5 font-bold text-blue-600 transition-all text-sm"
              >
                {slide.inquiryText}
              </Link>
            </div>
          </div>
        </div>

        {/* Carousel Indicators & Controls */}
        <div className="absolute right-6 bottom-6 flex items-center gap-2">
          <button
            onClick={prevSlide}
            className="p-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-xs transition-colors"
            aria-label="Previous Slide"
          >
            <ChevronLeft size={18} />
          </button>
          <span className="text-xs font-semibold text-slate-500 px-2">
            {currentSlide + 1} / {bannerSlides.length}
          </span>
          <button
            onClick={nextSlide}
            className="p-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 shadow-xs transition-colors"
            aria-label="Next Slide"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </section>

      {/* Search Functionality Bar */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-center"
        >
          <div className="relative md:col-span-1">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Keyword
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400">
                <Search size={16} />
              </span>
              <input
                type="text"
                placeholder="e.g. Python, Web..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 pl-9 pr-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            >
              <option value="All">All Categories</option>
              <option value="Programming">Programming</option>
              <option value="Design">Design</option>
              <option value="Data Science">Data Science & Analytics</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
              Skill Level
            </label>
            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50/50 py-2.5 px-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-600/20"
            >
              <option value="All">All Levels</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div className="flex items-end h-full">
            <button
              type="submit"
              className="w-full mt-5 md:mt-0 rounded-xl bg-blue-600 py-2.5 font-semibold text-white hover:bg-blue-700 transition-all text-sm shadow-sm flex items-center justify-center gap-2"
            >
              <Search size={16} /> Search Courses
            </button>
          </div>
        </form>
      </section>

      {/* Popular IT Courses Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div className="max-w-2xl">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-600">
                Top Rated Programs
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-gray-900 mt-2">
                Popular IT Courses in Nepal
              </h2>
              <p className="mt-2 text-gray-600 text-sm">
                Industry-focused tech training designed to jumpstart your career
                in Kathmandu and beyond.
              </p>
            </div>
            <Link
              to="/courses"
              className="mt-4 md:mt-0 inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700"
            >
              View all courses <ArrowRight size={16} />
            </Link>
          </div>

          {coursesLoading ? (
            <div className="text-center py-12 text-gray-400 text-sm animate-pulse">
              Loading popular courses...
            </div>
          ) : courses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {courses.map((course) => (
                <div
                  key={course._id}
                  className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden flex flex-col justify-between hover:shadow-xl hover:border-blue-200 transition-all duration-300 group"
                >
                  <div>
                    <div className="w-full h-48 bg-slate-900 relative overflow-hidden flex items-center justify-center">
                      {course.courseImage ? (
                        <img
                          src={course.courseImage}
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="text-center p-4">
                          <span className="text-white font-bold text-base block">
                            {course.title}
                          </span>
                        </div>
                      )}
                      <span className="absolute top-3 left-3 rounded-full bg-white/90 backdrop-blur-md px-3 py-1 text-xs font-bold text-gray-800 shadow-sm">
                        {course.category || "IT Training"}
                      </span>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center justify-between text-xs font-semibold text-gray-500 mb-2">
                        <div className="flex items-center gap-1">
                          <Clock size={14} className="text-blue-600" />
                          <span>{course.duration || "8 Weeks"}</span>
                        </div>
                        {course.skillLevel && (
                          <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded-md text-[11px]">
                            {course.skillLevel}
                          </span>
                        )}
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                        {course.title}
                      </h3>
                      <p className="text-gray-600 text-xs leading-relaxed line-clamp-2">
                        {course.description}
                      </p>
                    </div>
                  </div>

                  <div className="p-6 pt-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/50">
                    <div>
                      <span className="text-[10px] text-gray-400 block font-bold uppercase tracking-wider">
                        Investment
                      </span>
                      <span className="text-sm font-bold text-gray-900">
                        NPR {course.fee?.toLocaleString()}
                      </span>
                    </div>
                    <Link
                      to={`/course/${course._id}`}
                      className="inline-flex items-center gap-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-xl shadow-sm transition-colors"
                    >
                      View Details <ChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-2xl border border-gray-100 text-sm">
              No active courses available right now. Please check back later!
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gray-50/50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Core Services & Excellence
            </h2>
            <p className="mt-4 text-gray-600">
              Everything you need to accelerate your career in the technology
              sector in Nepal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="inline-flex p-3 rounded-xl bg-blue-100 text-blue-600 mb-6">
                <BookOpen size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                IT Training
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Practical, real-world instruction covering software development,
                web engineering, UI/UX, and cloud technologies.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="inline-flex p-3 rounded-xl bg-indigo-100 text-indigo-600 mb-6">
                <Award size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Certification Preparation
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Dedicated test prep and certification paths designed to validate
                your expertise with top industry standards.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-100 bg-white p-8 shadow-sm hover:shadow-md transition-shadow">
              <div className="inline-flex p-3 rounded-xl bg-emerald-100 text-emerald-600 mb-6">
                <Building2 size={24} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Corporate Workshops
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                Customized training programs designed for corporate teams
                looking to upskill and adopt modern tech stacks.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* IT Training FAQs Section */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              IT Training FAQs
            </h2>
            <div className="w-48 h-1 bg-emerald-700 mx-auto mt-2 mb-3 rounded-full"></div>
            <p className="text-sm text-gray-600">
              Common questions about courses, certificates, internships, and
              counseling at Sipalaya InfoTech in Nepal.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
            {/* FAQ Category Sidebar */}
            <div className="bg-white border border-gray-200 rounded-2xl p-3 shadow-xs space-y-1">
              {faqCategories.map((cat) => {
                const isActive = activeFaqCategory === cat.name;
                return (
                  <button
                    key={cat.name}
                    onClick={() => {
                      setActiveFaqCategory(cat.name);
                      setOpenFaqIndex(0);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-emerald-800 text-white shadow-sm"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    {cat.name}
                  </button>
                );
              })}
            </div>

            {/* FAQ Accordion List */}
            <div className="lg:col-span-3 space-y-4">
              <div className="flex justify-end mb-2">
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === -1 ? 0 : -1)}
                  className="text-xs font-semibold text-emerald-800 hover:underline"
                >
                  {openFaqIndex === -1 ? "Expand all" : "Collapse all"}
                </button>
              </div>

              {currentCategoryObj.faqs.map((faq, index) => {
                const isOpen = openFaqIndex === index;
                return (
                  <div
                    key={index}
                    className="border border-gray-200/80 rounded-2xl bg-white shadow-xs overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? -1 : index)}
                      className="w-full flex items-center justify-between p-5 text-left font-bold text-gray-900 hover:text-emerald-800 transition-colors"
                    >
                      <span className="text-base">{faq.question}</span>
                      <span
                        className={`p-1.5 rounded-full bg-emerald-50 text-emerald-800 transition-transform duration-300 ${
                          isOpen ? "rotate-180" : ""
                        }`}
                      >
                        <ChevronDown size={16} />
                      </span>
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 text-sm text-gray-600 leading-relaxed border-t border-gray-100 pt-4">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {testimonials.length > 0 && (
        <section className="bg-gray-50/50 py-20 border-t border-gray-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mb-12 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
                  Student Testimonials
                </p>
                <h2 className="mt-2 text-3xl font-bold text-gray-900">
                  Stories from our learners
                </h2>
              </div>
              <Link
                to="/student/testimonials/create"
                className="inline-flex w-fit items-center gap-2 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700"
              >
                <MessageSquareQuote size={16} /> Share Your Story
              </Link>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((item) => {
                const studentName = item.student?.fullName || "Student";
                const initials = studentName
                  .split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2)
                  .toUpperCase();

                return (
                  <article
                    key={item._id}
                    className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm"
                  >
                    <div className="flex items-center gap-3">
                      {item.student?.photo ? (
                        <img
                          src={item.student.photo}
                          alt={studentName}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                          {initials || "ST"}
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-gray-900">
                          {studentName}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {item.course?.title || "Verified learner"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-1 text-yellow-500">
                      {Array.from({ length: Number(item.rating || 0) }).map(
                        (_, index) => (
                          <Star key={index} size={16} fill="currentColor" />
                        ),
                      )}
                    </div>

                    <p className="mt-4 text-sm leading-6 text-gray-600">
                      {item.message}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section at the Bottom */}
      <div
        id="contact-section"
        className="bg-slate-50/50 text-slate-900 border-t border-gray-100 py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12">
          <div className="text-center max-w-3xl mx-auto">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600">
              Get in Touch
            </span>
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-2">
              Ask about courses, admissions, workshops, or support.
            </h2>
            <p className="mt-2 text-slate-600 text-sm">
              Send your inquiry and the Sipalaya InfoTech team will follow up
              with course guidance, demo details, or technical help.
            </p>
          </div>
        </div>

        {/* MAIN CONTACT GRID */}
        <section className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          {/* LEFT COLUMN: INFO & MAP */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="rounded-3xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-xs hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">
                Reach us directly
              </h3>
              <div className="mt-6 space-y-5">
                {contactItems.map(
                  ({ icon: Icon, label, value, href, color }) => (
                    <div
                      key={label}
                      className="group flex items-center gap-4 transition"
                    >
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br border shadow-2xs transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 ${color}`}
                      >
                        <Icon size={20} />
                      </div>
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                          {label}
                        </p>
                        {href ? (
                          <a
                            href={href}
                            className="text-sm md:text-base font-bold text-slate-800 transition hover:text-indigo-600"
                          >
                            {value}
                          </a>
                        ) : (
                          <p className="text-sm md:text-base font-bold text-slate-800">
                            {value}
                          </p>
                        )}
                      </div>
                    </div>
                  ),
                )}
              </div>
            </motion.div>

            {/* SOCIAL LINKS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="rounded-3xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-xs hover:shadow-xl transition-shadow duration-300"
            >
              <h3 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight mb-4">
                Social links
              </h3>
              <div className="flex flex-wrap gap-3">
                <SocialLink href="https://facebook.com" icon={FaFacebookF}>
                  Facebook
                </SocialLink>
                <SocialLink href="https://instagram.com" icon={FaInstagram}>
                  Instagram
                </SocialLink>
                <SocialLink href="https://tiktok.com" icon={FaTiktok}>
                  TikTok
                </SocialLink>
              </div>
            </motion.div>

            {/* MAP CONTAINER */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
              className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xs p-2 hover:shadow-xl transition-shadow duration-300"
            >
              <iframe
                title="Sipalaya InfoTech location"
                src="https://www.google.com/maps?q=Narephat%2032%20Koteshwor%20Kathmandu&output=embed"
                className="h-72 w-full rounded-2xl contrast-125 hover:grayscale-0 transition duration-500"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </motion.div>
          </div>

          {/* RIGHT COLUMN: CONTACT FORM */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            onSubmit={handleContactSubmit}
            className="rounded-3xl border border-slate-200/80 bg-white p-6 md:p-10 shadow-xl shadow-indigo-500/5 space-y-6"
          >
            <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-tr from-indigo-600 via-purple-600 to-pink-600 text-white shadow-md shadow-indigo-500/20">
                <MessageSquare size={22} />
              </div>
              <div>
                <h3 className="text-lg md:text-xl font-bold text-slate-900">
                  Send an inquiry
                </h3>
                <p className="text-xs md:text-sm text-slate-400 font-medium">
                  We usually respond within one working day.
                </p>
              </div>
            </div>

            <div className="grid gap-5">
              <Field label="Full name">
                <input
                  required
                  name="name"
                  value={form.name}
                  onChange={updateContactField}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                  placeholder="Your name"
                />
              </Field>

              <Field label="Email address">
                <input
                  required
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={updateContactField}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                  placeholder="you@example.com"
                />
              </Field>

              <Field label="Purpose">
                <select
                  name="subject"
                  value={form.subject}
                  onChange={updateContactField}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                >
                  {purposes.map((purpose) => (
                    <option key={purpose} value={purpose}>
                      {purpose}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Message">
                <textarea
                  required
                  name="message"
                  value={form.message}
                  onChange={updateContactField}
                  rows={5}
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                  placeholder="Tell us what you need help with..."
                />
              </Field>
            </div>

            <button
              type="submit"
              disabled={contactMutation.isPending}
              className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:scale-[1.01] hover:shadow-pink-500/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Send size={17} />
              {contactMutation.isPending
                ? "Sending message..."
                : "Send Message"}
            </button>
          </motion.form>
        </section>
      </div>
    </div>
  );
};

const Field = ({ label, children }) => (
  <label className="block">
    <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
      {label}
    </span>
    {children}
  </label>
);

const SocialLink = ({ href, icon: Icon, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="group inline-flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-slate-50/50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50/30 hover:text-indigo-600 active:scale-95"
  >
    <Icon size={17} className="transition group-hover:scale-110" />
    {children}
  </a>
);

export default Home;
