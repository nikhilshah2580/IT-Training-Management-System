import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
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
  Phone,
  ChevronDown,
  Database,
  MessageSquare,
  Send,
  Users,
  Target,
  Briefcase,
  CheckCircle,
  BarChart3,
  BrainCircuit,
  Sparkles,
  ScanText,
  Server,
  Code2,
  Layers,
  Cloud,
} from "lucide-react";

import { getApprovedTestimonials } from "../../api/testimonial.services";
import { getCourses } from "../../api/course.services";
import { createContact } from "../../api/contact.services";

// Helper component for Contact Form
const Field = ({ label, children }) => (
  <div>
    <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
      {label}
    </label>
    {children}
  </div>
);

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
    value: "gyantech@gmail.com",
    href: "mailto:gyantech@gmail.com",
    color:
      "from-blue-500/10 to-indigo-500/10 text-indigo-600 border-indigo-200/60",
  },
];

// Why Choose GyanTech values
const values = [
  {
    icon: Target,
    title: "Practical Focus",
    text: "We prioritize real-world projects and hands-on experience over purely theoretical lectures.",
    accent: "hover:border-blue-400 hover:shadow-blue-500/10",
    iconBg:
      "bg-blue-50 group-hover:bg-blue-600 group-hover:text-white border-blue-100",
    iconColor: "text-blue-600",
  },
  {
    icon: Users,
    title: "Expert Mentors",
    text: "Learn directly from active industry software engineers and data scientists.",
    accent: "hover:border-indigo-400 hover:shadow-indigo-500/10",
    iconBg:
      "bg-indigo-50 group-hover:bg-indigo-600 group-hover:text-white border-indigo-100",
    iconColor: "text-indigo-600",
  },
  {
    icon: Briefcase,
    title: "Placement Support",
    text: "Resume preparation, interview preparation, and direct job recommendations with partner firms.",
    accent: "hover:border-emerald-400 hover:shadow-emerald-500/10",
    iconBg:
      "bg-emerald-50 group-hover:bg-emerald-600 group-hover:text-white border-emerald-100",
    iconColor: "text-emerald-600",
  },
  {
    icon: CheckCircle,
    title: "Updated Curriculum",
    text: "Courses constantly adapted to match shifting market trends and modern tech stacks.",
    accent: "hover:border-amber-400 hover:shadow-amber-500/10",
    iconBg:
      "bg-amber-50 group-hover:bg-amber-500 group-hover:text-white border-amber-100",
    iconColor: "text-amber-600",
  },
  {
    icon: BookOpen,
    title: "Small Class Sizes",
    text: "Ensuring individual guidance, regular code reviews, and personal attention for each student.",
    accent: "hover:border-purple-400 hover:shadow-purple-500/10",
    iconBg:
      "bg-purple-50 group-hover:bg-purple-600 group-hover:text-white border-purple-100",
    iconColor: "text-purple-600",
  },
  {
    icon: Award,
    title: "Recognized Certificate",
    text: "Gain course completion credentials valued by hiring partners across Nepal.",
    accent: "hover:border-rose-400 hover:shadow-rose-500/10",
    iconBg:
      "bg-rose-50 group-hover:bg-rose-600 group-hover:text-white border-rose-100",
    iconColor: "text-rose-600",
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
        question: "Where is GyanTech located?",
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
  // FAQ Active Category and Open Accordion States
  const [activeFaqCategory, setActiveFaqCategory] =
    useState("Courses & Learning");
  const [openFaqIndex, setOpenFaqIndex] = useState(0);

  // Mobile Touch Hover States
  const [hoveredCoreService, setHoveredCoreService] = useState(null);
  const [hoveredWhyChoose, setHoveredWhyChoose] = useState(null);

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

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleContactSubmit = (event) => {
    event.preventDefault();
    contactMutation.mutate(form);
  };

  const testimonials = testimonialData?.testimonials || [];
  const courses = courseData?.courses?.slice(0, 6) || [];

  const currentCategoryObj =
    faqCategories.find((cat) => cat.name === activeFaqCategory) ||
    faqCategories[0];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* 1. Clean Static Banner Section */}
      <section className="relative overflow-hidden bg-white text-slate-900 py-16 lg:py-24 border-b border-gray-100">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/60 px-4 py-1.5 text-xs font-semibold text-blue-600 mb-6">
              <Award size={14} /> Nepal's Full Stack MERN Specialists
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-[1.15]">
              Full Stack MERN Training in Nepal —{" "}
              <span className="text-blue-600">and the web applications</span> we
              build for clients
            </h1>

            <p className="mt-6 text-base sm:text-lg text-slate-600 leading-relaxed font-normal max-w-3xl mx-auto">
              Python, machine learning, data engineering and generative AI —
              taught by engineers who build the same systems for clients. One
              domain, done to depth, with internship and placement support in
              Kathmandu.
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/courses"
                className="rounded-xl bg-orange-500 hover:bg-orange-600 px-7 py-3.5 font-bold text-white shadow-md shadow-orange-500/20 transition-all text-sm flex items-center gap-2"
              >
                Explore Courses <ChevronRight size={16} />
              </Link>
              <Link
                to="/contact"
                className="rounded-xl bg-blue-600 hover:bg-blue-700 px-7 py-3.5 font-bold text-white shadow-md shadow-blue-500/20 transition-all text-sm flex items-center gap-2"
              >
                Hire Our Mern Team <Database size={16} />
              </Link>
              <a
                href="#contact-section"
                onClick={(e) => {
                  e.preventDefault();
                  document
                    .getElementById("contact-section")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="rounded-xl border border-blue-600 hover:bg-blue-50/50 px-7 py-3.5 font-bold text-blue-600 transition-all text-sm"
              >
                Free Inquiry
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Popular IT Courses Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mt-2">
              Popular IT Courses
            </h2>
            <div className="w-40 h-1 bg-emerald-700 mx-auto mt-3 rounded-full"></div>
          </div>

          {coursesLoading ? (
            <div className="text-center py-12 text-gray-400 text-sm animate-pulse">
              Loading popular courses...
            </div>
          ) : courses.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {courses.map((course) => (
                  <div
                    key={course._id}
                    className="bg-white border border-gray-200/80 rounded-2xl overflow-hidden flex flex-col justify-between hover:shadow-xl hover:border-blue-200 transition-all duration-300 group text-left"
                  >
                    <div>
                      <Link
                        to={`/course/${course._id}`}
                        className="block cursor-pointer"
                      >
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
                      </Link>

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
              <div className="mt-10 text-center">
                <Link
                  to="/courses"
                  className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700 border border-blue-200 rounded-xl px-5 py-2.5 hover:bg-blue-50 transition-colors"
                >
                  View all courses <ArrowRight size={16} />
                </Link>
              </div>
            </>
          ) : (
            <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-2xl border border-gray-100 text-sm">
              No active courses available right now. Please check back later!
            </div>
          )}
        </div>
      </section>

      {/* 3. Core Services & Excellence Section */}
      <section className="py-20 bg-gray-50/50 border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 mt-2">
              Core Services & Excellence
            </h2>
            <div className="w-40 h-1 bg-emerald-700 mx-auto mt-3 rounded-full"></div>
            <p className="mt-4 text-gray-600">
              Everything you need to accelerate your career in the technology
              sector in Nepal.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: IT Training (Blue Theme) */}
            <div
              className={`group rounded-2xl border bg-white p-8 shadow-sm text-center flex flex-col items-center transition-all duration-300 cursor-pointer ${
                hoveredCoreService === 0
                  ? "shadow-2xl shadow-blue-500/10 border-blue-400 -translate-y-2"
                  : "border-gray-100 hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-400 hover:-translate-y-2"
              }`}
              onTouchStart={() => setHoveredCoreService(0)}
              onTouchEnd={() => setHoveredCoreService(null)}
              onMouseEnter={() => setHoveredCoreService(0)}
              onMouseLeave={() => setHoveredCoreService(null)}
            >
              <div className={`inline-flex p-3 rounded-xl border mb-6 transition-colors duration-300 ${
                hoveredCoreService === 0
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-blue-50 text-blue-600 border-blue-100 group-hover:bg-blue-600 group-hover:text-white"
              }`}>
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

            {/* Card 2: Certification Prep (Indigo Theme) */}
            <div
              className={`group rounded-2xl border bg-white p-8 shadow-sm text-center flex flex-col items-center transition-all duration-300 cursor-pointer ${
                hoveredCoreService === 1
                  ? "shadow-2xl shadow-indigo-500/10 border-indigo-400 -translate-y-2"
                  : "border-gray-100 hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-400 hover:-translate-y-2"
              }`}
              onTouchStart={() => setHoveredCoreService(1)}
              onTouchEnd={() => setHoveredCoreService(null)}
              onMouseEnter={() => setHoveredCoreService(1)}
              onMouseLeave={() => setHoveredCoreService(null)}
            >
              <div className={`inline-flex p-3 rounded-xl border mb-6 transition-colors duration-300 ${
                hoveredCoreService === 1
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-indigo-50 text-indigo-600 border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white"
              }`}>
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

            {/* Card 3: Corporate Workshops (Emerald Theme) */}
            <div
              className={`group rounded-2xl border bg-white p-8 shadow-sm text-center flex flex-col items-center transition-all duration-300 cursor-pointer ${
                hoveredCoreService === 2
                  ? "shadow-2xl shadow-emerald-500/10 border-emerald-400 -translate-y-2"
                  : "border-gray-100 hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-400 hover:-translate-y-2"
              }`}
              onTouchStart={() => setHoveredCoreService(2)}
              onTouchEnd={() => setHoveredCoreService(null)}
              onMouseEnter={() => setHoveredCoreService(2)}
              onMouseLeave={() => setHoveredCoreService(null)}
            >
              <div className={`inline-flex p-3 rounded-xl border mb-6 transition-colors duration-300 ${
                hoveredCoreService === 2
                  ? "bg-emerald-600 text-white border-emerald-600"
                  : "bg-emerald-50 text-emerald-600 border-emerald-100 group-hover:bg-emerald-600 group-hover:text-white"
              }`}>
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

      {/* 4. Why Choose GyanTech Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto border-t border-gray-100">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mt-2">
            Why Choose <span className="text-blue-600">GyanTech ?</span>
          </h2>
          <div className="w-50 h-1 bg-emerald-700 mx-auto mt-3 rounded-full"></div>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-medium">
            Training that respects the learner and aligns directly with current
            workplace demands.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                onTouchStart={() => setHoveredWhyChoose(idx)}
                onTouchEnd={() => setHoveredWhyChoose(null)}
                onMouseEnter={() => setHoveredWhyChoose(idx)}
                onMouseLeave={() => setHoveredWhyChoose(null)}
                className={`group relative rounded-3xl border bg-white p-7 shadow-xs transition-all duration-300 flex flex-col justify-between text-left cursor-pointer ${
                  hoveredWhyChoose === idx
                    ? `${item.accent} -translate-y-1 shadow-2xl`
                    : `border-slate-200/80 hover:-translate-y-1 hover:shadow-2xl ${item.accent}`
                }`}
              >
                <div>
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-2xl border transition-all duration-300 mb-5 ${
                      hoveredWhyChoose === idx
                        ? item.iconBg.replace("group-hover:", "")
                        : item.iconBg
                    }`}
                  >
                    <IconComponent size={22} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-slate-900 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600 font-medium">
                    {item.text}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 4. Data & AI Services Section */}
      <section className="py-20 bg-slate-900 text-white border-t border-slate-800 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
              Enterprise Solutions
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white mt-4">
              Data & AI Services
            </h2>
            <div className="w-24 h-1 bg-emerald-500 mx-auto mt-3 rounded-full"></div>
            <p className="mt-4 text-slate-300 text-base sm:text-lg leading-relaxed">
              We build data products for businesses. The engineers who teach our
              courses deliver production data work for clients — machine
              learning models, data pipelines, BI dashboards, generative-AI
              systems, websites, mobile apps, and custom software.
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* 1. Data Analytics & BI Dashboards */}
            <div className="group rounded-2xl border border-slate-800 bg-slate-800/50 p-7 hover:bg-slate-800/80 hover:border-cyan-500/50 hover:shadow-2xl hover:shadow-cyan-500/10 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="inline-flex p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 mb-5 group-hover:bg-cyan-500 group-hover:text-slate-900 transition-colors duration-300">
                  <BarChart3 size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyan-400 transition-colors">
                  Data Analytics & BI Dashboards
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Turn scattered business data into dashboards your team
                  actually uses to decide.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-700/50">
                {["SQL", "Power BI", "Tableau", "Python"].map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-700/50 text-slate-300 border border-slate-600/50"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* 2. Machine Learning Solutions */}
            <div className="group rounded-2xl border border-slate-800 bg-slate-800/50 p-7 hover:bg-slate-800/80 hover:border-indigo-500/50 hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="inline-flex p-3 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 mb-5 group-hover:bg-indigo-500 group-hover:text-white transition-colors duration-300">
                  <BrainCircuit size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-indigo-400 transition-colors">
                  Machine Learning Solutions
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Predictive models for churn, credit risk, demand forecasting
                  and recommendations.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-700/50">
                {["Python", "scikit-learn", "PyTorch", "MLflow"].map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-700/50 text-slate-300 border border-slate-600/50"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* 3. Data Engineering & Pipelines */}
            <div className="group rounded-2xl border border-slate-800 bg-slate-800/50 p-7 hover:bg-slate-800/80 hover:border-amber-500/50 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="inline-flex p-3 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 mb-5 group-hover:bg-amber-500 group-hover:text-slate-900 transition-colors duration-300">
                  <Database size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-amber-400 transition-colors">
                  Data Engineering & Pipelines
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Reliable ETL pipelines and warehouses so your reporting stops
                  breaking.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-700/50">
                {["Airflow", "dbt", "PostgreSQL", "Spark"].map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-700/50 text-slate-300 border border-slate-600/50"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* 4. Generative AI & LLM Applications */}
            <div className="group rounded-2xl border border-slate-800 bg-slate-800/50 p-7 hover:bg-slate-800/80 hover:border-purple-500/50 hover:shadow-2xl hover:shadow-purple-500/10 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="inline-flex p-3 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 mb-5 group-hover:bg-purple-500 group-hover:text-white transition-colors duration-300">
                  <Sparkles size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                  Generative AI & LLM Applications
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  RAG chatbots and document automation built on your own data,
                  not generic models.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-700/50">
                {["OpenAI", "LangChain", "Vector DBs", "Python"].map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-700/50 text-slate-300 border border-slate-600/50"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* 5. Computer Vision & NLP */}
            <div className="group rounded-2xl border border-slate-800 bg-slate-800/50 p-7 hover:bg-slate-800/80 hover:border-emerald-500/50 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="inline-flex p-3 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 mb-5 group-hover:bg-emerald-500 group-hover:text-slate-900 transition-colors duration-300">
                  <ScanText size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-emerald-400 transition-colors">
                  Computer Vision & NLP
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Extract structure from images, scanned documents and
                  unstructured text.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-700/50">
                {["PyTorch", "OpenCV", "spaCy", "Transformers"].map((tech) => (
                  <span
                    key={tech}
                    className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-700/50 text-slate-300 border border-slate-600/50"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* 6. MLOps & Model Deployment */}
            <div className="group rounded-2xl border border-slate-800 bg-slate-800/50 p-7 hover:bg-slate-800/80 hover:border-rose-500/50 hover:shadow-2xl hover:shadow-rose-500/10 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between">
              <div>
                <div className="inline-flex p-3 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 mb-5 group-hover:bg-rose-500 group-hover:text-white transition-colors duration-300">
                  <Server size={24} />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-rose-400 transition-colors">
                  MLOps & Model Deployment
                </h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-6">
                  Get models out of notebooks and into production where they
                  stay monitored.
                </p>
              </div>
              <div className="flex flex-wrap gap-2 pt-4 border-t border-slate-700/50">
                {["Docker", "MLflow", "Railway", "GitHub Actions"].map(
                  (tech) => (
                    <span
                      key={tech}
                      className="text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-700/50 text-slate-300 border border-slate-600/50"
                    >
                      {tech}
                    </span>
                  ),
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Full-Stack Career Outcomes Section */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold tracking-wider uppercase px-3 py-1 rounded-full bg-blue-50 text-blue-600 border border-blue-100">
              Career Support
            </span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mt-3">
              Full-Stack Jobs & Career Paths in Nepal
            </h2>
            <div className="w-24 h-1 bg-emerald-600 mx-auto mt-3 rounded-full"></div>
            <p className="mt-4 text-slate-600 text-base sm:text-lg">
              Software companies, IT hubs, fintechs, and global remote agencies
              across Kathmandu are actively hiring software developers. These
              are the core full-stack roles our graduates move into.
            </p>
          </div>

          {/* Roles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {/* 1. Frontend Development */}
            <div className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs hover:shadow-2xl hover:shadow-blue-500/10 hover:border-blue-400 hover:-translate-y-2 transition-all duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 mb-5 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                <Code2 size={22} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-blue-600 transition-colors">
                Frontend Development
              </h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  React / Next.js Developer
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  Frontend Engineer
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  UI Software Engineer
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                  Web Application Developer
                </li>
              </ul>
            </div>

            {/* 2. Backend Engineering */}
            <div className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-400 hover:-translate-y-2 transition-all duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600 border border-indigo-100 mb-5 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                <Server size={22} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-indigo-600 transition-colors">
                Backend Engineering
              </h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  Node.js / Express Developer
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  Backend Engineer
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  REST API Developer
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                  Database Engineer
                </li>
              </ul>
            </div>

            {/* 3. Full-Stack Engineering */}
            <div className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs hover:shadow-2xl hover:shadow-emerald-500/10 hover:border-emerald-400 hover:-translate-y-2 transition-all duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 mb-5 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                <Layers size={22} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-emerald-600 transition-colors">
                Full-Stack Engineering
              </h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  MERN Stack Engineer
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Full-Stack Developer
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  SaaS Product Developer
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  Software Engineer
                </li>
              </ul>
            </div>

            {/* 4. DevOps & Cloud Web Systems */}
            <div className="group rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs hover:shadow-2xl hover:shadow-purple-500/10 hover:border-purple-400 hover:-translate-y-2 transition-all duration-300">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 border border-purple-100 mb-5 group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300">
                <Cloud size={22} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-3 group-hover:text-purple-600 transition-colors">
                DevOps & Cloud Web
              </h3>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                  Deployment Specialist
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                  Junior Cloud Architect
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                  Web DevOps Engineer
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                  QA / Automation Engineer
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Placement CTA Banner */}
          <div className="rounded-3xl bg-linear-to-br from-blue-900 via-blue-950 to-slate-900 text-white p-8 sm:p-12 border border-blue-800/50 shadow-2xl shadow-blue-950/40 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
            {/* Background glow highlight */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-2xl text-center lg:text-left relative z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-semibold mb-4 backdrop-blur-sm">
                <Briefcase size={14} /> 95% Job Placement Support in Nepal
              </div>
              <h3 className="text-2xl sm:text-3xl font-bold tracking-tight mb-3 text-white">
                Launch your software development career
              </h3>
              <p className="text-blue-100/80 text-sm sm:text-base leading-relaxed">
                Our placement team connects you directly with software houses,
                fintech startups, IT consultancies, and remote hiring partners.
                From internship prep to full-time engineering roles — we support
                every step.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto shrink-0 relative z-10">
              <Link
                to="/jobs"
                className="px-6 py-3.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-slate-950 font-bold text-sm transition-all duration-200 shadow-lg shadow-blue-500/25 text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                View Software Engineering Jobs <ArrowRight size={16} />
              </Link>
              <Link
                to="/counselling"
                className="px-6 py-3.5 rounded-xl bg-transparent border border-blue-500 hover:bg-blue-500 hover:text-slate-950 text-blue-500 font-bold text-sm transition-all duration-200 shadow-lg shadow-blue-500/25 text-center flex items-center justify-center gap-2 cursor-pointer"
              >
                Free Career Counselling
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 5. IT Training FAQs Section */}
      <section className="py-20 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
              IT Training FAQs
            </h2>
            <div className="w-48 h-1 bg-emerald-700 mx-auto mt-2 mb-3 rounded-full"></div>
            <p className="text-sm text-gray-900">
              Common questions about courses, certificates, internships, and
              counseling at GyanTech in Nepal.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
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

      {/* 6. Stories from Our Learners Section */}
      {testimonials.length > 0 && (
        <section className="bg-slate-50/60 py-12 sm:py-16 md:py-20 border-t border-slate-200/60">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            {/* Header */}
            <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12">
              <span className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 border border-slate-200/60 mb-2">
                Wall of Love
              </span>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight text-slate-900">
                Stories from Our Learners
              </h2>
            </div>

            {/* Testimonials Container */}
            <div className="flex overflow-x-auto gap-4 sm:gap-6 pb-4 sm:pb-0 snap-x snap-mandatory sm:grid sm:grid-cols-2 lg:grid-cols-3 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
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
                    className="w-70 sm:w-auto snap-center rounded-xl border border-slate-200/70 bg-white p-4 sm:p-6 shadow-2xs text-left shrink-0 sm:shrink flex flex-col justify-between"
                  >
                    <div>
                      {/* Author Info */}
                      <div className="flex items-center gap-3">
                        {item.student?.photo ? (
                          <img
                            src={item.student.photo}
                            alt={studentName}
                            className="h-10 w-10 sm:h-11 sm:w-11 rounded-full object-cover border border-slate-100 shrink-0"
                          />
                        ) : (
                          <div className="flex h-10 w-10 sm:h-11 sm:w-11 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-700 shrink-0 border border-slate-200/60">
                            {initials || "ST"}
                          </div>
                        )}
                        <div className="min-w-0">
                          <h3 className="font-semibold text-xs sm:text-sm text-slate-900 truncate">
                            {studentName}
                          </h3>
                          <p className="text-[11px] sm:text-xs text-slate-500 truncate">
                            {item.course?.title || "Verified learner"}
                          </p>
                        </div>
                      </div>

                      {/* Rating Stars */}
                      <div className="mt-3 flex items-center gap-0.5 text-amber-400">
                        {Array.from({ length: Number(item.rating || 5) }).map(
                          (_, index) => (
                            <Star key={index} size={14} fill="currentColor" />
                          ),
                        )}
                      </div>

                      {/* Message */}
                      <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-slate-600 line-clamp-4">
                        "{item.message}"
                      </p>
                    </div>
                  </article>
                );
              })}
            </div>

            {/* Call to Action */}
            <div className="mt-8 sm:mt-10 text-center">
              <Link
                to="/student/testimonials/create"
                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-semibold text-white hover:bg-slate-800 shadow-2xs transition-colors"
              >
                <MessageSquareQuote size={15} /> Share Your Story
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 7. Get in Touch & Contact Section */}
      <div
        id="contact-section"
        className="bg-slate-50/50 text-slate-900 border-t border-gray-100 py-20"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 mb-12">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 mt-2">
              Get in Touch
            </h2>
            <div className="w-30 h-1 bg-emerald-700 mx-auto mt-3 rounded-full"></div>
          </div>
        </div>

        {/* MAIN CONTACT GRID */}
        <section className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 text-left">
          {/* LEFT COLUMN: DIRECT CONTACT */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4 }}
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
          </div>

          {/* RIGHT COLUMN: CONTACT FORM */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.1 }}
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
                  onChange={updateField}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-base sm:text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                  placeholder="Your name"
                />
              </Field>

              <Field label="Email address">
                <input
                  required
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={updateField}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-base sm:text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                  placeholder="you@example.com"
                />
              </Field>

              <Field label="Purpose">
                <select
                  name="subject"
                  value={form.subject}
                  onChange={updateField}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-base sm:text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
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
                  onChange={updateField}
                  rows={5}
                  className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-base sm:text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                  placeholder="Tell us about your questions..."
                />
              </Field>

              <button
                type="submit"
                disabled={contactMutation.isPending}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-6 py-4 font-bold text-white shadow-lg shadow-indigo-600/20 transition hover:bg-indigo-700 active:scale-[0.99] disabled:opacity-50"
              >
                {contactMutation.isPending ? (
                  "Sending..."
                ) : (
                  <>
                    <Send size={18} /> Send Message
                  </>
                )}
              </button>
            </div>
          </motion.form>
        </section>
      </div>
    </div>
  );
};

export default Home;
