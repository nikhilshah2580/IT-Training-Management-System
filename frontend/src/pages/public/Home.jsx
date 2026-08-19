import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  Award,
  Briefcase,
  Building2,
  Users,
  TrendingUp,
  CheckCircle,
  Star,
} from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  // Search State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedLevel, setSelectedLevel] = useState("All");

  // Banner Carousel State
  const [currentSlide, setCurrentSlide] = useState(0);

  const bannerSlides = [
    {
      title: "Master Modern Web Development",
      subtitle:
        "Build industry-ready skills with hands-on projects and expert mentorship.",
      badge: "Featured Course",
      ctaText: "Enroll Now",
      ctaLink: "/courses/web-development",
      bg: "from-blue-600 to-indigo-700",
    },
    {
      title: "January Batch Special Offer",
      subtitle:
        "Get 10% off on all professional certification and IT training programs.",
      badge: "Limited Time Offer",
      ctaText: "View Courses",
      ctaLink: "/courses",
      bg: "from-purple-600 to-blue-600",
    },
    {
      title: "New Python for Data Science Launched",
      subtitle:
        "Step into the world of AI, automation, and data analytics today.",
      badge: "What's New",
      ctaText: "Schedule a Demo",
      ctaLink: "/schedule-demo",
      bg: "from-slate-900 to-blue-900",
    },
  ];

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

  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* 1. Homepage Main Banner */}
      <section className="relative overflow-hidden text-white transition-all duration-500">
        <div
          className={`absolute inset-0 bg-linear-to-r ${bannerSlides[currentSlide].bg} transition-all duration-700`}
        ></div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 lg:py-32 flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-1.5 py-1.5 px-4 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-white mb-6">
            <Award size={14} /> {bannerSlides[currentSlide].badge}
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight max-w-3xl leading-tight">
            {bannerSlides[currentSlide].title}
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-white/90 max-w-2xl">
            {bannerSlides[currentSlide].subtitle}
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to={bannerSlides[currentSlide].ctaLink}
              className="rounded-xl bg-white px-8 py-4 font-bold text-blue-700 shadow-lg hover:bg-gray-100 transition-all text-base"
            >
              {bannerSlides[currentSlide].ctaText}
            </Link>
            <Link
              to="/courses"
              className="rounded-xl border border-white/40 bg-white/10 backdrop-blur-md px-8 py-4 font-semibold text-white hover:bg-white/20 transition-all text-base"
            >
              View All Courses
            </Link>
          </div>
        </div>

        {/* Carousel Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-md transition-colors"
          aria-label="Previous Slide"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 hover:bg-black/50 text-white backdrop-blur-md transition-colors"
          aria-label="Next Slide"
        >
          <ChevronRight size={24} />
        </button>
      </section>

      {/* Search Functionality Bar */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 relative z-20">
        <form
          onSubmit={handleSearch}
          className="bg-white rounded-2xl shadow-xl border border-gray-100 p-4 sm:p-6 grid grid-cols-1 md:grid-cols-4 gap-4 items-center"
        >
          {/* Keyword Search */}
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

          {/* Category Filter */}
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
              <option value="Data Science">Data Science</option>
            </select>
          </div>

          {/* Skill Level Filter */}
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

          {/* Search Button */}
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

      {/* Highlight Features & Overview of Services */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Core Services & Excellence
            </h2>
            <p className="mt-4 text-gray-600">
              Everything you need to accelerate your career in the technology
              sector.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-8 shadow-sm hover:shadow-md transition-shadow">
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

            <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-8 shadow-sm hover:shadow-md transition-shadow">
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

            <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-8 shadow-sm hover:shadow-md transition-shadow">
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
    </div>
  );
};

export default Home;
