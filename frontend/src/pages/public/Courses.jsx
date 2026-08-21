import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Clock,
  Search,
  SlidersHorizontal,
  ChevronRight,
  PhoneCall,
  Mail,
  BookOpen,
} from "lucide-react";
import { getCourses } from "../../api/course.services";

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
          "Failed to load courses from the server. Please try again later.",
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

  return (
    <div className="min-h-screen bg-white text-slate-950">
      {/* Deep Blue Hero Section Matching Reference Image */}
      <div className="w-full bg-[#134262] text-white py-16 md:py-24 px-6 md:px-12 mb-12 shadow-md">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Headings & CTA Buttons */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Explore <span className="text-orange-500">IT Courses</span> <br />
              in Nepal
            </h1>
            <p className="text-sm md:text-base text-slate-200 font-normal max-w-xl leading-relaxed">
              Unlock your potential with IT courses designed to lead you to
              success in the digital age.
            </p>
            <p className="text-xs md:text-sm font-semibold text-slate-100 tracking-wide">
              Get Certification and Internship Opportunity.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 bg-[#0082c4] hover:bg-[#0070a8] text-white font-bold text-xs md:text-sm px-6 py-3.5 rounded-lg shadow-lg transition-all"
              >
                <Mail size={16} />
                Contact us Today
              </Link>
              <Link
                to="#courses-catalog"
                className="inline-flex items-center gap-2 bg-[#0082c4] hover:bg-[#0070a8] text-white font-bold text-xs md:text-sm px-6 py-3.5 rounded-lg shadow-lg transition-all"
              >
                <BookOpen size={16} />
                Enroll Now
              </Link>
            </div>
          </div>

          {/* Right Column: Illustration / Tech Icons Showcase Area */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end relative">
            <div className="relative w-full max-w-lg h-72 md:h-85 flex items-center justify-center">
              <img
                src="/src/assets/image.png"
                alt="Explore IT Courses Illustration"
                className="w-full h-full object-contain drop-shadow-xl"
              />
            </div>
          </div>
        </div>
      </div>

      <div
        id="courses-catalog"
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        {/* Search & Filter Top Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          {/* Search Input */}
          <div className="relative w-full md:w-125 group">
            <Search
              size={16}
              className="absolute left-3.5 top-3.5 text-slate-400 group-hover:text-blue-600 transition-colors"
            />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white text-xs text-slate-900 border border-slate-200 rounded-xl pl-10 pr-4 py-3 shadow-sm hover:border-slate-300 transition-all focus:outline-none focus:ring-2 focus:ring-blue-600/10"
            />
          </div>

          {/* Filter Dropdowns / Controls */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-white px-3 py-2.5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all">
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
              className="bg-white text-xs font-semibold text-slate-700 px-3 py-2.5 rounded-xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all focus:outline-none cursor-pointer"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="popularity">Sort: Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Categories Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-10 overflow-x-auto pb-2">
          {[
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
          ].map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all shadow-sm ${
                selectedCategory === category
                  ? "bg-[#134262] text-white shadow-blue-900/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900"
              }`}
            >
              {category}
            </button>
          ))}
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

        {/* Courses Grid (3 Columns) */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {processedCourses.map((course) => (
              <div
                key={course._id}
                className="bg-white border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between hover:shadow-xl transition-all duration-300 group"
              >
                <div>
                  {/* Thumbnail / Visual Banner */}
                  <div className="w-full h-48 bg-slate-900 relative overflow-hidden flex items-center justify-center p-4">
                    {course.courseImage ? (
                      <img
                        src={course.courseImage}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="text-center">
                        <span className="text-white font-bold text-lg tracking-tight block drop-shadow-md">
                          {course.title}
                        </span>
                        <span className="text-blue-400 text-xs font-semibold uppercase tracking-wider mt-1 block">
                          {course.category}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Sub-header info (Delivery tags & duration) */}
                  <div className="px-5 pt-4 pb-2 flex items-center justify-between text-[11px] font-semibold text-blue-600">
                    <div className="flex items-center gap-1 text-slate-400 font-medium">
                      <Clock size={13} />
                      <span>{course.duration || "8 weeks"}</span>
                    </div>
                  </div>

                  {/* Title & Description */}
                  <div className="px-5 py-2">
                    <h2 className="text-base font-bold text-slate-900 mb-1.5 group-hover:text-blue-600 transition-colors">
                      {course.title}
                    </h2>
                    <p className="text-xs text-slate-500 leading-relaxed line-clamp-2">
                      {course.description}
                    </p>
                  </div>
                </div>

                {/* Footer Price & View Details Link */}
                <div className="p-5 pt-4 border-t border-slate-100 mt-4 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-semibold uppercase">
                      Fee
                    </span>
                    <span className="text-sm font-extrabold text-slate-900">
                      NPR {course.fee?.toLocaleString()}
                    </span>
                  </div>

                  <Link
                    to={`/course/${course._id}`}
                    className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    View Details <ChevronRight size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && processedCourses.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-2xl border border-slate-200 text-slate-400 text-sm mb-16">
            No courses match your filtering criteria. Try resetting filters or
            search terms.
          </div>
        )}
      </div>

      {/* Bottom Free Counselling Banner */}
      <div className="w-full bg-[#0052cc] text-white py-16 px-4 text-center mt-20">
        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
            Not Sure Which Course to Pick?
          </h2>
          <p className="text-xs md:text-sm text-blue-100 font-medium max-w-lg mx-auto">
            Our career counsellors are here to help. Book a free session and get
            personalized guidance for your goals.
          </p>
          <div className="pt-2">
            <Link
              to="/counselling"
              className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 hover:bg-slate-100 font-bold text-xs md:text-sm px-6 py-3.5 rounded-xl shadow-lg transition-all duration-200"
            >
              <PhoneCall size={16} />
              Enquiry for Free Counselling
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;
