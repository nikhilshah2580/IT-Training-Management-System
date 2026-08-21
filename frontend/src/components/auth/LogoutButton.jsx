import { LogOut } from "lucide-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { logoutUser } from "../../api/auth.services";
import { clearAuth } from "../../redux/authSlice";

const LogoutButton = ({
  className = "inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700",
  iconOnly = false,
}) => {
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
      type="button"
      onClick={handleLogout}
      className={className}
      title="Logout"
    >
      <LogOut size={17} />
      {!iconOnly && <span>Logout</span>}
    </button>
  );
};

export default LogoutButton;
