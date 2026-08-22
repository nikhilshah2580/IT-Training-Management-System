import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { LogOut, Menu, User, X, Search } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { logoutUser } from "../../api/auth.services";
import { clearAuth } from "../../redux/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
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

    const handleScroll = () => {
      if (mobileMenuOpen) setMobileMenuOpen(false);
      if (mobileSearchOpen) setMobileSearchOpen(false);
    };

    if (mobileMenuOpen || mobileSearchOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      window.addEventListener("scroll", handleScroll, { passive: true });
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("scroll", handleScroll);
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

  const handleLogout = async () => {
    try {
      await logoutUser();
      dispatch(clearAuth());
      toast.success("Logged out successfully");
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  };

  const navLinkClass = ({ isActive }) =>
    `transition-colors duration-200 font-medium ${
      isActive
        ? "text-blue-600 font-semibold"
        : "text-gray-600 hover:text-blue-600"
    }`;

  // Helper to render user avatar or fallback icon
  const renderUserAvatar = () => {
    const profileImage = user?.photo || user?.avatar || user?.profilePic;

    if (profileImage) {
      return (
        <img
          src={profileImage}
          alt={user?.fullName || "User Profile"}
          className="h-9 w-9 rounded-full object-cover ring-2 ring-blue-500/20"
        />
      );
    }

    return (
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50 text-blue-600 ring-2 ring-blue-500/20">
        <User size={18} />
      </span>
    );
  };

  return (
    <header
      ref={navRef}
      className="sticky top-0 z-50 border-b border-gray-100 bg-[#f5f5f5]/90 backdrop-blur-md"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="inline-flex shrink-0 text-3xl tracking-normal transition-colors duration-200"
          style={{ fontFamily: "'Pacifico', cursive" }}
        >
          <span className="text-black">G</span>
          <span className="text-black">y</span>
          <span className="text-black">a</span>
          <span className="text-black">n</span>
          <span className="text-red-600">T</span>
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

        {/* Desktop Actions (Search + Auth) */}
        <div className="hidden items-center gap-3 md:flex">
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
              className="w-44 rounded-full border border-gray-200 bg-white py-1.5 pl-9 pr-4 text-xs text-gray-800 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 lg:w-56"
            />
          </form>

          {!isAuthenticated ? (
            <>
              <Link
                to="/login"
                className="rounded-lg px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-200/60"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="rounded-lg bg-blue-600 px-4 py-2 font-semibold text-white shadow-sm transition hover:bg-blue-700"
              >
                Signup
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                aria-label="Open profile"
                title={user?.fullName || "Profile"}
                className="flex items-center gap-2 rounded-full p-0.5 transition hover:opacity-80"
              >
                {renderUserAvatar()}
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Action Buttons */}
        <div className="flex items-center gap-1 md:hidden">
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

          {/* Quick Profile Link in Mobile Top Bar when authenticated */}
          {isAuthenticated && (
            <Link
              to="/profile"
              className="flex items-center p-1"
              aria-label="Profile"
            >
              {renderUserAvatar()}
            </Link>
          )}

          <button
            type="button"
            className="rounded-lg p-2 text-gray-700 transition hover:bg-gray-200/60"
            onClick={() => {
              setMobileMenuOpen((prev) => !prev);
              if (mobileSearchOpen) setMobileSearchOpen(false);
            }}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </nav>

      {/* Mobile Expandable Search Bar */}
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
            className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-4 text-base text-gray-800 placeholder-gray-400 outline-none transition focus:border-blue-500 focus:bg-white sm:text-xs"
          />
        </form>
      </div>

      {/* Mobile Dropdown Menu */}
      <div
        className={`absolute left-0 top-full w-full overflow-hidden bg-white shadow-xl transition-all duration-300 ease-in-out md:hidden ${
          mobileMenuOpen
            ? "max-h-[80vh] overflow-y-auto border-b border-gray-100 opacity-100"
            : "pointer-events-none max-h-0 opacity-0"
        }`}
      >
        <div className="flex flex-col gap-1 px-4 py-5">
          <NavLink
            to="/"
            className={navLinkClass + " rounded-lg px-3 py-2 hover:bg-gray-50"}
          >
            Home
          </NavLink>
          <NavLink
            to="/courses"
            className={navLinkClass + " rounded-lg px-3 py-2 hover:bg-gray-50"}
          >
            Courses
          </NavLink>
          <NavLink
            to="/about"
            className={navLinkClass + " rounded-lg px-3 py-2 hover:bg-gray-50"}
          >
            About Us
          </NavLink>
          <NavLink
            to="/demo-classes"
            className={navLinkClass + " rounded-lg px-3 py-2 hover:bg-gray-50"}
          >
            Demo Classes
          </NavLink>
          <NavLink
            to="/blogs"
            className={navLinkClass + " rounded-lg px-3 py-2 hover:bg-gray-50"}
          >
            Blogs
          </NavLink>
          <NavLink
            to="/jobs"
            className={navLinkClass + " rounded-lg px-3 py-2 hover:bg-gray-50"}
          >
            Jobs
          </NavLink>
          <NavLink
            to="/contact"
            className={navLinkClass + " rounded-lg px-3 py-2 hover:bg-gray-50"}
          >
            Contact
          </NavLink>

          <div className="mt-4 border-t border-gray-100 pt-4">
            {!isAuthenticated ? (
              <div className="grid grid-cols-2 gap-2">
                <Link
                  to="/login"
                  className="rounded-lg border border-gray-200 px-4 py-2.5 text-center font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="rounded-lg bg-blue-600 px-4 py-2.5 text-center font-semibold text-white transition hover:bg-blue-700"
                >
                  Signup
                </Link>
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <Link
                  to="/profile"
                  className="flex items-center gap-3 rounded-lg px-3 py-2.5 font-medium text-gray-700 transition hover:bg-gray-50"
                >
                  {renderUserAvatar()}
                  <span className="min-w-0 truncate font-semibold">
                    {user?.fullName || "User Profile"}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex items-center gap-2 rounded-lg px-3 py-2.5 font-medium text-red-600 transition hover:bg-red-50"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
