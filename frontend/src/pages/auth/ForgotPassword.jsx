import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Mail, ArrowRight, Loader2, KeyRound, ArrowLeft } from "lucide-react";
import { forgotPassword } from "../../api/auth.services";
import { showSuccess, showError } from "../../utils/toast";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const res = await forgotPassword({ email });
            if (res?.success) {
                showSuccess("OTP sent successfully");
                navigate("/verify-otp", {
                    state: { email },
                });
            }
        } catch (error) {
            showError(error, "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="relative flex min-h-screen items-center justify-center bg-slate-50 px-4 py-12 font-sans antialiased text-slate-800">
            <div className="absolute top-[-10%] left-[-10%] h-125 w-125 rounded-full bg-indigo-600/5 blur-[120px] pointer-events-none" />
            <div className="absolute bottom-[-10%] right-[-10%] h-125 w-125 rounded-full bg-violet-600/5 blur-[120px] pointer-events-none" />

            <div className="relative w-full max-w-md rounded-2xl border border-slate-200/80 bg-white/80 p-6 shadow-xl backdrop-blur-md sm:p-10 my-8">
                <div className="flex flex-col items-center text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-600/20">
                        <KeyRound className="h-6 w-6" />
                    </div>
                    <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-slate-900">
                        Forgot Password
                    </h2>
                    <p className="mt-1.5 text-sm text-slate-500">
                        Enter your email and we'll send you an OTP to reset your password.
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                    <div className="space-y-1.5">
                        <label
                            htmlFor="email"
                            className="text-xs font-semibold uppercase tracking-wider text-slate-600"
                        >
                            Email Address *
                        </label>
                        <div className="relative rounded-lg shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                                <Mail className="h-4 w-4" />
                            </div>
                            <input
                                id="email"
                                type="email"
                                required
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full rounded-xl border border-slate-200 bg-white/60 pl-10 pr-3 py-3 text-slate-900 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-indigo-600/10 sm:text-sm"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="group flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3.5 text-sm font-semibold text-white shadow-md shadow-indigo-600/10 transition-all duration-200 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2 disabled:opacity-60 active:scale-[0.98]"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <span>Sending OTP...</span>
                            </>
                        ) : (
                            <>
                                <span>Send OTP</span>
                                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                            </>
                        )}
                    </button>
                </form>

                <div className="mt-8 text-center">
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

export default ForgotPassword;