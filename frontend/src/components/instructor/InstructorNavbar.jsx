import { User } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import NotificationBell from "../notifications/NotificationBell";
import LogoutButton from "../auth/LogoutButton";

const InstructorNavbar = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const fullName = user?.fullName || "Instructor";

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm md:px-6">
            {/* Left */}
            <div className="ml-12 md:ml-0">
                <h2 className="text-lg font-semibold text-slate-800">
                    Instructor Panel
                </h2>

                <p className="hidden text-xs text-slate-500 sm:block">
                    Manage your courses and students
                </p>
            </div>

            {/* Right */}
            <div className="flex items-center gap-2">
                <NotificationBell />

                {/* Profile */}
                <button
                    type="button"
                    onClick={() => navigate("/instructor/profile")}
                    aria-label="Open instructor profile"
                    title="Profile"
                    className="flex h-10 w-10 items-center justify-center rounded-full transition hover:bg-slate-100"
                >
                    {user?.photo ? (
                        <img
                            src={user.photo}
                            alt={fullName}
                            className="h-9 w-9 rounded-full object-cover ring-2 ring-blue-100"
                        />
                    ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-100 text-slate-500 ring-2 ring-blue-100">
                            <User size={18} />
                        </div>
                    )}
                </button>
                    <LogoutButton className="inline-flex items-center justify-center rounded-full p-2 text-red-600 transition hover:bg-red-50" iconOnly />
                </div>
            </header>
    );
};

export default InstructorNavbar;



