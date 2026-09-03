import { ArrowUpRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const PublicPageHero = ({
  eyebrow = "",
  title,
  accent,
  description,
  actionLabel = "Get Started",
  actionTo = "/",
  className = "",
  compact = false,
}) => {
  // Stagger animation container for smoother sequential loads
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  return (
    <section
      className={`relative isolate overflow-hidden bg-[#0b142a] px-4 py-8 text-white sm:px-6 sm:py-10 lg:px-8 ${className}`}
    >
      {/* Dark gradient background */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(115deg,#0b142a_0%,#0e172d_62%,#1c1726_100%)]" />

      {/* Hero Content Wrapper */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="mx-auto flex max-w-5xl flex-col items-center text-center"
      >
        {/* Eyebrow Badge */}
        {eyebrow && (
          <motion.div variants={itemVariants}>
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-500/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.16em] text-blue-300 shadow-[0_0_24px_rgba(42,117,255,0.12)] backdrop-blur-md">
              <Sparkles size={14} className="text-blue-400 animate-pulse" />
              {eyebrow}
            </div>
          </motion.div>
        )}

        {/* Main Title with Multi-Style Underline */}
        <motion.h1
          variants={itemVariants}
          className={`relative text-3xl font-black leading-none tracking-[-0.03em] sm:text-4xl lg:text-5xl ${compact ? "mt-0" : "mt-4"}`}
          style={{ fontFamily: "'Trebuchet MS', system-ui, sans-serif" }}
        >
          {title}{" "}
          {accent && (
            <span className="block text-[#155bd5] sm:inline">{accent}</span>
          )}
          {/* Decorative Underline */}
          <div className="relative mx-auto mt-2.5 h-1 w-36 max-w-full origin-center rounded-full overflow-hidden sm:mt-3 sm:w-48 lg:w-56">
            <div className="absolute inset-0 bg-[#155bd5] shadow-[0_0_18px_rgba(21,91,213,0.3)]" />
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "circOut" }}
              className="absolute left-[30%] right-0 h-full bg-[#f59b18] shadow-[0_0_18px_rgba(245,155,24,0.4)]"
            />
          </div>
        </motion.h1>

        {/* Description */}
        {description && (
          <motion.p
            variants={itemVariants}
            className={`${compact ? "mt-2" : "mt-4"} max-w-2xl text-xs leading-6 text-slate-300/95 sm:text-sm`}
          >
            {description}
          </motion.p>
        )}

        {/* Action Button */}
        {actionLabel && (
          <motion.div
            variants={itemVariants}
            className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <Link
              to={actionTo}
              className="group inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-600/20 px-4 py-2 text-[10px] font-extrabold uppercase tracking-widest text-blue-200 transition-all duration-300 hover:border-orange-300/50 hover:bg-orange-400/10 hover:text-orange-200 hover:shadow-[0_0_20px_rgba(245,155,24,0.25)]"
            >
              {actionLabel}
              <ArrowUpRight
                size={16}
                className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </Link>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
};

export default PublicPageHero;
