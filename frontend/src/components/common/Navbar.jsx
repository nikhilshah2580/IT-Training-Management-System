import { useState, useEffect, useRef } from "react";
import { Link, NavLink, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
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

    // Close mobile menu when route changes
    useEffect(() => {
        setMobileMenuOpen(false);
    }, [location.pathname]);

    // Close mobile menu on outside click or scroll
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
        `transition-colors duration-200 font-medium ${isActive ? "text-blue-600 font-semibold" : "text-gray-600 hover:text-blue-600"
        }`;

    return (
        <header ref={navRef} className="sticky top-0 z-50 border-b border-gray-100 bg-white/90 backdrop-blur-md">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link to="/" className="text-3xl tracking-normal transition-colors duration-200 hover:text-gray-700 text-black-100" style={{ fontFamily: "'Pacifico', cursive" }}>
                    It Tms
                </Link>   

                {/* Desktop Navigation */}
                <div className="hidden items-center gap-8 md:flex">
                    <NavLink to="/" className={navLinkClass}>Home</NavLink>
                    <NavLink to="/courses" className={navLinkClass}>Courses</NavLink>
                    <NavLink to="/demo-classes" className={navLinkClass}>Demo Classes</NavLink>
                    <NavLink to="/blogs" className={navLinkClass}>Blogs</NavLink>
                    <NavLink to="/job-listings" className={navLinkClass}>Jobs</NavLink>
                    <NavLink to="/contact" className={navLinkClass}>Contact</NavLink>
                </div>

                {/* Desktop Auth */}
                <div className="hidden items-center gap-3 md:flex">
                    {!isAuthenticated ? (
                        <>
                            <Link
                                to="/login"
                                className="rounded-lg px-4 py-2 font-medium text-gray-700 transition hover:bg-gray-100"
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
                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-gray-700 transition hover:bg-gray-100"
                            >
                                <User size={18} className="text-gray-500" />
                                <span className="max-w-30 truncate font-medium">{user?.fullName}</span>
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

                {/* Mobile Hamburger Button */}
                <button
                    type="button"
                    className="rounded-lg p-2 text-gray-700 transition hover:bg-gray-100 md:hidden"
                    onClick={() => setMobileMenuOpen((prev) => !prev)}
                    aria-expanded={mobileMenuOpen}
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
            </nav>

            {/* Mobile Menu Dropdown (Absolute overlay, doesn't shift body content) */}
            <div
                className={`absolute left-0 top-full w-full overflow-hidden bg-white shadow-xl transition-all duration-300 ease-in-out md:hidden ${mobileMenuOpen ? "max-h-125 opacity-100 border-b border-gray-100" : "max-h-0 opacity-0 pointer-events-none"
                    }`}
            >
                <div className="flex flex-col gap-1 px-4 py-5">
                    <NavLink to="/" className={navLinkClass + " py-2 px-3 rounded-lg hover:bg-gray-50"}>Home</NavLink>
                    <NavLink to="/courses" className={navLinkClass + " py-2 px-3 rounded-lg hover:bg-gray-50"}>Courses</NavLink>
                    <NavLink to="/demo-classes" className={navLinkClass + " py-2 px-3 rounded-lg hover:bg-gray-50"}>Demo Classes</NavLink>
                    <NavLink to="/blogs" className={navLinkClass + " py-2 px-3 rounded-lg hover:bg-gray-50"}>Blogs</NavLink>
                    <NavLink to="/job-listings" className={navLinkClass + " py-2 px-3 rounded-lg hover:bg-gray-50"}>Jobs</NavLink>
                    <NavLink to="/contact" className={navLinkClass + " py-2 px-3 rounded-lg hover:bg-gray-50"}>Contact</NavLink>

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
                                    className="flex items-center gap-2 rounded-lg px-3 py-2.5 font-medium text-gray-700 transition hover:bg-gray-50"
                                >
                                    <User size={18} className="text-gray-500" />
                                    {user?.fullName}
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