import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Search,
  ArrowLeft,
  ChevronRight,
  Grid,
  List,
  SlidersHorizontal,
  RotateCcw,
  BookOpen,
} from "lucide-react";
import { getCourses } from "../../api/course.services";
import PublicPageHero from "../../components/common/PublicPageHero";

const Courses = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";

  // Data States
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedInstructor, setSelectedInstructor] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [priceType, setPriceType] = useState("All"); // All, Free, Paid
  const [maxPrice, setMaxPrice] = useState(50000);

  // Top Bar Search & Sort States
  const [sortBy, setSortBy] = useState("newest");
  const [viewMode, setViewMode] = useState("grid"); // 'grid' | 'list'
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 6;

  // Fetch API Data
  useEffect(() => {
    const fetchCoursesData = async () => {
      try {
        setLoading(true);
        const params = { status: "Active" };
        if (selectedCategory !== "All") params.category = selectedCategory;
        if (selectedLevel !== "All") params.skillLevel = selectedLevel;
        if (searchQuery.trim() !== "") params.search = searchQuery;

        const data = await getCourses(params);
        setCourses(data.courses || []);
        setError(null);
      } catch {
        setError("Failed to load courses. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchCoursesData();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [selectedCategory, selectedLevel, searchQuery]);

  // Extract instructors dynamically for filter sidebar
  const availableInstructors = [
    "All",
    ...Array.from(
      new Set(
        courses
          .map((c) =>
            typeof c.instructor === "object"
              ? c.instructor?.fullName
              : c.instructor,
          )
          .filter(Boolean),
      ),
    ),
  ];

  // Client-side filtering & Sorting
  const filteredCourses = courses
    .filter((course) => {
      // Price Type Filter
      if (priceType === "Free" && course.fee > 0) return false;
      if (priceType === "Paid" && (course.fee === 0 || !course.fee))
        return false;
      if (course.fee > maxPrice) return false;

      // Instructor Filter
      if (selectedInstructor !== "All") {
        const instName =
          typeof course.instructor === "object"
            ? course.instructor?.fullName
            : course.instructor;
        if (instName !== selectedInstructor) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "price-low") return (a.fee || 0) - (b.fee || 0);
      if (sortBy === "price-high") return (b.fee || 0) - (a.fee || 0);
      if (sortBy === "popularity")
        return (b.totalStudents || 0) - (a.totalStudents || 0);
      return 0;
    });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredCourses.length / coursesPerPage),
  );
  const visiblePage = Math.min(currentPage, totalPages);
  const paginatedCourses = filteredCourses.slice(
    (visiblePage - 1) * coursesPerPage,
    visiblePage * coursesPerPage,
  );

  const handleResetFilters = () => {
    setSelectedCategory("All");
    setSelectedInstructor("All");
    setSelectedLevel("All");
    setPriceType("All");
    setMaxPrice(50000);
    setCurrentPage(1);
    setSearchParams((currentParams) => {
      const nextParams = new URLSearchParams(currentParams);
      nextParams.delete("search");
      return nextParams;
    }, { replace: true });
  };

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
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-slate-800 pb-8 font-sans">
      <PublicPageHero
        title="Build Your"
        accent="Future"
        description="Learn practical technology skills through focused courses designed for real projects, confident careers, and continuous growth."
        actionLabel=""
      />
      <div className="mx-auto mt-5 max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Grid: Left Filters Sidebar + Right Course Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
          {/* LEFT SIDEBAR: FILTERS */}
          <aside
            className={`fixed inset-0 z-50 bg-white p-6 overflow-y-auto lg:static lg:z-auto lg:p-0 lg:bg-transparent ${
              mobileFilterOpen ? "block" : "hidden lg:block"
            }`}
          >
            <div className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-2xs space-y-6">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="inline-flex items-center gap-2 text-sm font-bold text-slate-700 transition hover:text-purple-600 lg:hidden"
              >
                <ArrowLeft size={17} />
                Back to Courses
              </button>

              {/* Filter Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <div className="flex items-center gap-2 font-bold text-slate-900 text-sm">
                  <SlidersHorizontal size={16} className="text-purple-600" />
                  <span>Filters</span>
                </div>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-rose-500 hover:text-rose-600 transition cursor-pointer"
                >
                  <RotateCcw size={12} /> Clear
                </button>
              </div>

              {/* Categories */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
                  Categories
                </h3>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {categories.map((cat) => (
                    <label
                      key={cat}
                      className="flex items-center justify-between text-xs text-slate-600 hover:text-slate-900 cursor-pointer font-medium"
                    >
                      <div className="flex items-center gap-2">
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === cat}
                          onChange={() => setSelectedCategory(cat)}
                          className="accent-purple-600"
                        />
                        <span>{cat}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Instructors */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
                  Instructors
                </h3>
                <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
                  {availableInstructors.map((inst) => (
                    <label
                      key={inst}
                      className="flex items-center gap-2 text-xs text-slate-600 hover:text-slate-900 cursor-pointer font-medium"
                    >
                      <input
                        type="radio"
                        name="instructor"
                        checked={selectedInstructor === inst}
                        onChange={() => setSelectedInstructor(inst)}
                        className="accent-purple-600"
                      />
                      <span className="truncate">{inst}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Type */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
                  Price
                </h3>
                <div className="space-y-2 text-xs font-medium text-slate-600">
                  {["All", "Free", "Paid"].map((type) => (
                    <label
                      key={type}
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      <input
                        type="radio"
                        name="priceType"
                        checked={priceType === type}
                        onChange={() => setPriceType(type)}
                        className="accent-purple-600"
                      />
                      <span>{type} Courses</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range Slider */}
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Max Price
                  </h3>
                  <span className="text-xs font-bold text-purple-600">
                    NPR {maxPrice.toLocaleString()}
                  </span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50000"
                  step="1000"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-purple-600 cursor-pointer"
                />
              </div>

              {/* Level */}
              <div className="pt-4 border-t border-slate-100">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 mb-3">
                  Level
                </h3>
                <div className="space-y-2 text-xs font-medium text-slate-600">
                  {["All", "Beginner", "Intermediate", "Advanced"].map(
                    (lvl) => (
                      <label
                        key={lvl}
                        className="flex items-center gap-2 cursor-pointer"
                      >
                        <input
                          type="radio"
                          name="level"
                          checked={selectedLevel === lvl}
                          onChange={() => setSelectedLevel(lvl)}
                          className="accent-purple-600"
                        />
                        <span>{lvl}</span>
                      </label>
                    ),
                  )}
                </div>
              </div>

              {/* Mobile Close Button */}
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full mt-4 rounded-xl bg-slate-900 py-2.5 text-xs font-bold text-white lg:hidden"
              >
                Apply Filters
              </button>
            </div>
          </aside>

          {/* RIGHT SIDE: TOP TOOLBAR & COURSE GRID */}
          <main className="lg:col-span-3 space-y-4">
            {/* Top Toolbar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-start">
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(true)}
                  className="lg:hidden inline-flex items-center gap-1.5 rounded-xl border border-slate-200 px-3 py-2 text-xs font-bold text-slate-700"
                >
                  <SlidersHorizontal size={14} /> Filters
                </button>
                <span className="text-xs font-semibold text-slate-500">
                  Showing{" "}
                  <strong className="text-slate-900">
                    {filteredCourses.length}
                  </strong>{" "}
                  results
                </span>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
                {/* View Mode Switcher */}
                <div className="flex items-center border border-slate-200 rounded-xl p-1 bg-slate-50">
                  <button
                    type="button"
                    onClick={() => setViewMode("grid")}
                    className={`p-1.5 rounded-lg transition ${
                      viewMode === "grid"
                        ? "bg-white text-purple-600 shadow-2xs"
                        : "text-slate-400"
                    }`}
                  >
                    <Grid size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode("list")}
                    className={`p-1.5 rounded-lg transition ${
                      viewMode === "list"
                        ? "bg-white text-purple-600 shadow-2xs"
                        : "text-slate-400"
                    }`}
                  >
                    <List size={15} />
                  </button>
                </div>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer shadow-2xs"
                >
                  <option value="newest">Newly Published</option>
                  <option value="popularity">Most Popular</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                </select>

                {/* Search Bar */}
                <div className="relative w-40 sm:w-48">
                  <Search
                    size={14}
                    className="absolute left-3 top-2.5 text-slate-400"
                  />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => {
                      const nextParams = new URLSearchParams(searchParams);
                      if (e.target.value.trim()) {
                        nextParams.set("search", e.target.value);
                      } else {
                        nextParams.delete("search");
                      }
                      setSearchParams(nextParams, { replace: true });
                    }}
                    className="w-full rounded-xl border border-slate-200 bg-white py-1.5 pl-8 pr-3 text-xs text-slate-900 shadow-2xs focus:outline-none focus:ring-2 focus:ring-purple-600/20"
                  />
                </div>
              </div>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="text-center py-20 text-xs font-semibold uppercase tracking-wider text-slate-400 animate-pulse">
                Loading Courses...
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-center text-xs font-semibold text-rose-600">
                {error}
              </div>
            )}

            {/* Courses Card Grid */}
            {!loading && !error && (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }
              >
                {paginatedCourses.map((course, idx) => {
                  return (
                    <motion.div
                      key={course._id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.2, delay: idx * 0.03 }}
                      className={`group border border-slate-200/80 bg-white rounded-2xl overflow-hidden shadow-2xs hover:shadow-md hover:border-purple-200 transition-all ${
                        viewMode === "list"
                          ? "flex flex-col sm:flex-row items-center p-3 gap-4"
                          : ""
                      }`}
                    >
                      {/* Course Image */}
                      <div
                        className={`relative overflow-hidden bg-slate-100 ${
                          viewMode === "list"
                            ? "w-full sm:w-48 h-36 rounded-xl shrink-0"
                            : "h-44 w-full"
                        }`}
                      >
                        {course.courseImage ? (
                          <img
                            src={course.courseImage}
                            alt={course.title}
                            className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-purple-50 text-purple-400">
                            <BookOpen size={40} />
                          </div>
                        )}
                      </div>

                      {/* Course Info Details */}
                      <div
                        className={`p-4 flex flex-col justify-between ${viewMode === "list" ? "flex-1 p-0" : ""}`}
                      >
                        <div>
                          {/* Category Badge Row */}
                          <div className="mb-2">
                            <span className="inline-block rounded-md bg-purple-50 px-2 py-0.5 text-[10px] font-bold text-purple-700">
                              {course.category || "General"}
                            </span>
                          </div>

                          {/* Course Title */}
                          <h2 className="text-xs sm:text-sm font-bold text-slate-900 group-hover:text-purple-600 transition line-clamp-2 leading-snug">
                            {course.title}
                          </h2>
                        </div>

                        {/* Bottom Row: Price & View Button */}
                        <div className="mt-4 flex items-center justify-between pt-3 border-t border-slate-100">
                          <span className="text-sm font-black text-rose-500">
                            {course.fee
                              ? `NPR ${course.fee.toLocaleString()}`
                              : "FREE"}
                          </span>

                          <Link
                            to={`/course/${course._id}`}
                            className="inline-flex items-center gap-1 rounded-full bg-slate-900 px-3.5 py-1.5 text-[11px] font-bold text-white shadow-2xs hover:bg-purple-600 transition"
                          >
                            View Course <ChevronRight size={12} />
                          </Link>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}

            {!loading && !error && filteredCourses.length > 0 && totalPages > 1 && (
              <nav
                aria-label="Course pages"
                className="flex items-center justify-center gap-2 pt-2"
              >
                {Array.from({ length: totalPages }, (_, pageIndex) => {
                  const pageNumber = pageIndex + 1;
                  const isActive = pageNumber === visiblePage;

                  return (
                    <button
                      key={pageNumber}
                      type="button"
                      onClick={() => setCurrentPage(pageNumber)}
                      aria-current={isActive ? "page" : undefined}
                      className={`flex h-9 w-9 items-center justify-center rounded-lg text-xs font-bold transition ${
                        isActive
                          ? "bg-purple-600 text-white shadow-sm"
                          : "border border-slate-200 bg-white text-slate-600 hover:border-purple-300 hover:text-purple-600"
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                })}
              </nav>
            )}

            {/* Empty Results State */}
            {!loading && !error && filteredCourses.length === 0 && (
              <div className="rounded-2xl border border-slate-200/80 bg-white p-12 text-center text-slate-500 shadow-2xs">
                <p className="text-sm font-bold text-slate-800">
                  No courses match your active filters.
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Try clearing sidebar criteria or searching for another
                  keyword.
                </p>
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="mt-4 rounded-xl bg-purple-600 px-4 py-2 text-xs font-bold text-white shadow-2xs hover:bg-purple-700 transition"
                >
                  Reset All Filters
                </button>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Courses;
