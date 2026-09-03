import { useState } from "react";
import { motion } from "framer-motion";
import {
  PhoneCall,
  Mail,
  User,
  BookOpen,
  MessageSquare,
  CheckCircle2,
  Sparkles,
  Send,
} from "lucide-react";

const Counselling = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    courseOfInterest: "Web Development",
    message: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      // Simulate backend submission API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setSubmitted(true);
    } catch {
      setError("Something went wrong. Please try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 pb-20">
      {/* Hero Header Section */}
      <section className="relative overflow-hidden bg-white pt-16 pb-12 px-4 sm:px-6 lg:px-8 text-center border-b border-slate-100">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 h-125 w-125 rounded-full bg-blue-50 blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-6">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-4 py-1.5 text-xs font-bold text-blue-600 shadow-2xs"
          >
            <Sparkles size={14} className="text-blue-600 animate-pulse" />{" "}
            GyanTech • Free Career Guidance
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-slate-900 leading-tight"
          >
            Book Your Free{" "}
            <span className="text-blue-600">Counselling Session</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="text-sm sm:text-base text-slate-600 font-medium max-w-2xl mx-auto leading-relaxed"
          >
            Confused about which IT path fits your career goals? Talk directly
            with our senior industry mentors in Kathmandu, Nepal. Get clear
            guidance on learning tracks, internships, and job placements.
          </motion.p>
        </div>
      </section>

      {/* Main Content & Form Grid */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Left Info Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="lg:col-span-5 space-y-6 bg-slate-50 border border-slate-200 p-8 rounded-3xl"
          >
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Why Book a Session With Us?
            </h2>

            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 border border-blue-200 rounded-xl text-blue-600 mt-1">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    One-on-One Expert Advice
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                    Discuss your background and current skill level to find the
                    ideal specialization.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 border border-blue-200 rounded-xl text-blue-600 mt-1">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Roadmap to Internships
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                    Learn how our training transitions into real hands-on agency
                    projects and job placements.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-blue-100 border border-blue-200 rounded-xl text-blue-600 mt-1">
                  <CheckCircle2 size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    100% Free & No Obligation
                  </h3>
                  <p className="text-xs text-slate-600 leading-relaxed mt-0.5">
                    The session is entirely free of charge, designed purely to
                    help you make an informed decision.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-200 space-y-3">
              <div className="text-xs font-semibold text-slate-500">
                Prefer direct contact? Call us at:
              </div>
              <a
                href="tel:+9779800000000"
                className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700"
              >
                <PhoneCall size={16} /> +977-9800000000 / 9788888888
              </a>
            </div>
          </motion.div>

          {/* Right Form Component */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="lg:col-span-7 bg-white border border-slate-200 p-8 sm:p-10 rounded-3xl shadow-xl relative overflow-hidden"
          >
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={32} />
                </div>
                <h3 className="text-2xl font-black text-slate-900">
                  Session Requested Successfully!
                </h3>
                <p className="text-sm text-slate-600 max-w-md mx-auto leading-relaxed">
                  Thank you,{" "}
                  <span className="text-slate-900 font-bold">
                    {formData.fullName}
                  </span>
                  . One of our career advisors will contact you shortly via
                  phone or email to schedule your session.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setFormData({
                        fullName: "",
                        email: "",
                        phone: "",
                        courseOfInterest: "Web Development",
                        message: "",
                      });
                    }}
                    className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs px-6 py-3 rounded-xl transition-colors"
                  >
                    Submit Another Request
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
                  Fill Out Your Details
                </h2>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 p-3 rounded-xl text-xs font-medium">
                    {error}
                  </div>
                )}

                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Full Name
                  </label>
                  <div className="relative">
                    <User
                      size={16}
                      className="absolute left-3.5 top-3.5 text-slate-400"
                    />
                    <input
                      type="text"
                      name="fullName"
                      required
                      placeholder="e.g. Ram Sharma"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full bg-slate-50 text-xs text-slate-900 border border-slate-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                    />
                  </div>
                </div>

                {/* Email and Phone Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail
                        size={16}
                        className="absolute left-3.5 top-3.5 text-slate-400"
                      />
                      <input
                        type="email"
                        name="email"
                        required
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full bg-slate-50 text-xs text-slate-900 border border-slate-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700 block">
                      Phone Number
                    </label>
                    <div className="relative">
                      <PhoneCall
                        size={16}
                        className="absolute left-3.5 top-3.5 text-slate-400"
                      />
                      <input
                        type="tel"
                        name="phone"
                        required
                        placeholder="98XXXXXXXX"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full bg-slate-50 text-xs text-slate-900 border border-slate-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                      />
                    </div>
                  </div>
                </div>

                {/* Course of Interest Selection */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Area / Course of Interest
                  </label>
                  <div className="relative">
                    <BookOpen
                      size={16}
                      className="absolute left-3.5 top-3.5 text-slate-400"
                    />
                    <select
                      name="courseOfInterest"
                      value={formData.courseOfInterest}
                      onChange={handleChange}
                      className="w-full bg-slate-50 text-xs text-slate-900 border border-slate-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all cursor-pointer"
                    >
                      <option value="Web Development">
                        Web Development (MERN / React)
                      </option>
                      <option value="Programming">
                        Programming (Python / Java / C++)
                      </option>
                      <option value="Data Science & Analytics">
                        Data Science & Analytics
                      </option>
                      <option value="Graphic Design">
                        Graphic Design & UI/UX
                      </option>
                      <option value="Cyber Security">
                        Cyber Security & Networking
                      </option>
                      <option value="Cloud Computing">
                        Cloud Computing & DevOps
                      </option>
                      <option value="Not Sure">
                        Not Sure / Need General Guidance
                      </option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 block">
                    Your Goals or Questions (Optional)
                  </label>
                  <div className="relative">
                    <MessageSquare
                      size={16}
                      className="absolute left-3.5 top-3.5 text-slate-400"
                    />
                    <textarea
                      name="message"
                      rows="4"
                      placeholder="Tell us a bit about your current background or what you aim to achieve..."
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full bg-slate-50 text-xs text-slate-900 border border-slate-200 rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all resize-none"
                    ></textarea>
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-xs sm:text-sm py-4 rounded-xl shadow-lg shadow-blue-600/20 transition-all duration-200 hover:scale-[1.01] disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? (
                    "Submitting Request..."
                  ) : (
                    <>
                      Book Free Session Now <Send size={16} />
                    </>
                  )}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Counselling;
