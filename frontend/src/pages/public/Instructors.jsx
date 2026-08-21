import { useQuery } from "@tanstack/react-query";
import {
  Award,
  BriefcaseBusiness,
  ExternalLink,
  Globe,
  GraduationCap,
  Loader2,
  UserRound,
} from "lucide-react";

import { getApprovedInstructors } from "../../api/instructorProfile.services";

const fallbackInstructors = [
  {
    _id: "fallback-web",
    user: { fullName: "Senior Web Development Mentor" },
    designation: "Full Stack Instructor",
    specialization: "MERN Stack, REST APIs, Frontend Engineering",
    qualification: "BSc CSIT, AWS Cloud Practitioner",
    experience: 7,
    bio: "Guides learners through production-style projects, code reviews, deployment, and interview preparation.",
    skills: ["React", "Node.js", "MongoDB", "JavaScript"],
    achievements: ["Mentored 800+ learners", "Led 25+ corporate workshops"],
  },
  {
    _id: "fallback-design",
    user: { fullName: "Creative Design Mentor" },
    designation: "Graphic Design Instructor",
    specialization: "Adobe Photoshop, Illustrator, Brand Design",
    qualification: "Certified Adobe Design Professional",
    experience: 6,
    bio: "Helps students build strong visual fundamentals, portfolio pieces, and client-ready design workflows.",
    skills: ["Photoshop", "Illustrator", "Branding", "UI Basics"],
    achievements: ["Built portfolio tracks", "Trained freelance designers"],
  },
];

const Instructors = () => {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["approved-instructors"],
    queryFn: getApprovedInstructors,
  });

  const apiInstructors = data?.instructors || data?.profiles || [];
  const instructors = apiInstructors.length
    ? apiInstructors
    : fallbackInstructors;

  return (
    <div className="bg-white text-slate-900">
      <section className="border-b border-slate-200 bg-slate-50">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="text-sm font-semibold uppercase tracking-wide text-blue-600">
            Instructor Team
          </p>
          <h1 className="mt-3 max-w-3xl text-4xl font-bold tracking-tight">
            Learn from mentors with practical industry experience.
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-600">
            Meet the trainers behind Sipalaya InfoTech courses, workshops,
            assignments, feedback, and certification preparation.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-16 text-slate-500">
            <Loader2 size={22} className="mr-2 animate-spin" />
            Loading instructors...
          </div>
        ) : (
          <>
            {isError && (
              <div className="mb-6 rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Live instructor profiles could not be loaded. Showing sample
                instructor highlights.
              </div>
            )}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {instructors.map((instructor) => (
                <InstructorCard
                  key={instructor._id || instructor.user?.email}
                  instructor={instructor}
                />
              ))}
            </div>
          </>
        )}
      </section>
    </div>
  );
};

const InstructorCard = ({ instructor }) => {
  const name =
    instructor.user?.fullName ||
    instructor.instructor?.fullName ||
    instructor.fullName ||
    "Instructor";
  const photo =
    instructor.profilePhoto ||
    instructor.user?.photo ||
    instructor.instructor?.photo ||
    "";
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <article className="flex h-full flex-col rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start gap-4">
        {photo ? (
          <img
            src={photo}
            alt={name}
            className="h-16 w-16 rounded-lg object-cover"
          />
        ) : (
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-lg font-bold text-blue-700">
            {initials || <UserRound size={24} />}
          </div>
        )}
        <div className="min-w-0">
          <h2 className="text-lg font-bold text-slate-900">{name}</h2>
          <p className="mt-1 text-sm font-medium text-blue-600">
            {instructor.designation || "Instructor"}
          </p>
        </div>
      </div>

      <p className="mt-5 line-clamp-4 text-sm leading-6 text-slate-600">
        {instructor.bio || "Experienced trainer and mentor."}
      </p>

      <div className="mt-5 space-y-3 text-sm text-slate-700">
        <InfoRow icon={BriefcaseBusiness}>
          {instructor.experience || 0}+ years experience
        </InfoRow>
        <InfoRow icon={GraduationCap}>
          {instructor.qualification || "Professional qualification"}
        </InfoRow>
        <InfoRow icon={Award}>
          {instructor.specialization || "Technology training"}
        </InfoRow>
      </div>

      {Array.isArray(instructor.skills) && instructor.skills.length > 0 && (
        <div className="mt-5 flex flex-wrap gap-2">
          {instructor.skills.slice(0, 5).map((skill) => (
            <span
              key={skill}
              className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700"
            >
              {skill}
            </span>
          ))}
        </div>
      )}

      {Array.isArray(instructor.achievements) &&
        instructor.achievements.length > 0 && (
          <ul className="mt-5 space-y-2 border-t border-slate-100 pt-5">
            {instructor.achievements.slice(0, 2).map((achievement) => (
              <li key={achievement} className="text-sm text-slate-600">
                {achievement}
              </li>
            ))}
          </ul>
        )}

      <div className="mt-auto flex gap-2 pt-5">
        <ProfileLink
          href={instructor.linkedin}
          label="LinkedIn"
          icon={ExternalLink}
        />
        <ProfileLink
          href={instructor.github}
          label="GitHub"
          icon={ExternalLink}
        />
        <ProfileLink href={instructor.website} label="Website" icon={Globe} />
      </div>
    </article>
  );
};

const InfoRow = ({ icon: Icon, children }) => (
  <div className="flex items-start gap-2">
    <Icon size={17} className="mt-0.5 shrink-0 text-blue-600" />
    <span className="leading-6">{children}</span>
  </div>
);

const ProfileLink = ({ href, label, icon: Icon }) => {
  if (!href) return null;
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
      aria-label={label}
      title={label}
    >
      <Icon size={17} />
    </a>
  );
};

export default Instructors;
