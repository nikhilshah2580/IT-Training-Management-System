import { User } from "lucide-react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LogoutButton from "../auth/LogoutButton";
import NotificationBell from "../notifications/NotificationBell";

const StudentNavbar = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth);
    const fullName = user?.fullName || "Student";
    const initials = fullName
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-white px-4 shadow-sm md:px-6">
            <div className="ml-12 md:ml-0">
                <h2 className="text-lg font-semibold text-slate-800">
                    Student Panel
                </h2>
                <p className="hidden text-xs text-slate-500 sm:block">
                    Manage your learning
                </p>
            </div>

            <div className="flex items-center gap-2">
                <NotificationBell />

                <button
                    type="button"
                    onClick={() => navigate("/profile")}
                    className="flex items-center gap-3 rounded-lg px-2 py-1.5 transition hover:bg-slate-100"
                >
                    {user?.photo ? (
                        <img
                            src={user.photo}
                            alt={fullName}
                            className="h-9 w-9 rounded-full object-cover ring-2 ring-blue-100"
                        />
                    ) : (
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                            {initials || "S"}
                        </div>
                    )}

                    <div className="hidden text-left md:block">
                        <p className="max-w-36 truncate text-sm font-semibold text-slate-800">
                            {fullName}
                        </p>
                        <p className="text-xs capitalize text-slate-500">
                            {user?.role || "student"}
                        </p>
                    </div>

                    <User size={17} className="hidden text-slate-400 sm:block" />
                </button>

                <LogoutButton
                    className="inline-flex items-center justify-center rounded-full p-2 text-red-600 transition hover:bg-red-50"
                    iconOnly
                />
            </div>
        </header>
    );
};

export default StudentNavbar;
