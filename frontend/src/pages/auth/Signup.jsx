import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react";

import { signupSchema } from "../../schemas/auth.schema";
import { signupUser } from "../../api/auth.services";

const Signup = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  // Initialize React Hook Form with Zod Resolver
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  // HANDLE SIGNUP SUBMISSION
  const onSubmit = async (data) => {
    try {
      const payload = {
        fullName: data.fullName.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
      };

      const response = await signupUser(payload);

      if (!response?.success) {
        throw new Error(response?.message || "Signup failed");
      }

      toast.success(response.message || "Account created successfully");

      navigate("/verify-email", {
        state: { email: payload.email },
        replace: true,
      });
    } catch (error) {
      toast.error(
        error?.response?.data?.message || error?.message || "Signup failed",
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
              Create Account
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Join our IT Training Management System
            </p>
          </div>

          {/* FORM */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className="space-y-5"
          >
            {/* Full Name */}
            <div>
              <label
                htmlFor="fullName"
                className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500"
              >
                Full Name
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none text-slate-400">
                  <User size={18} />
                </span>
                <input
                  id="fullName"
                  type="text"
                  {...register("fullName")}
                  placeholder="Enter your full name"
                  autoComplete="name"
                  disabled={isSubmitting}
                  className={`w-full rounded-2xl border bg-slate-50/50 py-3.5 pl-11 pr-4 text-base sm:text-sm text-slate-900 outline-none transition focus:bg-white focus:ring-4 ${
                    errors.fullName
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500/10"
                      : "border-slate-200 focus:border-blue-600 focus:ring-blue-600/10"
                  } disabled:bg-slate-100`}
                />
              </div>
              {errors.fullName && (
                <p className="mt-1 text-xs text-red-600 font-medium">
                  {errors.fullName.message}
                </p>
              )}
            </div>

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
                  placeholder="Enter your email"
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
                  placeholder="Create a password"
                  autoComplete="new-password"
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

              {errors.password ? (
                <p className="mt-1 text-xs text-red-600 font-medium">
                  {errors.password.message}
                </p>
              ) : (
                <p className="mt-2 text-xs text-slate-500 font-medium">
                  Password must contain at least 6 characters.
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="mt-2 w-full rounded-2xl bg-blue-600 px-4 py-3.5 font-bold text-white shadow-lg shadow-blue-500/25 transition-all hover:bg-blue-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Creating Account..." : "Create Account"}
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center text-sm text-slate-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-blue-600 hover:text-blue-700"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Signup;
