import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { LogOut, Menu, User, X } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { logoutUser } from "../../api/auth.services";
import { clearAuth } from "../../redux/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navRef = useRef(null);

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (navRef.current && !navRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };

    const handleScroll = () => {
      if (mobileMenuOpen) setMobileMenuOpen(false);
    };

    if (mobileMenuOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
      window.addEventListener("scroll", handleScroll, { passive: true });
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [mobileMenuOpen]);

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

  return (
    <header
      ref={navRef}
      className="sticky top-0 z-50 border-b border-gray-100 bg-[#f5f5f5]/90 backdrop-blur-md"
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        <Link
          to="/"
          className="text-3xl tracking-normal transition-colors duration-200 inline-flex"
          style={{ fontFamily: "'Pacifico', cursive" }}
        >
          {/* First 4 letters in Color 1 */}
          <span className="text-black">S</span>
          <span className="text-black">i</span>
          <span className="text-black">p</span>
          <span className="text-black">a</span>

          {/* Last 4 letters in Color 2 */}
          <span className="text-red-600">l</span>
          <span className="text-green-600">a</span>
          <span className="text-green-600">y</span>
          <span className="text-green-600">a</span>
        </Link>

        {/* Desktop Nav Links */}
        <div className="hidden items-center gap-8 md:flex">
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
                title="Profile"
                className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-gray-200/60"
              >
                {user?.photo ? (
                  <img
                    src={user.photo}
                    alt={user?.fullName || "Profile"}
                    className="h-9 w-9 rounded-full object-cover ring-2 ring-blue-100"
                  />
                ) : (
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-200 text-gray-600 ring-2 ring-blue-100">
                    <User size={18} />
                  </span>
                )}
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-lg px-3 py-2 font-medium text-red-600 transition hover:bg-red-50"
              >
                <LogOut size={18} />
                Logout
              </button>
            </div>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          className="rounded-lg p-2 text-gray-700 transition hover:bg-gray-200/60 md:hidden"
          onClick={() => setMobileMenuOpen((prev) => !prev)}
          aria-expanded={mobileMenuOpen}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Dropdown Menu */}
      <div
        className={`absolute left-0 top-full w-full overflow-hidden bg-white shadow-xl transition-all duration-300 ease-in-out md:hidden ${
          mobileMenuOpen
            ? "max-h-[80vh] overflow-y-auto border-b border-gray-100 opacity-100"
            : "max-h-0 opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex flex-col gap-1 px-4 py-5">
          <NavLink
            to="/"
            className={navLinkClass + " py-2 px-3 rounded-lg hover:bg-gray-50"}
          >
            Home
          </NavLink>
          <NavLink
            to="/courses"
            className={navLinkClass + " py-2 px-3 rounded-lg hover:bg-gray-50"}
          >
            Courses
          </NavLink>
          <NavLink
            to="/about"
            className={navLinkClass + " py-2 px-3 rounded-lg hover:bg-gray-50"}
          >
            About Us
          </NavLink>
          <NavLink
            to="/demo-classes"
            className={navLinkClass + " py-2 px-3 rounded-lg hover:bg-gray-50"}
          >
            Demo Classes
          </NavLink>
          <NavLink
            to="/blogs"
            className={navLinkClass + " py-2 px-3 rounded-lg hover:bg-gray-50"}
          >
            Blogs
          </NavLink>
          <NavLink
            to="/jobs"
            className={navLinkClass + " py-2 px-3 rounded-lg hover:bg-gray-50"}
          >
            Jobs
          </NavLink>
          <NavLink
            to="/contact"
            className={navLinkClass + " py-2 px-3 rounded-lg hover:bg-gray-50"}
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
                  {user?.photo ? (
                    <img
                      src={user.photo}
                      alt={user?.fullName || "Profile"}
                      className="h-9 w-9 rounded-full object-cover ring-2 ring-blue-100"
                    />
                  ) : (
                    <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-gray-500 ring-2 ring-blue-100">
                      <User size={18} />
                    </span>
                  )}
                  <span className="min-w-0 truncate">{user?.fullName}</span>
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
