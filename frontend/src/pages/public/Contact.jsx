import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import {
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  Sparkles,
} from "lucide-react";

import { FaFacebookF, FaTiktok, FaInstagram } from "react-icons/fa";

import { createContact } from "../../api/contact.services";

const initialForm = {
  name: "",
  email: "",
  subject: "Course Inquiry",
  message: "",
};

const purposes = [
  "Course Inquiry",
  "Demo Class Booking",
  "Admission Support",
  "Corporate Workshop",
  "Technical Support",
  "Job Placement",
];

const contactItems = [
  {
    icon: MapPin,
    label: "Address",
    value: "Narephat-32, Koteshwor, Kathmandu",
    color:
      "from-amber-500/10 to-orange-500/10 text-orange-600 border-orange-200/60",
  },
  {
    icon: Phone,
    label: "Phone",
    value: "9851344071",
    href: "tel:9851344071",
    color:
      "from-emerald-500/10 to-teal-500/10 text-emerald-600 border-emerald-200/60",
  },
  {
    icon: Mail,
    label: "Email",
    value: "gyantech@sipalaya.com",
    href: "mailto:infotech@sipalaya.com",
    color:
      "from-blue-500/10 to-indigo-500/10 text-indigo-600 border-indigo-200/60",
  },
];

const Contact = () => {
  const [form, setForm] = useState(initialForm);

  const mutation = useMutation({
    mutationFn: createContact,
    onSuccess: (response) => {
      toast.success(response?.message || "Message sent successfully");
      setForm(initialForm);
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to send message");
    },
  });

  const updateField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    mutation.mutate(form);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 text-slate-900 pb-20">
      {/* COMPACT & VIBRANT COLORFUL HERO SECTION */}
      <section className="relative overflow-hidden bg-linear-to-r from-indigo-900 via-purple-900 to-blue-900 py-14 px-4 sm:px-6 lg:px-8 text-white shadow-md">
        <div className="absolute -top-12 -right-12 h-64 w-64 rounded-full bg-pink-500/30 blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 h-64 w-64 rounded-full bg-cyan-500/30 blur-2xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="relative z-10 mx-auto max-w-7xl"
        >
          <div className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-3.5 py-1 text-xs font-bold text-pink-300 backdrop-blur-md shadow-sm mb-3">
            <Sparkles size={13} className="text-pink-400 animate-pulse" /> Let's
            Connect
          </div>
          <h1 className="max-w-3xl text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-white leading-snug">
            Ask about courses, admissions, workshops, or support.
          </h1>
          <p className="mt-2.5 max-w-2xl text-xs sm:text-sm leading-relaxed text-slate-200 font-medium">
            Send your inquiry and the Sipalaya InfoTech team will follow up with
            course guidance, demo details, or technical help.
          </p>
        </motion.div>
      </section>

      {/* MAIN GRID */}
      <section className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        {/* LEFT COLUMN: INFO & MAP */}
        <div className="space-y-6">
          {/* DIRECT CONTACT CARD */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="rounded-3xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-xs hover:shadow-xl transition-shadow duration-300"
          >
            <h2 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight">
              Reach us directly
            </h2>
            <div className="mt-6 space-y-5">
              {contactItems.map(({ icon: Icon, label, value, href, color }) => (
                <div
                  key={label}
                  className="group flex items-center gap-4 transition"
                >
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br border shadow-2xs transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6 ${color}`}
                  >
                    <Icon size={20} />
                  </div>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        className="text-sm md:text-base font-bold text-slate-800 transition hover:text-indigo-600"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm md:text-base font-bold text-slate-800">
                        {value}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* SOCIAL LINKS CARD (EXTERNAL LINKS) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="rounded-3xl border border-slate-200/80 bg-white p-6 md:p-8 shadow-xs hover:shadow-xl transition-shadow duration-300"
          >
            <h2 className="text-lg md:text-xl font-bold text-slate-900 tracking-tight mb-4">
              Social links
            </h2>
            <div className="flex flex-wrap gap-3">
              <SocialLink href="https://facebook.com" icon={FaFacebookF}>
                Facebook
              </SocialLink>
              <SocialLink href="https://instagram.com" icon={FaInstagram}>
                Instagram
              </SocialLink>
              <SocialLink href="https://tiktok.com" icon={FaTiktok}>
                TikTok
              </SocialLink>
            </div>
          </motion.div>

          {/* MAP CONTAINER */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xs p-2 hover:shadow-xl transition-shadow duration-300"
          >
            <iframe
              title="Sipalaya InfoTech location"
              src="https://www.google.com/maps?q=Narephat%2032%20Koteshwor%20Kathmandu&output=embed"
              className="h-72 w-full rounded-2xl contrast-125 hover:grayscale-0 transition duration-500"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </motion.div>
        </div>

        {/* RIGHT COLUMN: FORM */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          onSubmit={handleSubmit}
          className="rounded-3xl border border-slate-200/80 bg-white p-6 md:p-10 shadow-xl shadow-indigo-500/5 space-y-6"
        >
          <div className="flex items-center gap-4 border-b border-slate-100 pb-5">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-linear-to-tr from-indigo-600 via-purple-600 to-pink-600 text-white shadow-md shadow-indigo-500/20">
              <MessageSquare size={22} />
            </div>
            <div>
              <h2 className="text-lg md:text-xl font-bold text-slate-900">
                Send an inquiry
              </h2>
              <p className="text-xs md:text-sm text-slate-400 font-medium">
                We usually respond within one working day.
              </p>
            </div>
          </div>

          <div className="grid gap-5">
            <Field label="Full name">
              <input
                required
                name="name"
                value={form.name}
                onChange={updateField}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                placeholder="Your name"
              />
            </Field>

            <Field label="Email address">
              <input
                required
                type="email"
                name="email"
                value={form.email}
                onChange={updateField}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                placeholder="you@example.com"
              />
            </Field>

            <Field label="Purpose">
              <select
                name="subject"
                value={form.subject}
                onChange={updateField}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
              >
                {purposes.map((purpose) => (
                  <option key={purpose} value={purpose}>
                    {purpose}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Message">
              <textarea
                required
                name="message"
                value={form.message}
                onChange={updateField}
                rows={5}
                className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
                placeholder="Tell us what you need help with..."
              />
            </Field>
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-linear-to-r from-indigo-600 via-purple-600 to-pink-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-indigo-500/25 transition-all duration-300 hover:scale-[1.01] hover:shadow-pink-500/20 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Send size={17} />
            {mutation.isPending ? "Sending message..." : "Send Message"}
          </button>
        </motion.form>
      </section>
    </div>
  );
};

const Field = ({ label, children }) => (
  <label className="block">
    <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
      {label}
    </span>
    {children}
  </label>
);

const SocialLink = ({ href, icon: Icon, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="group inline-flex items-center gap-2 rounded-2xl border border-slate-200/80 bg-slate-50/50 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:border-indigo-300 hover:bg-indigo-50/30 hover:text-indigo-600 active:scale-95"
  >
    <Icon size={17} className="transition group-hover:scale-110" />
    {children}
  </a>
);

export default Contact;
