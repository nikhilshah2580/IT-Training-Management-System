import { Bell, UserCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const InstructorNavbar = () => {
    const navigate = useNavigate();

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
                {/* Notifications */}
                <button
                    type="button"
                    onClick={() => navigate("/notifications")}
                    className="relative rounded-full p-2 text-slate-600 transition hover:bg-slate-100"
                >
                    <Bell size={21} />

                    <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
                </button>

                {/* Profile */}
                <button
                    type="button"
                    onClick={() => navigate("/instructor/profile")}
                    className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition hover:bg-slate-100"
                >
                    <UserCircle size={30} className="text-slate-600" />

                    <div className="hidden text-left md:block">
                        <p className="text-sm font-medium text-slate-800">
                            Instructor
                        </p>

                        <p className="text-xs text-slate-500">
                            View Profile
                        </p>
                    </div>
                </button>
            </div>
        </header>
    );
};

export default InstructorNavbar;