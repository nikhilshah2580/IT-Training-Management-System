import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { logoutUser } from "../../api/auth.services";
import { clearAuth } from "../../redux/authSlice";

const LogoutButton = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            await logoutUser();

            dispatch(clearAuth());

            toast.success("Logged out successfully");

            navigate("/login", {
                replace: true,
            });
        } catch (error) {
            toast.error(error?.response?.data?.message || "Logout failed");
        }
    };

    return (
        <button
            onClick={handleLogout}
            className="rounded-lg bg-red-600 px-4 py-2 text-white"
        >
            Logout
        </button>
    );
};

export default LogoutButton;
