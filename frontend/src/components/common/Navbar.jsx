import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Menu, User, X, Search, ChevronRight } from "lucide-react";
import { useSelector } from "react-redux";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navRef = useRef(null);

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMobileSearchOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
        setMobileSearchOpen(false);
      }
    };

    if (mobileMenuOpen || mobileSearchOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [mobileMenuOpen, mobileSearchOpen]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileSearchOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const navLinkClass = ({ isActive }) =>
    `transition-colors duration-200 text-gray-700 ${
      isActive ? "font-bold text-green-600" : "font-medium hover:text-green-600"
    }`;

  const renderUserAvatar = () => {
    const profileImage = user?.photo || user?.avatar || user?.profilePic;

    if (profileImage) {
      return (
        <img
          src={profileImage}
          alt={user?.fullName || "User Profile"}
          className="h-8 w-8 rounded-full object-cover ring-2 ring-gray-200"
        />
      );
    }

    return (
      <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 shadow-sm transition hover:bg-gray-50">
        <User size={18} />
      </span>
    );
  };

  return (
    <header
      ref={navRef}
      className="sticky top-0 z-50 border-b border-gray-100 bg-[#f5f5f5]/90 backdrop-blur-md"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Mobile Menu Toggle */}
        <button
          type="button"
          className="rounded-lg p-2 text-gray-700 transition hover:bg-gray-200/60 md:hidden"
          onClick={() => {
            setMobileMenuOpen((prev) => !prev);
            if (mobileSearchOpen) setMobileSearchOpen(false);
          }}
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Brand Logo */}
        <Link
          to="/"
          className="absolute left-1/2 -translate-x-1/2 inline-flex shrink-0 text-2xl sm:text-3xl tracking-normal transition-colors duration-200 md:static md:translate-x-0"
          style={{ fontFamily: "'Pacifico', cursive" }}
        >
          <span className="text-black">G</span>
          <span className="text-black">y</span>
          <span className="text-black">a</span>
          <span className="text-black">n</span>
          <span className="text-green-600">T</span>
          <span className="text-green-600">e</span>
          <span className="text-green-600">c</span>
          <span className="text-green-600">h</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden items-center gap-6 md:flex lg:gap-8">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>
          <NavLink to="/courses" className={navLinkClass}>
            Courses
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            About Us
          </NavLink>
          <NavLink to="/demo-classes" className={navLinkClass}>
            Demo Classes
          </NavLink>
          <NavLink to="/blogs" className={navLinkClass}>
            Blogs
          </NavLink>
          <NavLink to="/jobs" className={navLinkClass}>
            Jobs
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>
        </div>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-44 rounded-full border border-gray-200 bg-white py-1.5 pl-9 pr-4 text-xs text-gray-800 placeholder-gray-400 outline-none transition focus:border-green-500 focus:ring-2 focus:ring-green-500/10 lg:w-56"
            />
          </form>

          {!isAuthenticated ? (
            <Link
              to="/login"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50"
              aria-label="Navigate to Login"
            >
              <User size={18} />
            </Link>
          ) : (
            <Link
              to="/profile"
              aria-label="Open profile"
              title={user?.fullName || "Profile"}
              className="flex items-center gap-2 rounded-full p-0.5 transition hover:opacity-80"
            >
              {renderUserAvatar()}
            </Link>
          )}
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center gap-1 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            className="rounded-lg p-2 text-gray-700 transition hover:bg-gray-200/60"
            onClick={() => {
              setMobileSearchOpen((prev) => !prev);
              if (mobileMenuOpen) setMobileMenuOpen(false);
            }}
            aria-label="Toggle search"
          >
            <Search size={22} />
          </button>

          {!isAuthenticated ? (
            <Link
              to="/login"
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-700 shadow-sm transition hover:bg-gray-50"
              aria-label="Navigate to Login"
            >
              <User size={18} />
            </Link>
          ) : (
            <Link
              to="/profile"
              className="flex items-center p-1"
              aria-label="Profile"
            >
              {renderUserAvatar()}
            </Link>
          )}
        </div>
      </nav>

      {/* Mobile Search Input */}
      <div
        className={`overflow-hidden bg-white px-4 transition-all duration-300 ease-in-out md:hidden ${
          mobileSearchOpen
            ? "max-h-20 border-b border-gray-100 py-3 opacity-100"
            : "pointer-events-none max-h-0 py-0 opacity-0"
        }`}
      >
        <form onSubmit={handleSearchSubmit} className="relative">
          <Search
            size={18}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-base text-gray-800 placeholder-gray-400 outline-none transition focus:border-green-500 focus:bg-white sm:text-xs"
          />
        </form>
      </div>

      {/* Mobile Drawer Overlay */}
      <div
        className={`absolute inset-0 top-0 left-0 h-screen w-full z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300 md:hidden ${
          mobileMenuOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMobileMenuOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Side Navigation Drawer */}
      <aside
        className={`absolute top-0 left-0 z-50 h-screen w-72 max-w-[80%] bg-white shadow-2xl transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col overflow-y-auto">
          <div className="flex items-center justify-between bg-green-600 px-4 py-3 text-white">
            <Link
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="inline-flex text-xl tracking-normal text-white"
              style={{ fontFamily: "'Pacifico', cursive" }}
            >
              GyanTech
            </Link>
            <button
              type="button"
              className="rounded-lg p-1 text-white hover:bg-white/20 transition"
              onClick={() => setMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex flex-1 flex-col justify-between px-4 py-4">
            <div className="flex flex-col">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2.5 text-sm font-semibold text-gray-700 hover:text-green-600"
              >
                <span>Home</span>
                <ChevronRight size={16} className="text-gray-400" />
              </Link>
              <Link
                to="/courses"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2.5 text-sm font-semibold text-gray-700 hover:text-green-600"
              >
                <span>Courses</span>
                <ChevronRight size={16} className="text-gray-400" />
              </Link>
              <Link
                to="/about"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2.5 text-sm font-semibold text-gray-700 hover:text-green-600"
              >
                <span>About Us</span>
                <ChevronRight size={16} className="text-gray-400" />
              </Link>
              <Link
                to="/demo-classes"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2.5 text-sm font-semibold text-gray-700 hover:text-green-600"
              >
                <span>Demo Classes</span>
                <ChevronRight size={16} className="text-gray-400" />
              </Link>
              <Link
                to="/blogs"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2.5 text-sm font-semibold text-gray-700 hover:text-green-600"
              >
                <span>Blogs</span>
                <ChevronRight size={16} className="text-gray-400" />
              </Link>
              <Link
                to="/jobs"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between py-2.5 text-sm font-semibold text-gray-700 hover:text-green-600"
              >
                <span>Jobs</span>
                <ChevronRight size={16} className="text-gray-400" />
              </Link>

              {!isAuthenticated && (
                <div className="mt-4 grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    className="rounded-lg bg-green-600 px-3 py-2 text-center text-xs font-bold text-white transition hover:bg-green-700"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="rounded-lg border border-gray-300 px-3 py-2 text-center text-xs font-bold text-gray-700 transition hover:bg-gray-50"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Register
                  </Link>
                </div>
              )}
            </div>

            {isAuthenticated && (
              <div className="mt-4 pt-3">
                <Link
                  to="/profile"
                  className="flex items-center gap-2.5 rounded-lg py-1 text-gray-700 transition hover:bg-gray-50"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {renderUserAvatar()}
                  <div className="flex flex-col min-w-0">
                    <span className="truncate text-xs font-bold text-gray-800">
                      {user?.fullName || "User Profile"}
                    </span>
                    <span className="text-[10px] text-gray-500">View Account</span>
                  </div>
                </Link>
              </div>
            )}
          </div>
        </div>
      </aside>
    </header>
  );
};

export default Navbar;