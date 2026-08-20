import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";
import { toast } from "react-toastify";

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
    courseImageFile: null,
    resources: [],
};

const initialResource = {
    title: "",
    type: "Video",
    url: "",
};

const CourseForm = ({ course, onSubmit, onCancel, loading = false, submitText = "Update Course" }) => {
    const [formData, setFormData] = useState(initialForm);

    const [resource, setResource] = useState(initialResource);

    useEffect(() => {
        if (!course) return;

        setFormData({
            title: course.title || "",
            description: course.description || "",
            category: course.category || "Programming",
            skillLevel: course.skillLevel || "Beginner",
            syllabus: course.syllabus || "",
            duration: course.duration || "",
            fee: course.fee !== undefined ? course.fee : "",
            prerequisites: course.prerequisites || "",
            enrollmentDeadline: course.enrollmentDeadline ? new Date(course.enrollmentDeadline).toISOString().split("T")[0] : "",
            courseImage: course.courseImage || "",
            courseImageFile: null,
            resources: Array.isArray(course.resources) ? course.resources : [],
        });
    }, [course]);

    // -----------------------------------------
    // INPUT CHANGE
    // -----------------------------------------

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (event) => {
        const file = event.target.files?.[0] || null;

        setFormData((prev) => ({
            ...prev,
            courseImageFile: file,
        }));
    };
    // -----------------------------------------
    // RESOURCE CHANGE
    // -----------------------------------------

    const handleResourceChange = (event) => {
        const { name, value } = event.target;

        setResource((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    // -----------------------------------------
    // ADD RESOURCE
    // -----------------------------------------

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

        setResource(initialResource);
    };

    // -----------------------------------------
    // REMOVE RESOURCE
    // -----------------------------------------

    const removeResource = (index) => {
        setFormData((prev) => ({
            ...prev,
            resources: prev.resources.filter((_, resourceIndex) => resourceIndex !== index),
        }));
    };

    // -----------------------------------------
    // SUBMIT
    // -----------------------------------------

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

        const payload = new FormData();
        payload.append("title", formData.title.trim());
        payload.append("description", formData.description.trim());
        payload.append("category", formData.category);
        payload.append("skillLevel", formData.skillLevel);
        payload.append("syllabus", formData.syllabus.trim());
        payload.append("duration", formData.duration.trim());
        payload.append("fee", Number(formData.fee));
        payload.append("prerequisites", formData.prerequisites.trim());
        payload.append("enrollmentDeadline", formData.enrollmentDeadline || "");
        payload.append("resources", JSON.stringify(formData.resources));

        if (formData.courseImageFile) {
            payload.append("photo", formData.courseImageFile);
        }

        onSubmit(payload);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* HEADER */}

            <div className="flex items-center gap-4">
                <button type="button" onClick={onCancel} className="rounded-lg border bg-white p-2 hover:bg-gray-50">
                    <ArrowLeft size={20} />
                </button>

                <div>
                    <h1 className="text-2xl font-bold text-gray-900">{course ? "Edit Course" : "Create Course"}</h1>

                    <p className="mt-1 text-sm text-gray-500">{course ? "Update course information." : "Create a new course for admin approval."}</p>
                </div>
            </div>

            {/* BASIC INFORMATION */}

            <section className="rounded-xl border bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-lg font-semibold">Basic Information</h2>

                <div className="grid gap-5 md:grid-cols-2">
                    {/* TITLE */}

                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium">Course Title *</label>

                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            maxLength={150}
                            required
                            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* DESCRIPTION */}

                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium">Description *</label>

                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows={5}
                            required
                            className="w-full resize-none rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* CATEGORY */}

                    <div>
                        <label className="mb-2 block text-sm font-medium">Category *</label>

                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
                        >
                            <option value="Programming">Programming</option>

                            <option value="Web Development">Web Development</option>

                            <option value="Data Science & Analytics">Data Science & Analytics</option>

                            <option value="Graphic Design">Graphic Design</option>

                            <option value="Networking">Networking</option>

                            <option value="Cyber Security">Cyber Security</option>

                            <option value="Database">Database</option>

                            <option value="Cloud Computing">Cloud Computing</option>

                            <option value="Other">Other</option>
                        </select>
                    </div>

                    {/* SKILL LEVEL */}

                    <div>
                        <label className="mb-2 block text-sm font-medium">Skill Level *</label>

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

            {/* COURSE DETAILS */}

            <section className="rounded-xl border bg-white p-6 shadow-sm">
                <h2 className="mb-5 text-lg font-semibold">Course Details</h2>

                <div className="grid gap-5 md:grid-cols-2">
                    {/* SYLLABUS */}

                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium">Syllabus *</label>

                        <textarea
                            name="syllabus"
                            value={formData.syllabus}
                            onChange={handleChange}
                            rows={7}
                            required
                            className="w-full resize-none rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* DURATION */}

                    <div>
                        <label className="mb-2 block text-sm font-medium">Duration *</label>

                        <input
                            type="text"
                            name="duration"
                            value={formData.duration}
                            onChange={handleChange}
                            required
                            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* FEE */}

                    <div>
                        <label className="mb-2 block text-sm font-medium">Course Fee *</label>

                        <input
                            type="number"
                            name="fee"
                            value={formData.fee}
                            onChange={handleChange}
                            min="0"
                            required
                            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* PREREQUISITES */}

                    <div className="md:col-span-2">
                        <label className="mb-2 block text-sm font-medium">Prerequisites</label>

                        <textarea
                            name="prerequisites"
                            value={formData.prerequisites}
                            onChange={handleChange}
                            rows={3}
                            className="w-full resize-none rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* DEADLINE */}

                    <div>
                        <label className="mb-2 block text-sm font-medium">Enrollment Deadline</label>

                        <input
                            type="date"
                            name="enrollmentDeadline"
                            value={formData.enrollmentDeadline}
                            onChange={handleChange}
                            className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
                        />
                    </div>

                    {/* IMAGE */}

                    <div>
                        <label className="mb-2 block text-sm font-medium">Course Image</label>

                        <input
                            type="file"
                            name="photo"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="w-full rounded-lg border px-4 py-3 outline-none file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-3 file:py-2 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100 focus:border-blue-500"
                        />

                        {(formData.courseImageFile || formData.courseImage) && (
                            <img
                                src={formData.courseImageFile ? URL.createObjectURL(formData.courseImageFile) : formData.courseImage}
                                alt="Course preview"
                                className="mt-3 h-32 w-full rounded-lg border object-cover"
                            />
                        )}
                    </div>
                </div>
            </section>

            {/* RESOURCES */}

            <section className="rounded-xl border bg-white p-6 shadow-sm">
                <h2 className="mb-2 text-lg font-semibold">Course Resources</h2>

                <p className="mb-5 text-sm text-gray-500">Add or remove learning resources.</p>

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

                {/* RESOURCE LIST */}

                {formData.resources.length > 0 && (
                    <div className="mt-5 space-y-3">
                        {formData.resources.map((item, index) => (
                            <div key={index} className="flex items-center justify-between rounded-lg border bg-gray-50 p-4">
                                <div className="min-w-0">
                                    <p className="font-medium">{item.title}</p>

                                    <p className="mt-1 truncate text-xs text-gray-500">
                                        {item.type} • {item.url}
                                    </p>
                                </div>

                                <button type="button" onClick={() => removeResource(index)} className="ml-4 rounded-lg p-2 text-red-600 hover:bg-red-50">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </section>

            {/* ACTIONS */}

            <div className="flex justify-end gap-3">
                <button type="button" onClick={onCancel} className="rounded-lg border bg-white px-5 py-3 font-medium hover:bg-gray-50">
                    Cancel
                </button>

                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    {loading ? `${submitText.replace(" Course", "")}...` : submitText}
                </button>
            </div>
        </form>
    );
};

export default CourseForm;

