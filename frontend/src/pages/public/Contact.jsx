import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  ExternalLink,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
} from "lucide-react";

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
  },
  { icon: Phone, label: "Phone", value: "9851344071", href: "tel:9851344071" },
  {
    icon: Mail,
    label: "Email",
    value: "infotech@sipalaya.com",
    href: "mailto:infotech@sipalaya.com",
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
    <div className="bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Contact Us
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight">
            Ask about courses, admissions, workshops, or support.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
            Send your inquiry and the Sipalaya InfoTech team will follow up with
            course guidance, demo details, or technical help.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div className="space-y-6">
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-bold">Reach us directly</h2>
            <div className="mt-6 space-y-4">
              {contactItems.map(({ icon: Icon, label, value, href }) => (
                <div key={label} className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                    <Icon size={19} />
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                      {label}
                    </p>
                    {href ? (
                      <a
                        href={href}
                        className="text-sm font-medium text-slate-900 hover:text-blue-600"
                      >
                        {value}
                      </a>
                    ) : (
                      <p className="text-sm font-medium text-slate-900">
                        {value}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <h2 className="text-xl font-bold">Social links</h2>
            <div className="mt-5 flex flex-wrap gap-3">
              <SocialButton href="https://facebook.com" icon={ExternalLink}>
                Facebook
              </SocialButton>
              <SocialButton href="https://linkedin.com" icon={ExternalLink}>
                LinkedIn
              </SocialButton>
              <SocialButton href="https://instagram.com" icon={ExternalLink}>
                Instagram
              </SocialButton>
            </div>
          </div>

          <div className="overflow-hidden rounded-lg border border-slate-200 bg-slate-100">
            <iframe
              title="Sipalaya InfoTech location"
              src="https://www.google.com/maps?q=Narephat%2032%20Koteshwor%20Kathmandu&output=embed"
              className="h-72 w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm"
        >
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
              <MessageSquare size={21} />
            </div>
            <div>
              <h2 className="text-xl font-bold">Send an inquiry</h2>
              <p className="text-sm text-slate-500">
                We usually respond within one working day.
              </p>
            </div>
          </div>

          <div className="mt-6 grid gap-5">
            <Field label="Full name">
              <input
                required
                name="name"
                value={form.name}
                onChange={updateField}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="you@example.com"
              />
            </Field>
            <Field label="Purpose">
              <select
                name="subject"
                value={form.subject}
                onChange={updateField}
                className="w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
                rows={6}
                className="w-full resize-none rounded-lg border border-slate-200 px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                placeholder="Tell us what you need help with..."
              />
            </Field>
          </div>

          <button
            type="submit"
            disabled={mutation.isPending}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            <Send size={17} />
            {mutation.isPending ? "Sending..." : "Send Message"}
          </button>
        </form>
      </section>
    </div>
  );
};

const Field = ({ label, children }) => (
  <label className="block">
    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">
      {label}
    </span>
    {children}
  </label>
);

const SocialButton = ({ href, icon: Icon, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noreferrer"
    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
  >
    <Icon size={17} />
    {children}
  </a>
);

export default Contact;
