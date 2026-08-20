import { Bell, User } from "lucide-react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const AdminNavbar = () => {
    const { user } = useSelector((state) => state.auth);
    const fullName = user?.fullName || "Admin";
    const initials = fullName
        .split(" ")
        .map((part) => part[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    return (
        <header className="sticky top-0 z-40 border-b bg-white">
            <div className="flex h-16 items-center justify-between px-4 md:px-6">
                {/* Left */}
                <div>
                    <h1 className="text-xl font-semibold text-gray-800">
                        Admin Dashboard
                    </h1>

                    <p className="hidden text-sm text-gray-500 sm:block">
                        Manage your training platform
                    </p>
                </div>

                {/* Right */}
                <div className="flex items-center gap-3">
                    {/* Notifications */}
                    <Link
                        to="/admin/notifications"
                        className="relative rounded-lg p-2 text-gray-600 hover:bg-gray-100"
                        title="Notifications"
                    >
                        <Bell size={21} />

                        <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500" />
                    </Link>

                    {/* Profile */}
                    <Link
                        to="/profile"
                        className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-gray-100"
                    >
                        {user?.photo ? (
                            <img
                                src={user.photo}
                                alt={fullName}
                                className="h-9 w-9 rounded-full object-cover ring-2 ring-blue-100"
                            />
                        ) : (
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                                {initials || "A"}
                            </div>
                        )}

                        <div className="hidden text-left sm:block">
                            <p className="text-sm font-semibold text-gray-800">
                                {fullName}
                            </p>

                            <p className="text-xs capitalize text-gray-500">
                                {user?.role || "admin"}
                            </p>
                        </div>

                        <User size={17} className="hidden text-gray-400 sm:block" />
                    </Link>
                </div>
            </div>
        </header>
    );
};

export default AdminNavbar;
