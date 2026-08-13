import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import { loginUser } from "../api/auth.services";
import { setAuth } from "../redux/authSlice";

const Login = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            setLoading(true);

            const data = await loginUser(formData);

            if (!data?.success || !data?.user) {
                throw new Error(data?.message || "Invalid login response");
            }

            const user = data.user;

            // Store user in Redux
            dispatch(setAuth(user));

            toast.success(data.message || "Login successful");

            // Role-based redirect
            switch (user.role) {
                case "admin":
                    navigate("/admin/dashboard");
                    break;

                case "instructor":
                    navigate("/instructor/dashboard");
                    break;

                case "student":
                    navigate("/student/dashboard");
                    break;

                default:
                    toast.error("Invalid user role");
                    break;
            }
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message || "Login failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <form onSubmit={handleSubmit} className="w-full max-w-md rounded-xl bg-white p-8 shadow-lg">
                <h1 className="text-3xl font-bold">Login</h1>

                <div className="mt-6">
                    <label className="block mb-2">Email</label>

                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        autoComplete="email"
                        className="w-full rounded-lg border px-4 py-3"
                    />
                </div>

                <div className="mt-4">
                    <label className="block mb-2">Password</label>

                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        autoComplete="current-password"
                        className="w-full rounded-lg border px-4 py-3"
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>
            </form>
        </main>
    );
};

export default Login;
