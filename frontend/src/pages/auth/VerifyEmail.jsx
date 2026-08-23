import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Mail,
  ShieldCheck,
  ArrowRight,
  Loader2,
  RefreshCw,
  ArrowLeft,
} from "lucide-react";
import api from "../../api/apiClient";
import { showSuccess, showError } from "../../utils/toast";

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  // If no email was passed in state, redirect to signup or login
  useEffect(() => {
    if (!email) {
      // Optional: you can redirect them or let them type the email manually
    }
  }, [email]);

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const response = await api.post("/users/verify-email", { email, otp });
      if (response?.data?.success) {
        showSuccess("Email verified successfully! Please log in.");
        navigate("/login");
      }
    } catch (error) {
      showError(error, "Failed to verify email");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (!email) {
      showError("Please enter your email address first.");
      return;
    }
    try {
      setResending(true);
      const response = await api.post("/users/resend-verification-otp", {
        email,
      });
      if (response?.data?.success) {
        showSuccess("New verification OTP sent to your email.");
      }
    } catch (error) {
      showError(error, "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 font-sans antialiased text-slate-800">
      <div className="absolute top-[-10%] left-[-10%] h-125 w-125 rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] h-125 w-125 rounded-full bg-violet-600/5 blur-[120px] pointer-events-none" />

      <div className="relative w-full max-w-md rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-xl backdrop-blur-md sm:p-10 my-8">
        <div className="flex flex-col items-center text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
            Verify Your Email
          </h2>
          <p className="mt-1.5 text-sm text-slate-500">
            We've sent a verification code to{" "}
            <span className="font-semibold text-slate-700">
              {email || "your email"}
            </span>
          </p>
        </div>

        <form onSubmit={handleVerify} className="mt-8 space-y-5">
          {/* Optional email field if user came here manually */}
          {!location.state?.email && (
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-slate-600">
                Email Address *
              </label>
              <div className="relative rounded-lg shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-xl border border-slate-200 bg-white/60 pl-10 pr-3 py-3 text-slate-900 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-600/10 sm:text-sm"
                />
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label
              htmlFor="otp"
              className="text-xs font-semibold uppercase tracking-wider text-slate-600"
            >
              Verification OTP *
            </label>
            <input
              id="otp"
              type="text"
              maxLength={6}
              required
              placeholder="Enter 6-digit code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="block w-full rounded-xl border border-slate-200 bg-white/60 px-4 py-3 text-center tracking-widest text-slate-900 placeholder-slate-400 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-600/10 text-lg font-bold sm:text-lg"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/10 transition-all duration-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:opacity-60 active:scale-[0.98]"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Verifying...</span>
              </>
            ) : (
              <>
                <span>Verify Email</span>
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </button>
        </form>

        <div className="mt-6 flex items-center justify-between text-sm">
          <span className="text-slate-500">Didn't receive code?</span>
          <button
            type="button"
            onClick={handleResendOtp}
            disabled={resending}
            className="inline-flex items-center gap-1 font-semibold text-indigo-600 hover:text-indigo-700 disabled:opacity-50"
          >
            {resending && <RefreshCw className="h-3 w-3 animate-spin" />}
            Resend OTP
          </button>
        </div>

        <div className="mt-8 text-center border-t border-slate-100 pt-6">
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Log In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
