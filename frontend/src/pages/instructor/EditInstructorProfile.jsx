import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Camera, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

import {
    createInstructorProfile,
    getMyInstructorProfile,
    updateInstructorProfile,
} from "../../api/instructorProfile.services";
import { showError, showSuccess } from "../../utils/toast";

const initialForm = {
    bio: "",
    designation: "",
    specialization: "",
    qualification: "",
    experience: "",
    skills: [],
    expertise: [],
    achievements: [],
    linkedin: "",
    github: "",
    website: "",
    profilePhoto: "",
    photoFile: null,
};

const listToText = (items) => (Array.isArray(items) ? items.join("\n") : "");

const textToList = (value) =>
    value
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean);

const EditInstructorProfile = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [form, setForm] = useState(initialForm);
    const [skillsText, setSkillsText] = useState("");
    const [expertiseText, setExpertiseText] = useState("");
    const [achievementsText, setAchievementsText] = useState("");

    const { data, isLoading, isError } = useQuery({
        queryKey: ["my-instructor-profile"],
        queryFn: getMyInstructorProfile,
        retry: false,
    });

    const profile = data?.profile;
    const isCreateMode = isError || !profile;

    useEffect(() => {
        if (!profile) return;

        setForm({
            bio: profile.bio || "",
            designation: profile.designation || "",
            specialization: profile.specialization || "",
            qualification: profile.qualification || "",
            experience: profile.experience ?? "",
            skills: Array.isArray(profile.skills) ? profile.skills : [],
            expertise: Array.isArray(profile.expertise) ? profile.expertise : [],
            achievements: Array.isArray(profile.achievements) ? profile.achievements : [],
            linkedin: profile.linkedin || "",
            github: profile.github || "",
            website: profile.website || "",
            profilePhoto: profile.profilePhoto || profile.user?.photo || "",
            photoFile: null,
        });
        setSkillsText(listToText(profile.skills));
        setExpertiseText(listToText(profile.expertise));
        setAchievementsText(listToText(profile.achievements));
    }, [profile]);

    const mutation = useMutation({
        mutationFn: (payload) =>
            isCreateMode
                ? createInstructorProfile(payload)
                : updateInstructorProfile(payload),
        onSuccess: (response) => {
            showSuccess(response?.message || "Instructor profile saved");
            queryClient.invalidateQueries({ queryKey: ["my-instructor-profile"] });
            navigate("/instructor/profile");
        },
        onError: (error) => showError(error, "Failed to save instructor profile"),
    });

    const handleChange = (event) => {
        const { name, value } = event.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0] || null;

        setForm((prev) => ({
            ...prev,
            photoFile: file,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const payload = new FormData();
        payload.append("bio", form.bio.trim());
        payload.append("designation", form.designation.trim());
        payload.append("specialization", form.specialization.trim());
        payload.append("qualification", form.qualification.trim());
        payload.append("experience", form.experience || 0);
        payload.append("skills", JSON.stringify(textToList(skillsText)));
        payload.append("expertise", JSON.stringify(textToList(expertiseText)));
        payload.append("achievements", JSON.stringify(textToList(achievementsText)));
        payload.append("linkedin", form.linkedin.trim());
        payload.append("github", form.github.trim());
        payload.append("website", form.website.trim());

        if (form.photoFile) {
            payload.append("photo", form.photoFile);
        }

        mutation.mutate(payload);
    };

    const previewPhoto = form.photoFile
        ? URL.createObjectURL(form.photoFile)
        : form.profilePhoto;

    if (isLoading) {
        return (
            <div className="rounded-lg border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 shadow-sm">
                Loading profile form...
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    onClick={() => navigate("/instructor/profile")}
                    className="rounded-lg border bg-white p-2 transition hover:bg-slate-50"
                >
                    <ArrowLeft size={20} />
                </button>

                <div>
                    <h1 className="text-2xl font-bold text-slate-900">
                        {isCreateMode ? "Create Instructor Profile" : "Edit Instructor Profile"}
                    </h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Updates are sent for admin approval.
                    </p>
                </div>
            </div>

            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Profile Photo</h2>

                <div className="mt-5 flex flex-col gap-4 sm:flex-row sm:items-center">
                    {previewPhoto ? (
                        <img
                            src={previewPhoto}
                            alt="Instructor preview"
                            className="h-24 w-24 rounded-full object-cover ring-2 ring-blue-100"
                        />
                    ) : (
                        <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                            <Camera size={30} />
                        </div>
                    )}

                    <label className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50">
                        <Camera size={16} />
                        Upload Photo
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="hidden"
                        />
                    </label>
                </div>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Basic Information</h2>

                <div className="mt-5 grid gap-5 md:grid-cols-2">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Designation *
                        </label>
                        <input
                            name="designation"
                            value={form.designation}
                            onChange={handleChange}
                            required
                            maxLength={150}
                            className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                            placeholder="Senior Web Instructor"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Specialization *
                        </label>
                        <input
                            name="specialization"
                            value={form.specialization}
                            onChange={handleChange}
                            required
                            maxLength={200}
                            className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                            placeholder="MERN Stack"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Qualification *
                        </label>
                        <input
                            name="qualification"
                            value={form.qualification}
                            onChange={handleChange}
                            required
                            maxLength={500}
                            className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                            placeholder="Bachelor in Computer Science"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Experience
                        </label>
                        <input
                            type="number"
                            name="experience"
                            value={form.experience}
                            onChange={handleChange}
                            min="0"
                            className="w-full rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                            placeholder="3"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Bio *
                        </label>
                        <textarea
                            name="bio"
                            value={form.bio}
                            onChange={handleChange}
                            required
                            rows={5}
                            maxLength={2000}
                            className="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                            placeholder="Write your teaching background and expertise."
                        />
                    </div>
                </div>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Skills and Achievements</h2>

                <div className="mt-5 grid gap-5 md:grid-cols-3">
                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Skills
                        </label>
                        <textarea
                            value={skillsText}
                            onChange={(event) => setSkillsText(event.target.value)}
                            rows={6}
                            className="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                            placeholder="React&#10;Node.js&#10;MongoDB"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Expertise
                        </label>
                        <textarea
                            value={expertiseText}
                            onChange={(event) => setExpertiseText(event.target.value)}
                            rows={6}
                            className="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                            placeholder="Frontend Architecture&#10;API Design"
                        />
                    </div>

                    <div>
                        <label className="mb-2 block text-sm font-medium text-slate-700">
                            Achievements
                        </label>
                        <textarea
                            value={achievementsText}
                            onChange={(event) => setAchievementsText(event.target.value)}
                            rows={6}
                            className="w-full resize-none rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                            placeholder="Trained 500+ students&#10;AWS Certified"
                        />
                    </div>
                </div>
            </section>

            <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
                <h2 className="text-lg font-semibold text-slate-900">Social Links</h2>

                <div className="mt-5 grid gap-5 md:grid-cols-3">
                    <input
                        type="url"
                        name="linkedin"
                        value={form.linkedin}
                        onChange={handleChange}
                        className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                        placeholder="LinkedIn URL"
                    />
                    <input
                        type="url"
                        name="github"
                        value={form.github}
                        onChange={handleChange}
                        className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                        placeholder="GitHub URL"
                    />
                    <input
                        type="url"
                        name="website"
                        value={form.website}
                        onChange={handleChange}
                        className="rounded-lg border border-slate-200 px-4 py-3 outline-none focus:border-blue-500"
                        placeholder="Website URL"
                    />
                </div>
            </section>

            <div className="flex justify-end gap-3">
                <button
                    type="button"
                    onClick={() => navigate("/instructor/profile")}
                    className="rounded-lg border bg-white px-5 py-3 font-medium transition hover:bg-slate-50"
                >
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <Save size={18} />
                    {mutation.isPending ? "Saving..." : "Save Profile"}
                </button>
            </div>
        </form>
    );
};

export default EditInstructorProfile;

