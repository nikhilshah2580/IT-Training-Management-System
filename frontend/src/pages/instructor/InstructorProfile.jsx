import { useQuery } from "@tanstack/react-query";
import {
  Award,
  Briefcase,
  CheckCircle,
  ExternalLink,
  Code2,
  Globe,
  GraduationCap,
  LinkIcon,
  Mail,
  Pencil,
  Phone,
  UserCircle,
} from "lucide-react";
import { Link } from "react-router-dom";

import { getMyInstructorProfile } from "../../api/instructorProfile.services";

const statusStyles = {
  Approved: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  Rejected: "bg-red-100 text-red-700",
};

const DetailItem = ({ icon: Icon, label, value }) => {
  if (!value && value !== 0) return null;

  return (
    <div className="flex items-start gap-3 rounded-lg border border-slate-200 bg-white p-4">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-700">
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase text-slate-400">
          {label}
        </p>
        <p className="mt-1 break-words text-sm font-medium text-slate-800">
          {value}
        </p>
      </div>
    </div>
  );
};

const ChipList = ({ title, items = [] }) => {
  if (!items.length) return null;

  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      <div className="mt-4 flex flex-wrap gap-2">
        {items.map((item) => (
          <span
            key={item}
            className="rounded-full bg-slate-100 px-3 py-1.5 text-sm font-medium text-slate-700"
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
};

const SocialLink = ({ href, icon: Icon, label }) => {
  if (!href) return null;

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700"
    >
      <Icon size={16} />
      {label}
      <ExternalLink size={14} />
    </a>
  );
};

const InstructorProfile = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["my-instructor-profile"],
    queryFn: getMyInstructorProfile,
    retry: false,
  });

  const profile = data?.profile;
  const user = profile?.user;
  const name = user?.fullName || "Instructor";
  const photo = profile?.profilePhoto || user?.photo;
  const status = profile?.status || "Pending";

  if (isLoading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
        Loading instructor profile...
      </div>
    );
  }

  if (isError) {
    const message =
      error?.response?.data?.message || "Instructor profile not found";

    return (
      <section className="rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-700">
          <UserCircle size={28} />
        </div>
        <h1 className="mt-4 text-xl font-bold text-slate-900">
          Complete your instructor profile
        </h1>
        <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-500">
          {message}. Add your bio, specialization, experience, and links so
          admins can review your profile.
        </p>
        <Link
          to="/instructor/profile/edit"
          className="mt-5 inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
        >
          <Pencil size={16} />
          Create Profile
        </Link>
      </section>
    );
  }

  return (
    <div className="space-y-6">
      <section className="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="h-28 bg-gradient-to-r from-blue-600 via-slate-800 to-emerald-600" />

        <div className="px-5 pb-5 sm:px-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end">
              {photo ? (
                <img
                  src={photo}
                  alt={name}
                  className="-mt-12 h-24 w-24 rounded-full border-4 border-white object-cover shadow-md"
                />
              ) : (
                <div className="-mt-12 flex h-24 w-24 items-center justify-center rounded-full border-4 border-white bg-blue-600 text-3xl font-bold text-white shadow-md">
                  {name.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="min-w-0 pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-bold text-slate-900">{name}</h1>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-bold ${
                      statusStyles[status] || statusStyles.Pending
                    }`}
                  >
                    {status}
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium text-slate-600">
                  {profile.designation}
                </p>
              </div>
            </div>

            <Link
              to="/instructor/profile/edit"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              <Pencil size={16} />
              Edit Profile
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <DetailItem
          icon={Briefcase}
          label="Designation"
          value={profile.designation}
        />
        <DetailItem
          icon={GraduationCap}
          label="Qualification"
          value={profile.qualification}
        />
        <DetailItem
          icon={Award}
          label="Specialization"
          value={profile.specialization}
        />
        <DetailItem
          icon={CheckCircle}
          label="Experience"
          value={`${profile.experience || 0} years`}
        />
        <DetailItem icon={Mail} label="Email" value={user?.email} />
        <DetailItem icon={Phone} label="Phone" value={user?.phone} />
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-base font-semibold text-slate-900">Bio</h2>
        <p className="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600">
          {profile.bio}
        </p>
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <ChipList title="Skills" items={profile.skills} />
        <ChipList title="Expertise" items={profile.expertise} />
        <ChipList title="Achievements" items={profile.achievements} />
      </div>

      {(profile.linkedin || profile.github || profile.website) && (
        <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
          <h2 className="text-base font-semibold text-slate-900">Links</h2>
          <div className="mt-4 flex flex-wrap gap-3">
            <SocialLink
              href={profile.linkedin}
              icon={LinkIcon}
              label="LinkedIn"
            />
            <SocialLink href={profile.github} icon={Code2} label="GitHub" />
            <SocialLink href={profile.website} icon={Globe} label="Website" />
          </div>
        </section>
      )}
    </div>
  );
};

export default InstructorProfile;
