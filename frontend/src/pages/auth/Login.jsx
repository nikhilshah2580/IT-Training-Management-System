import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { Lock, Mail, Eye, EyeOff, Loader2 } from "lucide-react";

import { loginSchema } from "../../schemas/auth.schema";
import { loginUser } from "../../api/auth.services";
import { setAuth } from "../../redux/authSlice";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // Initialize React Hook Form with Zod Resolver
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // HANDLE LOGIN SUBMISSION
  const onSubmit = async (data) => {
    try {
      const payload = {
        email: data.email.trim().toLowerCase(),
        password: data.password,
      };

      const response = await loginUser(payload);

      if (!response?.success || !response?.user) {
        throw new Error(response?.message || "Invalid login response");
      }

      const user = response.user;

      // Store user in Redux
      dispatch(setAuth(user));

      toast.success(response.message || "Login successful");

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
      toast.error(
        error?.response?.data?.message || error?.message || "Login failed",
      );
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50/50 px-4 py-12">
      <div className="w-full max-w-md">
        {/* CARD */}
        <div className="rounded-3xl bg-white border border-slate-100 p-8 sm:p-10 shadow-xl shadow-slate-200/50">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Please enter your details to sign in
            </p>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-5"
          >
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
              >
                Email Address
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                  <Mail size={18} />
                </span>
                <input
                  id="email"
                  type="email"
                  {...register("email")}
                  placeholder="name@example.com"
                  autoComplete="email"
                  disabled={isSubmitting}
                  className={`w-full rounded-2xl border bg-slate-50/50 py-3.5 pl-11 pr-4 text-base sm:text-sm text-slate-900 outline-none transition focus:bg-white focus:ring-4 ${
                    errors.email
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                      : "border-slate-200 focus:border-blue-600 focus:ring-blue-600/10"
                  } disabled:bg-slate-100`}
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-xs text-red-600 font-medium">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
              >
                Password
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                  <Lock size={18} />
                </span>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  {...register("password")}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  disabled={isSubmitting}
                  className={`w-full rounded-2xl border bg-slate-50/50 py-3.5 pl-11 pr-12 text-base sm:text-sm text-slate-900 outline-none transition focus:bg-white focus:ring-4 ${
                    errors.password
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                      : "border-slate-200 focus:border-blue-600 focus:ring-blue-600/10"
                  } disabled:bg-slate-100`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  disabled={isSubmitting}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 disabled:opacity-50 transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              {errors.password && (
                <p className="mt-1 text-xs text-red-600 font-medium">
                  {errors.password.message}
                </p>
              )}

              {/* Forgot password link */}
              <div className="flex justify-end mt-2">
                <Link
                  to="/forgot-password"
                  className="text-xs font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full flex items-center justify-center rounded-2xl bg-blue-600 px-4 py-3.5 font-bold text-white shadow-lg shadow-blue-500/25 hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-600/10 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm"
            >
              {isSubmitting ? (
                <>
                  <Loader2 size={18} className="animate-spin mr-2" />
                  Signing in...
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Signup Footer Link */}
          <div className="text-center mt-8 pt-6 border-t border-slate-100">
            <p className="text-sm text-slate-600">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Login;
