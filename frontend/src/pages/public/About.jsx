import { Link } from "react-router-dom";
import {
  Award,
  BookOpenCheck,
  CheckCircle2,
  Handshake,
  Milestone,
  Target,
  Users,
} from "lucide-react";

const milestones = [
  ["2017", "Started with practical programming and web development classes."],
  ["2019", "Expanded into design, certification preparation, and workshops."],
  ["2022", "Introduced structured placement support and employer connects."],
  ["2026", "Built a complete learning platform for students and instructors."],
];

const values = [
  "Project-first learning with real workplace scenarios.",
  "Mentorship from instructors with industry experience.",
  "Career guidance, interview preparation, and placement support.",
  "Flexible learning paths for students, professionals, and teams.",
];

const partners = [
  "Microsoft certification preparation",
  "Cisco networking fundamentals",
  "Local software companies",
  "Hiring and internship partners",
  "Corporate training clients",
  "Community tech events",
];

const About = () => {
  return (
    <div className="bg-white text-slate-900">
      <section
        id="company-overview"
        className="scroll-mt-24 bg-slate-950 text-white"
      >
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8 lg:py-24">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-300">
              About Sipalaya InfoTech
            </p>
            <h1 className="mt-4 max-w-3xl text-4xl font-bold tracking-tight sm:text-5xl">
              Practical IT education built around skills, confidence, and jobs.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-slate-300">
              Sipalaya InfoTech helps learners build career-ready digital skills
              through guided training, certification preparation, corporate
              workshops, and placement-focused support.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/courses"
                className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700"
              >
                Explore Courses
              </Link>
              <Link
                to="/demo-classes"
                className="rounded-lg border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:bg-white/10"
              >
                Schedule a Demo
              </Link>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Metric value="5,000+" label="Students trained" />
            <Metric value="85%" label="Placement support success" />
            <Metric value="40+" label="Corporate workshops" />
            <Metric value="20+" label="Course tracks" />
          </div>
        </div>
      </section>

      <section id="mission-vision" className="scroll-mt-24 py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
          <InfoPanel
            icon={Target}
            title="Mission"
            text="To make practical, mentor-led IT education accessible for learners who want real skills, recognized credentials, and career momentum."
          />
          <InfoPanel
            icon={BookOpenCheck}
            title="Vision"
            text="To become a trusted technology learning hub for students, professionals, and organizations across Nepal and beyond."
          />
          <InfoPanel
            icon={Users}
            title="Approach"
            text="We combine classroom guidance, project practice, feedback loops, demo sessions, resources, and placement assistance."
          />
        </div>
      </section>

      <section id="our-team" className="scroll-mt-24 bg-slate-50 py-16">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              Growth Milestones
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              Meet the team and the platform built around learners.
            </h2>
            <p className="mt-4 text-sm leading-6 text-slate-600">
              The platform supports course discovery, demo classes, student
              dashboards, instructor workflows, assignments, attendance,
              certificates, reviews, testimonials, jobs, and placement records.
            </p>
          </div>
          <div className="space-y-4">
            {milestones.map(([year, text]) => (
              <div
                key={year}
                className="flex gap-4 rounded-lg border border-slate-200 bg-white p-5"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                  <Milestone size={20} />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">{year}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="why-choose-us" className="scroll-mt-24 py-16">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
              What We Stand For
            </p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight">
              Training that respects the learner and the workplace.
            </h2>
            <div className="mt-8 space-y-3">
              {values.map((value) => (
                <div key={value} className="flex items-start gap-3">
                  <CheckCircle2
                    size={19}
                    className="mt-0.5 shrink-0 text-emerald-600"
                  />
                  <span className="text-sm leading-6 text-slate-700">
                    {value}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Handshake size={22} />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-indigo-600">
                  Partnerships & Affiliations
                </p>
                <h3 className="text-xl font-bold">Industry connections</h3>
              </div>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {partners.map((partner) => (
                <div
                  key={partner}
                  className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700"
                >
                  {partner}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const Metric = ({ value, label }) => (
  <div className="rounded-lg border border-white/10 bg-white/5 p-6">
    <div className="flex items-center gap-2 text-blue-200">
      <Award size={19} />
      <span className="text-3xl font-bold text-white">{value}</span>
    </div>
    <p className="mt-2 text-sm text-slate-300">{label}</p>
  </div>
);

const InfoPanel = ({ icon: Icon, title, text }) => (
  <article className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
      <Icon size={24} />
    </div>
    <h2 className="mt-5 text-xl font-bold">{title}</h2>
    <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
  </article>
);

export default About;
