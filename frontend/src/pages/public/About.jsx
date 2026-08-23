import { Link } from "react-router-dom";
import { motion, useInView, useMotionValue, useTransform } from "framer-motion";
import { useRef, useEffect } from "react";
import {
  Award,
  BookOpenCheck,
  CheckCircle2,
  Calendar,
  TrendingUp,
  Building2,
  MapPin,
  Globe2,
  Heart,
  Target,
  Users,
  Sparkles,
  ArrowRight,
} from "lucide-react";

// Counter Animation Component for stats
const AnimatedCounter = ({ value }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  // Extract number and suffix (e.g., "5,000+" -> 5000 and "+", "85%" -> 85 and "%")
  const numericVal = parseInt(value.replace(/[^0-9]/g, ""), 10) || 0;
  const suffix = value.replace(/[0-9,]/g, "");

  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => {
    if (value.includes(",")) {
      return Math.round(latest).toLocaleString();
    }
    return Math.round(latest);
  });

  useEffect(() => {
    if (isInView) {
      motionValue.set(numericVal);
    }
  }, [isInView, numericVal, motionValue]);

  return (
    <span ref={ref} className="inline-flex items-center">
      <motion.span>{rounded}</motion.span>
      {suffix}
    </span>
  );
};

const milestones = [
  {
    step: "1",
    icon: Calendar,
    title: "Established: 2017",
    text: "Started with practical programming and web development classes with a mission to bridge the gap between academic theory and real industry demands.",
  },
  {
    step: "2",
    icon: TrendingUp,
    title: "Expanded Services (2019)",
    text: "Expanded our curriculum into design, professional certification preparation, and hands-on corporate technical workshops.",
  },
  {
    step: "3",
    icon: Building2,
    title: "Placement Support & Employer Connects (2022)",
    text: "Introduced structured placement support, direct partner employer connects, and dedicated career counseling for graduates.",
  },
  {
    step: "4",
    icon: MapPin,
    title: "Kathmandu Hub & Training Center",
    text: "Established our central physical training and development headquarters in Kathmandu, serving students and professionals across Bagmati Province.",
  },
  {
    step: "5",
    icon: Globe2,
    title: "International & National Projects (25+)",
    text: "Successfully delivered software solutions, web apps, and technical training projects for clients locally and globally.",
  },
  {
    step: "6",
    icon: Building2,
    title: "Corporate & Institutional Partnerships",
    text: "Collaborated with Microsoft certification providers, Cisco networking bodies, and software companies for reliable career pathways.",
  },
  {
    step: "7",
    icon: Heart,
    title: "Community Tech Initiatives",
    text: "Organized free workshops, tech seminars, and student mentorship initiatives to make IT education accessible to all.",
  },
];

const values = [
  {
    title: "Industry Mentors",
    text: "Learn with instructors who teach from real workplace scenarios and live project work — not slides alone.",
    icon: Users,
  },
  {
    title: "Project-First Learning",
    text: "Build portfolio-ready projects that mirror actual workplace tasks so you can showcase concrete skills to employers.",
    icon: Building2,
  },
  {
    title: "Career Guidance",
    text: "Get actionable advice on resume building, interview preparation, and placement support before and after you graduate.",
    icon: Sparkles,
  },
  {
    title: "Certificates",
    text: "Finish with a recognized Sipalaya InfoTech completion certificate documenting your practical skills and completed work.",
    icon: CheckCircle2,
  },
  {
    title: "Hands-on Practice",
    text: "Intensive lab sessions and coding drills designed to build absolute confidence in technical interviews.",
    icon: BookOpenCheck,
  },
  {
    title: "Flexible Learning Paths",
    text: "Tailored schedules and modern tracks designed for students, working professionals, and corporate teams.",
    icon: Target,
  },
];

const About = () => {
  return (
    <div className="min-h-screen bg-white text-slate-900 pb-20">
      {/* HERO SECTION WITH CLEAN WHITE BACKGROUND & EMBEDDED VIDEO */}
      <section className="relative overflow-hidden bg-white py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-100">
        <div className="absolute top-0 right-0 -z-10 h-96 w-96 rounded-full bg-blue-50 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -z-10 h-96 w-96 rounded-full bg-indigo-50/50 blur-3xl pointer-events-none" />

        <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-2 items-center">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1 text-xs font-bold text-blue-700 mb-4 shadow-2xs">
              <Sparkles size={13} className="text-blue-600 animate-pulse" />{" "}
              GyanTech • Kathmandu, Nepal
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight leading-tight text-slate-900">
              Practical IT Education Built Around{" "}
              <span className="text-blue-600 underline decoration-blue-200 decoration-wavy decoration-1">
                Skills, Confidence, and Jobs
              </span>
            </h1>
            <p className="mt-5 text-sm sm:text-base leading-relaxed text-slate-600 font-medium">
              Sipalaya InfoTech helps learners in Kathmandu and across Nepal
              build career-ready digital skills through guided training,
              certification preparation, corporate workshops, and
              placement-focused support.
            </p>
            <p className="mt-3 text-xs sm:text-sm text-slate-500 font-normal">
              Watch our overview video below to discover how our hands-on
              training model empowers the next generation of tech professionals.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/courses"
                className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 hover:scale-[1.02]"
              >
                Explore Courses <ArrowRight size={16} />
              </Link>
              <Link
                to="/demo-classes"
                className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-6 py-3.5 text-sm font-bold text-slate-700 shadow-xs transition hover:bg-slate-50 hover:scale-[1.02]"
              >
                Schedule a Demo
              </Link>
            </div>
          </motion.div>

          {/* REAL VIDEO EMBED CARD WITH WHITE/SLATE SHADOW STYLING */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="relative rounded-3xl border border-slate-200 bg-slate-950 p-3 sm:p-4 shadow-2xl"
          >
            <div className="relative aspect-video w-full overflow-hidden rounded-2xl bg-slate-900 shadow-inner">
              <iframe
                className="absolute inset-0 h-full w-full border-0"
                src="https://www.youtube.com/embed/5Vjv1ZKTRdE?si=ljPv5CojFwW0X-2c"
                title="Sipalaya InfoTech Kathmandu - Introduction Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* METRICS BAR WITH ANIMATED NUMBER COUNTERS */}
      <section className="border-b border-slate-100 bg-slate-50/60 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard value="5,000+" label="Students trained" />
            <MetricCard value="85%" label="Placement support success" />
            <MetricCard value="40+" label="Corporate workshops" />
            <MetricCard value="20+" label="Course tracks" />
          </div>
        </div>
      </section>

      {/* OUR STORY SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <h2 className="text-3xl sm:text-3xl font-black text-slate-900 tracking-tight mb-6">
          Our Story
        </h2>
        <div className="space-y-4 text-sm sm:text-base leading-relaxed text-slate-600 font-medium">
          <p>
            GyanTech was founded with a clear vision: to make practical
            programming, development, and IT education completely accessible to
            students and career transitioners in Kathmandu and throughout Nepal.
          </p>
          <p>
            Starting with hands-on web development bootcamps, we gradually
            expanded our footprint into specialized training, certification
            preparation, and active corporate hiring partnerships. Located
            centrally in Kathmandu, our facility provides a collaborative
            learning environment equipped with modern resources.
          </p>
          <p>
            Today, we train aspiring software engineers, data professionals,
            designers, and marketers, ensuring they gain real-world experience
            through project-first workflows. Our commitment remains constant:
            building practical skills that directly translate to sustainable
            career opportunities.
          </p>
          <p className="pt-2 text-sm">
            Explore our{" "}
            <Link
              to="/courses"
              className="text-blue-600 font-bold hover:underline"
            >
              IT courses
            </Link>{" "}
            or check out available{" "}
            <Link
              to="/jobs"
              className="text-blue-600 font-bold hover:underline"
            >
              placement opportunities
            </Link>
            .
          </p>
        </div>
      </section>

      {/* JOURNEY TIMELINE & MISSION/VISION SECTION */}
      <section className="bg-slate-50/50 py-20 px-4 sm:px-6 lg:px-8 border-y border-slate-200/60">
        <div className="mx-auto max-w-7xl grid gap-12 lg:grid-cols-[1.1fr_0.9fr] items-start">
          {/* Timeline Column */}
          <div>
            <div className="mb-8">
              <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">
                Growth Milestones
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                Our Journey & Evolution in Kathmandu
              </h2>
            </div>

            <div className="relative pl-6 sm:pl-8 space-y-8 before:absolute before:bottom-3 before:top-3 before:left-3 sm:before:left-3.5 before:w-0.5 before:bg-blue-600/30">
              {milestones.map((item, index) => {
                const IconComponent = item.icon;
                return (
                  <motion.div
                    key={item.step}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="relative flex items-start gap-4"
                  >
                    <div className="absolute -left-6 sm:-left-8 flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border-2 border-blue-600 bg-white text-xs font-bold text-blue-700 shadow-xs z-10">
                      {item.step}
                    </div>

                    <div className="w-full rounded-2xl border border-slate-200/80 bg-white p-5 shadow-2xs hover:shadow-md transition">
                      <div className="flex items-center gap-2.5 text-blue-700 mb-1.5">
                        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue-50">
                          <IconComponent size={15} />
                        </div>
                        <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                          {item.title}
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm leading-relaxed text-slate-600 font-medium">
                        {item.text}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* Mission & Vision Card Box */}
          <div className="lg:sticky lg:top-24 rounded-3xl border border-blue-200/80 bg-white p-8 md:p-10 shadow-xl shadow-blue-900/5">
            <div className="space-y-8">
              <div>
                <div className="flex items-center gap-2 text-blue-700 font-bold mb-2">
                  <Target size={20} />
                  <h3 className="text-xl font-bold text-slate-900">
                    Our Mission
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-slate-600 font-medium">
                  To make practical, mentor-led IT education accessible for
                  learners who want real skills, recognized credentials, and
                  strong career momentum in Nepal's tech ecosystem.
                </p>
              </div>

              <hr className="border-slate-100" />

              <div>
                <div className="flex items-center gap-2 text-blue-700 font-bold mb-2">
                  <Sparkles size={20} />
                  <h3 className="text-xl font-bold text-slate-900">
                    Our Vision
                  </h3>
                </div>
                <p className="text-sm leading-relaxed text-slate-600 font-medium">
                  To become a trusted technology learning and placement hub for
                  students, professionals, and organizations across Kathmandu,
                  Bagmati Province, and beyond.
                </p>
              </div>

              <div className="pt-2">
                <Link
                  to="/demo-classes"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-blue-600 px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-blue-600/20 transition hover:bg-blue-700"
                >
                  Schedule a Consultation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US SECTION */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="inline-block rounded-full bg-blue-100 px-3 py-1 text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">
            Core Strengths
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Why Choose <span className="text-blue-600">GyanTech</span>
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 font-medium">
            Training that respects the learner and aligns directly with current
            workplace demands.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {values.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="rounded-3xl border border-slate-200/80 bg-white p-7 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 mb-5 border border-blue-100">
                    <IconComponent size={22} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm leading-relaxed text-slate-600 font-medium">
                    {item.text}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
};

const MetricCard = ({ value, label }) => (
  <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xs flex flex-col justify-center">
    <div className="flex items-center gap-2 text-blue-700 mb-1">
      <Award size={20} />
      <span className="text-2xl sm:text-3xl font-black text-slate-900">
        <AnimatedCounter value={value} />
      </span>
    </div>
    <p className="text-xs sm:text-sm font-semibold text-slate-600">{label}</p>
  </div>
);

export default About;
