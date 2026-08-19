import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

import { createCourse } from "../../api/instructorCourse.services";

const initialForm = {
    title: "",
    description: "",
    category: "Programming",
    skillLevel: "Beginner",
    syllabus: "",
    duration: "",
    fee: "",
    prerequisites: "",
    enrollmentDeadline: "",
    courseImage: "",
    resources: [],
};

const CreateCourse = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState(initialForm);

    const [resource, setResource] = useState({
        title: "",
        type: "Video",
        url: "",
    });

    const mutation = useMutation({
        mutationFn: createCourse,

        onSuccess: (data) => {
            toast.success(data?.message || "Course created successfully");

            navigate("/instructor/courses");
        },

        onError: (error) => {
            toast.error(error?.response?.data?.message || "Failed to create course");
        },
    });

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleResourceChange = (event) => {
        const { name, value } = event.target;

        setResource((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const addResource = () => {
        if (!resource.title.trim() || !resource.url.trim()) {
            toast.error("Resource title and URL are required");
            return;
        }

        setFormData((prev) => ({
            ...prev,
            resources: [
                ...prev.resources,
                {
                    title: resource.title.trim(),
                    type: resource.type,
                    url: resource.url.trim(),
                },
            ],
        }));

        setResource({
            title: "",
            type: "Video",
            url: "",
        });
    };

    const removeResource = (index) => {
        setFormData((prev) => ({
            ...prev,
            resources: prev.resources.filter(
                (_, resourceIndex) => resourceIndex !== index,
            ),
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!formData.title.trim()) {
            toast.error("Course title is required");
            return;
        }

        if (!formData.description.trim()) {
            toast.error("Course description is required");
            return;
        }

        if (!formData.syllabus.trim()) {
            toast.error("Syllabus is required");
            return;
        }

        if (!formData.duration.trim()) {
            toast.error("Duration is required");
            return;
        }

        if (formData.fee === "" || Number(formData.fee) < 0) {
            toast.error("Enter a valid course fee");
            return;
        }

        const payload = {
            title: formData.title.trim(),
            description: formData.description.trim(),
            category: formData.category,
            skillLevel: formData.skillLevel,
            syllabus: formData.syllabus.trim(),
            duration: formData.duration.trim(),
            fee: Number(formData.fee),
            prerequisites: formData.prerequisites.trim(),
            enrollmentDeadline: formData.enrollmentDeadline || null,
            courseImage: formData.courseImage.trim(),
            resources: formData.resources,
        };

        mutation.mutate(payload);
    };

    return (
        <div className="mx-auto max-w-5xl space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
                <button
                    type="button"
                    onClick={() => navigate("/instructor/courses")}
                    className="rounded-lg border bg-white p-2 hover:bg-gray-50"
                >
                    <ArrowLeft size={20} />
                </button>

                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Create Course</h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Create a new course for admin approval.
                    </p>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <section className="rounded-xl border bg-white p-6 shadow-sm">
                    <h2 className="mb-5 text-lg font-semibold">Basic Information</h2>

                    <div className="grid gap-5 md:grid-cols-2">
                        {/* Title */}
                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium">
                                Course Title *
                            </label>

                            <input
                                type="text"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                placeholder="e.g. Full Stack MERN Development"
                                maxLength={150}
                                required
                                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* Description */}
                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium">
                                Description *
                            </label>

                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                rows={5}
                                placeholder="Describe the course..."
                                required
                                className="w-full resize-none rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Category *
                            </label>

                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
                            >
                                <option value="Programming">Programming</option>

                                <option value="Web Development">Web Development</option>

                                <option value="Data Science & Analytics">
                                    Data Science & Analytics
                                </option>

                                <option value="Graphic Design">Graphic Design</option>

                                <option value="Networking">Networking</option>

                                <option value="Cyber Security">Cyber Security</option>

                                <option value="Database">Database</option>

                                <option value="Cloud Computing">Cloud Computing</option>

                                <option value="Other">Other</option>
                            </select>
                        </div>

                        {/* Skill Level */}
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Skill Level *
                            </label>

                            <select
                                name="skillLevel"
                                value={formData.skillLevel}
                                onChange={handleChange}
                                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
                            >
                                <option value="Beginner">Beginner</option>

                                <option value="Intermediate">Intermediate</option>

                                <option value="Advanced">Advanced</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* Course Details */}
                <section className="rounded-xl border bg-white p-6 shadow-sm">
                    <h2 className="mb-5 text-lg font-semibold">Course Details</h2>

                    <div className="grid gap-5 md:grid-cols-2">
                        {/* Syllabus */}
                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium">
                                Syllabus *
                            </label>

                            <textarea
                                name="syllabus"
                                value={formData.syllabus}
                                onChange={handleChange}
                                rows={6}
                                placeholder="Write your syllabus here"
                                className="w-full resize-none rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* Duration */}
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Duration *
                            </label>

                            <input
                                type="text"
                                name="duration"
                                value={formData.duration}
                                onChange={handleChange}
                                placeholder="e.g. 3 Months"
                                required
                                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* Fee */}
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Course Fee *
                            </label>

                            <input
                                type="number"
                                name="fee"
                                value={formData.fee}
                                onChange={handleChange}
                                min="0"
                                placeholder="e.g. 25000"
                                required
                                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* Prerequisites */}
                        <div className="md:col-span-2">
                            <label className="mb-2 block text-sm font-medium">
                                Prerequisites
                            </label>

                            <textarea
                                name="prerequisites"
                                value={formData.prerequisites}
                                onChange={handleChange}
                                rows={3}
                                placeholder="e.g. Basic JavaScript knowledge"
                                className="w-full resize-none rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* Deadline */}
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Enrollment Deadline
                            </label>

                            <input
                                type="date"
                                name="enrollmentDeadline"
                                value={formData.enrollmentDeadline}
                                onChange={handleChange}
                                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
                            />
                        </div>

                        {/* Image */}
                        <div>
                            <label className="mb-2 block text-sm font-medium">
                                Course Image URL
                            </label>

                            <input
                                type="url"
                                name="courseImage"
                                value={formData.courseImage}
                                onChange={handleChange}
                                placeholder="https://example.com/course.jpg"
                                className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>
                </section>

                {/* Resources */}
                <section className="rounded-xl border bg-white p-6 shadow-sm">
                    <h2 className="mb-2 text-lg font-semibold">Course Resources</h2>

                    <p className="mb-5 text-sm text-gray-500">
                        Add videos, PDFs, documents or useful links.
                    </p>

                    <div className="grid gap-3 md:grid-cols-4">
                        <input
                            type="text"
                            name="title"
                            value={resource.title}
                            onChange={handleResourceChange}
                            placeholder="Resource title"
                            className="rounded-lg border px-3 py-2.5 outline-none focus:border-blue-500"
                        />

                        <select
                            name="type"
                            value={resource.type}
                            onChange={handleResourceChange}
                            className="rounded-lg border px-3 py-2.5 outline-none focus:border-blue-500"
                        >
                            <option value="Video">Video</option>

                            <option value="PDF">PDF</option>

                            <option value="Document">Document</option>

                            <option value="Link">Link</option>

                            <option value="Other">Other</option>
                        </select>

                        <input
                            type="url"
                            name="url"
                            value={resource.url}
                            onChange={handleResourceChange}
                            placeholder="Resource URL"
                            className="rounded-lg border px-3 py-2.5 outline-none focus:border-blue-500"
                        />

                        <button
                            type="button"
                            onClick={addResource}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 font-medium text-white hover:bg-gray-800"
                        >
                            <Plus size={17} />
                            Add Resource
                        </button>
                    </div>

                    {/* Resource List */}
                    {formData.resources.length > 0 && (
                        <div className="mt-5 space-y-3">
                            {formData.resources.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center justify-between rounded-lg border bg-gray-50 p-4"
                                >
                                    <div>
                                        <p className="font-medium">{item.title}</p>

                                        <p className="text-xs text-gray-500">
                                            {item.type} • {item.url}
                                        </p>
                                    </div>

                                    <button
                                        type="button"
                                        onClick={() => removeResource(index)}
                                        className="rounded-lg p-2 text-red-600 hover:bg-red-50"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Submit */}
                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => navigate("/instructor/courses")}
                        className="rounded-lg border bg-white px-5 py-3 font-medium hover:bg-gray-50"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={mutation.isPending}
                        className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {mutation.isPending ? "Creating..." : "Create Course"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateCourse;
