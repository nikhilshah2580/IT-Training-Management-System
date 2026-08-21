import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Clock,
  Search,
  SlidersHorizontal,
  ChevronRight,
  PhoneCall,
  Mail,
  BookOpen,
  Code,
  Globe,
  Database,
  Palette,
  Network,
  ShieldCheck,
  Server,
  Cpu,
  Layers,
  Sparkles,
  CheckCircle2,
  Users,
  Building2,
  ArrowRight
} from "lucide-react";
import { getCourses } from "../../api/course.services";

// Mapping category names to Lucide icons and colors
const categoryConfig = {
  All: { icon: Sparkles, color: "bg-slate-900 text-white" },
  Programming: { icon: Code, color: "bg-blue-500 text-white" },
  "Web Development": { icon: Globe, color: "bg-emerald-500 text-white" },
  "Data Science & Analytics": { icon: Cpu, color: "bg-purple-500 text-white" },
  "Graphic Design": { icon: Palette, color: "bg-pink-500 text-white" },
  Networking: { icon: Network, color: "bg-indigo-500 text-white" },
  "Cyber Security": { icon: ShieldCheck, color: "bg-rose-500 text-white" },
  Database: { icon: Database, color: "bg-amber-500 text-white" },
  "Cloud Computing": { icon: Server, color: "bg-cyan-500 text-white" },
  Other: { icon: Layers, color: "bg-slate-600 text-white" },
};

const Courses = () => {
  // Backend synchronized states
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Sorting Query States
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [skillLevel, setSkillLevel] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [maxPrice, setMaxPrice] = useState(50000);

  // Fetch courses from backend API service
  useEffect(() => {
    const fetchCoursesData = async () => {
      try {
        setLoading(true);
        const params = {
          status: "Active", // Only show approved/active courses to users
        };
        if (selectedCategory !== "All") params.category = selectedCategory;
        if (skillLevel !== "All") params.skillLevel = skillLevel;
        if (searchQuery.trim() !== "") params.search = searchQuery;

        const data = await getCourses(params);
        setCourses(data.courses || []);
        setError(null);
      } catch (err) {
        setError(
          "Failed to load courses from the server. Please try again later."
        );
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchCoursesData();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [selectedCategory, skillLevel, searchQuery]);

  // Client-side post-filtering (Price range) and Sorting
  const processedCourses = courses
    .filter((course) => {
      if (course.fee > maxPrice) return false;
      return true;
    })
    .sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "price-low") return a.fee - b.fee;
      if (sortBy === "price-high") return b.fee - a.fee;
      if (sortBy === "popularity")
        return (b.totalStudents || 0) - (a.totalStudents || 0);
      return 0;
    });

  const categories = [
    "All",
    "Programming",
    "Web Development",
    "Data Science & Analytics",
    "Graphic Design",
    "Networking",
    "Cyber Security",
    "Database",
    "Cloud Computing",
    "Other",
  ];

  return (
    <div className="min-h-screen bg-white text-slate-950 pb-20">
      {/* Clean White Modern Hero Section Matching Reference Layout & Style */}
      <section className="relative overflow-hidden bg-white pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-center border-b border-slate-100">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 h-125 w-125 rounded-full bg-blue-50/50 blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-4 py-1.5 text-xs font-bold text-blue-700 shadow-2xs"
          >
            <Sparkles size={14} className="text-blue-600 animate-pulse" /> Sipalaya InfoTech • Kathmandu, Nepal
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 leading-tight"
          >
            IT Training Courses in <span className="text-blue-600">Nepal</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-sm sm:text-base text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed"
          >
            Practical programming and digital skills for students, graduates, and career switchers — from Python and AI to MERN, React, Flutter, Django, UI/UX, and digital marketing. Learn with mentors, build real projects, earn a certificate, and continue into internship pathways when you are ready.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.25 }}
            className="text-xs sm:text-sm font-semibold text-slate-500 pt-1"
          >
            Filter the catalog below by category or search by name. Prefer guidance first?{" "}
            <Link to="/counselling" className="text-blue-600 font-bold hover:underline">
              Book free counseling
            </Link>{" "}
            or{" "}
            <Link to="/about" className="text-blue-600 font-bold hover:underline">
              learn more about our institute
            </Link>.
          </motion.div>

          {/* Feature Badges Grid */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="flex flex-wrap items-center justify-center gap-3 pt-2"
          >
            <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200/85 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-2xs">
              <Users size={14} className="text-blue-600" /> Mentor-led classes
            </div>
            <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200/85 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-2xs">
              <Building2 size={14} className="text-blue-600" /> Real projects
            </div>
            <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200/85 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-2xs">
              <CheckCircle2 size={14} className="text-emerald-600" /> Certificates
            </div>
            <div className="inline-flex items-center gap-2 rounded-2xl border border-slate-200/85 bg-white px-4 py-2 text-xs font-bold text-slate-700 shadow-2xs">
              <BookOpen size={14} className="text-blue-600" /> Internships
            </div>
          </motion.div>

          {/* CTA Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.35 }}
            className="flex flex-wrap items-center justify-center gap-3 pt-4"
          >
            <a
              href="#courses-catalog"
              className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 hover:scale-[1.02]"
            >
              Browse courses <ArrowRight size={16} />
            </a>
            <Link
              to="/counselling"
              className="inline-flex items-center gap-2 rounded-2xl border border-blue-600/30 bg-white px-6 py-3.5 text-sm font-bold text-blue-700 shadow-xs transition hover:bg-blue-50/50 hover:scale-[1.02]"
            >
              Book free counseling
            </Link>
          </motion.div>
        </div>
      </section>

      <div
        id="courses-catalog"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12"
      >
        {/* Search & Filter Top Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-slate-50/80 p-4 rounded-2xl border border-slate-200 shadow-2xs">
          {/* Search Input */}
          <div className="relative w-full md:w-96 group">
            <Search
              size={16}
              className="absolute left-3.5 top-3.5 text-slate-400 group-hover:text-blue-600 transition-colors"
            />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-xs text-slate-900 border border-slate-200 rounded-xl pl-10 pr-4 py-3 shadow-2xs hover:border-slate-300 transition-all focus:outline-none focus:ring-2 focus:ring-blue-600/10"
            />
          </div>

          {/* Filter Dropdowns / Controls */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-white px-3 py-2.5 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all">
              <SlidersHorizontal size={14} className="text-slate-400" />
              <select
                value={skillLevel}
                onChange={(e) => setSkillLevel(e.target.value)}
                className="bg-transparent text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer"
              >
                <option value="All">All Types / Levels</option>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white text-xs font-semibold text-slate-700 px-3 py-2.5 rounded-xl border border-slate-200 shadow-2xs hover:border-slate-300 transition-all focus:outline-none cursor-pointer"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="popularity">Sort: Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Categories Filter Tabs with Custom Icons and Colorful Animation styling */}
        <div className="flex flex-wrap gap-2 mb-10 overflow-x-auto pb-2">
          {categories.map((cat) => {
            const config = categoryConfig[cat] || categoryConfig["Other"];
            const IconComponent = config.icon;
            const isSelected = selectedCategory === cat;

            return (
              <motion.button
                key={cat}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setSelectedCategory(cat)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all shadow-xs ${
                  isSelected
                    ? "bg-blue-600 text-white shadow-md shadow-blue-600/25 ring-2 ring-blue-600/20"
                    : "bg-slate-50 text-slate-700 border border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                }`}
              >
                <span
                  className={`flex h-6 w-6 items-center justify-center rounded-lg text-xs ${
                    isSelected ? "bg-white/20 text-white" : "bg-blue-50 text-blue-600"
                  }`}
                >
                  <IconComponent size={13} />
                </span>
                {cat}
              </motion.button>
            );
          })}
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-20 text-slate-400 text-sm animate-pulse font-medium">
            Loading courses...
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl text-center text-xs mb-8 font-medium">
            {error}
          </div>
        )}

        {/* Enhanced Courses Grid (3 Columns) */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {processedCourses.map((course, idx) => (
              <motion.div
                key={course._id}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                className="bg-white border border-slate-200/80 rounded-3xl overflow-hidden flex flex-col justify-between hover:shadow-xl hover:border-blue-200 transition-all duration-300 group"
              >
                <div>
                  {/* Thumbnail / Visual Banner */}
                  <div className="w-full h-48 bg-slate-900 relative overflow-hidden flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-linear-to-t from-slate-950/80 via-transparent to-transparent z-10" />
                    {course.courseImage ? (
                      <img
                        src={course.courseImage}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="text-center z-20">
                        <span className="text-white font-bold text-lg tracking-tight block drop-shadow-md">
                          {course.title}
                        </span>
                        <span className="text-blue-400 text-xs font-semibold uppercase tracking-wider mt-1 block">
                          {course.category}
                        </span>
                      </div>
                    )}
                    <span className="absolute top-3 left-3 z-20 rounded-full bg-white/95 backdrop-blur-md px-3 py-1 text-[11px] font-bold text-slate-800 shadow-xs">
                      {course.category || "IT Training"}
                    </span>
                  </div>

                  {/* Sub-header info (Delivery tags & duration) */}
                  <div className="px-6 pt-4 pb-1 flex items-center justify-between text-[11px] font-semibold text-blue-600">
                    <div className="flex items-center gap-1.5 text-slate-500 font-medium">
                      <Clock size={13} className="text-blue-600" />
                      <span>{course.duration || "8 weeks"}</span>
                    </div>
                    {course.skillLevel && (
                      <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700">
                        {course.skillLevel}
                      </span>
                    )}
                  </div>

                  {/* Title & Description */}
                  <div className="px-6 py-2">
                    <h2 className="text-base font-bold text-slate-900 mb-1.5 group-hover:text-blue-600 transition-colors line-clamp-1">
                      {course.title}
                    </h2>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 font-medium">
                      {course.description}
                    </p>
                  </div>
                </div>

                {/* Footer Price & View Details Link */}
                <div className="p-6 pt-4 border-t border-slate-100 mt-4 flex items-center justify-between bg-slate-50/50">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-bold uppercase tracking-wider">
                      Course Fee
                    </span>
                    <span className="text-sm font-extrabold text-slate-900">
                      NPR {course.fee?.toLocaleString()}
                    </span>
                  </div>

                  <Link
                    to={`/course/${course._id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-xl shadow-xs transition-colors"
                  >
                    View Details <ChevronRight size={14} />
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && processedCourses.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-200 text-slate-500 text-sm mb-16 font-medium">
            No courses match your filtering criteria. Try resetting filters or search terms.
          </div>
        )}
      </div>

      {/* Bottom Free Counselling Banner */}
     <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 mb-8">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-900 via-blue-600 to-indigo-800 p-8 sm:p-12 text-center shadow-2xl border border-blue-500/30">
          <div className="absolute -top-16 -left-16 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl pointer-events-none" />

          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Not Sure Which Course to Pick?
            </h2>
            <p className="text-xs sm:text-sm text-blue-100 font-medium leading-relaxed max-w-lg mx-auto">
              Our career counsellors are here to help. Book a free session and get personalized guidance for your goals.
            </p>
            <div className="pt-3">
              <Link
                to="/counselling"
                className="inline-flex items-center justify-center gap-2 bg-white text-blue-900 hover:bg-blue-50 font-bold text-xs sm:text-sm px-8 py-4 rounded-2xl shadow-xl transition-all duration-200 hover:scale-105"
              >
                <PhoneCall size={16} className="text-blue-600" />
                Enquiry for Free Counselling
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Courses;