import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { Menu, X, User, LogOut } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";

import { logoutUser } from "../../api/auth.services";
import { clearAuth } from "../../redux/authSlice";

const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const { user, isAuthenticated } = useSelector((state) => state.auth);

    const handleLogout = async () => {
        try {
            await logoutUser();

            dispatch(clearAuth());

            toast.success("Logged out successfully");

            setMobileMenuOpen(false);

            navigate("/login", {
                replace: true,
            });
        } catch (error) {
            toast.error(error?.response?.data?.message || "Logout failed");
        }
    };

    const navLinkClass = ({ isActive }) =>
        `transition ${isActive ? "font-semibold text-blue-600" : "text-gray-700 hover:text-blue-600"}`;

    return (
        <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
            <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
                {/* Logo */}
                <Link
                    to="/"
                    className="text-2xl font-bold text-blue-600"
                    onClick={() => setMobileMenuOpen(false)}
                >
                    Sipalaya
                </Link>

                {/* Desktop Navigation */}
                <div className="hidden items-center gap-7 md:flex">
                    <NavLink to="/" className={navLinkClass}>
                        Home
                    </NavLink>

                    <NavLink to="/courses" className={navLinkClass}>
                        Courses
                    </NavLink>

                    <NavLink to="/demo-classes" className={navLinkClass}>
                        Demo Classes
                    </NavLink>

                    <NavLink to="/blogs" className={navLinkClass}>
                        Blogs
                    </NavLink>

                    <NavLink to="/job-listings" className={navLinkClass}>
                        Jobs
                    </NavLink>

                    <NavLink to="/contact" className={navLinkClass}>
                        Contact
                    </NavLink>
                </div>

                {/* Desktop Auth */}
                <div className="hidden items-center gap-3 md:flex">
                    {!isAuthenticated ? (
                        <>
                            <Link
                                to="/login"
                                className="rounded-lg px-4 py-2 font-medium text-gray-700 hover:bg-gray-100"
                            >
                                Login
                            </Link>

                            <Link
                                to="/signup"
                                className="rounded-lg bg-blue-600 px-5 py-2 font-semibold text-white hover:bg-blue-700"
                            >
                                Signup
                            </Link>
                        </>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link
                                to="/profile"
                                className="flex items-center gap-2 rounded-lg px-3 py-2 hover:bg-gray-100"
                            >
                                <User size={19} />

                                <span className="max-w-32 truncate">{user?.fullName}</span>
                            </Link>

                            <button
                                type="button"
                                onClick={handleLogout}
                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-red-600 hover:bg-red-50"
                            >
                                <LogOut size={18} />
                                Logout
                            </button>
                        </div>
                    )}
                </div>

                {/* Mobile Button */}
                <button
                    type="button"
                    className="rounded-lg p-2 hover:bg-gray-100 md:hidden"
                    onClick={() => setMobileMenuOpen((prev) => !prev)}
                    aria-label="Toggle menu"
                >
                    {mobileMenuOpen ? <X size={25} /> : <Menu size={25} />}
                </button>
            </nav>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="border-t bg-white px-4 pb-5 pt-3 md:hidden">
                    <div className="flex flex-col gap-2">
                        <NavLink to="/" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>
                            Home
                        </NavLink>

                        <NavLink
                            to="/courses"
                            className={navLinkClass}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Courses
                        </NavLink>

                        <NavLink
                            to="/demo-classes"
                            className={navLinkClass}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Demo Classes
                        </NavLink>

                        <NavLink to="/blogs" className={navLinkClass} onClick={() => setMobileMenuOpen(false)}>
                            Blogs
                        </NavLink>

                        <NavLink
                            to="/job-listings"
                            className={navLinkClass}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Jobs
                        </NavLink>

                        <NavLink
                            to="/contact"
                            className={navLinkClass}
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            Contact
                        </NavLink>

                        <div className="mt-3 border-t pt-3">
                            {!isAuthenticated ? (
                                <div className="flex flex-col gap-2">
                                    <Link
                                        to="/login"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="rounded-lg px-4 py-2 text-center font-medium hover:bg-gray-100"
                                    >
                                        Login
                                    </Link>

                                    <Link
                                        to="/signup"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="rounded-lg bg-blue-600 px-4 py-2 text-center font-semibold text-white hover:bg-blue-700"
                                    >
                                        Signup
                                    </Link>
                                </div>
                            ) : (
                                <div className="flex flex-col gap-2">
                                    <Link
                                        to="/profile"
                                        onClick={() => setMobileMenuOpen(false)}
                                        className="flex items-center gap-2 rounded-lg px-4 py-2 hover:bg-gray-100"
                                    >
                                        <User size={18} />
                                        {user?.fullName}
                                    </Link>

                                    <button
                                        type="button"
                                        onClick={handleLogout}
                                        className="flex items-center gap-2 rounded-lg px-4 py-2 text-left text-red-600 hover:bg-red-50"
                                    >
                                        <LogOut size={18} />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
    