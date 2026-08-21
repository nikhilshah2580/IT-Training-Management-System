import { useEffect, useState } from "react";
import {
  ArrowLeft,
  Plus,
  Trash2,
  UploadCloud,
  BookOpen,
  Layers,
  CheckCircle2,
} from "lucide-react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";

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

const CourseForm = ({
  course,
  onSubmit,
  onCancel,
  loading = false,
  submitText = "Update Course",
}) => {
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
      enrollmentDeadline: course.enrollmentDeadline
        ? new Date(course.enrollmentDeadline).toISOString().split("T")[0]
        : "",
      courseImage: course.courseImage || "",
      courseImageFile: null,
      resources: Array.isArray(course.resources) ? course.resources : [],
    });
  }, [course]);

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

    setResource(initialResource);
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
    <motion.form
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="space-y-6 max-w-5xl mx-auto pb-16"
    >
      {/* HEADER SECTION */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-6">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onCancel}
            className="group rounded-2xl border border-slate-200 bg-white p-3 text-slate-600 shadow-xs transition hover:bg-slate-50 hover:border-slate-300"
          >
            <ArrowLeft
              size={18}
              className="transition group-hover:-translate-x-0.5"
            />
          </button>
          <div>
            <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">
              {course ? "Edit Training Course" : "Create New Course"}
            </h1>
            <p className="mt-0.5 text-xs md:text-sm text-slate-400 font-medium">
              {course
                ? "Update course syllabus, metadata, and properties."
                : "Build a new professional curriculum for admin review."}
            </p>
          </div>
        </div>
      </div>

      {/* BASIC INFORMATION */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 md:p-8 shadow-xs space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
          <BookOpen size={18} className="text-indigo-600" />
          <h2 className="text-sm md:text-base font-bold text-slate-800">
            Basic Information
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {/* TITLE */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
              Course Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              maxLength={150}
              required
              placeholder="e.g. Advanced Full-Stack Architecture & React"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>

          {/* DESCRIPTION */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
              Description <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              required
              placeholder="Provide a comprehensive summary of what students will learn..."
              className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>

          {/* CATEGORY */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
              Category <span className="text-rose-500">*</span>
            </label>
            <select
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
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

          {/* SKILL LEVEL */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
              Skill Level <span className="text-rose-500">*</span>
            </label>
            <select
              name="skillLevel"
              value={formData.skillLevel}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>
      </section>

      {/* COURSE DETAILS */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 md:p-8 shadow-xs space-y-5">
        <div className="flex items-center gap-2 border-b border-slate-50 pb-3">
          <Layers size={18} className="text-indigo-600" />
          <h2 className="text-sm md:text-base font-bold text-slate-800">
            Curriculum & Logistics
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {/* SYLLABUS */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
              Syllabus Outline <span className="text-rose-500">*</span>
            </label>
            <textarea
              name="syllabus"
              value={formData.syllabus}
              onChange={handleChange}
              rows={6}
              required
              placeholder="Module 1: Introduction... Module 2: Deep Dive..."
              className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>

          {/* DURATION */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
              Duration <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              required
              placeholder="e.g. 6 Weeks / 30 Hours"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>

          {/* FEE */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
              Course Fee ($) <span className="text-rose-500">*</span>
            </label>
            <input
              type="number"
              name="fee"
              value={formData.fee}
              onChange={handleChange}
              min="0"
              required
              placeholder="0 for Free"
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>

          {/* PREREQUISITES */}
          <div className="md:col-span-2">
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
              Prerequisites
            </label>
            <textarea
              name="prerequisites"
              value={formData.prerequisites}
              onChange={handleChange}
              rows={3}
              placeholder="List any required prior knowledge or tools..."
              className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>

          {/* DEADLINE */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
              Enrollment Deadline
            </label>
            <input
              type="date"
              name="enrollmentDeadline"
              value={formData.enrollmentDeadline}
              onChange={handleChange}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-4 py-3 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
            />
          </div>

          {/* IMAGE */}
          <div>
            <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-500">
              Course Cover Image
            </label>
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-slate-50/60 p-4 text-center transition hover:border-indigo-400 hover:bg-indigo-50/30">
              <UploadCloud size={18} className="text-indigo-600" />
              <span className="text-xs font-bold text-slate-600 truncate">
                {formData.courseImageFile
                  ? formData.courseImageFile.name
                  : "Upload cover file"}
              </span>
              <input
                type="file"
                name="photo"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>

            {(formData.courseImageFile || formData.courseImage) && (
              <div className="relative mt-3 h-32 w-full overflow-hidden rounded-2xl border border-slate-200">
                <img
                  src={
                    formData.courseImageFile
                      ? URL.createObjectURL(formData.courseImageFile)
                      : formData.courseImage
                  }
                  alt="Course preview"
                  className="h-full w-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* RESOURCES */}
      <section className="rounded-3xl border border-slate-100 bg-white p-6 md:p-8 shadow-xs space-y-5">
        <div className="border-b border-slate-50 pb-3">
          <h2 className="text-sm md:text-base font-bold text-slate-800">
            Learning Resources
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Attach external videos, PDFs, documents, or reference links.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-4">
          <input
            type="text"
            name="title"
            value={resource.title}
            onChange={handleResourceChange}
            placeholder="Resource title"
            className="rounded-2xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
          />

          <select
            name="type"
            value={resource.type}
            onChange={handleResourceChange}
            className="rounded-2xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
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
            placeholder="https://resource-url.com"
            className="rounded-2xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10"
          />

          <button
            type="button"
            onClick={addResource}
            className="inline-flex items-center justify-center gap-1.5 rounded-2xl bg-slate-900 px-4 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-indigo-600 active:scale-[0.98]"
          >
            <Plus size={15} /> Add Resource
          </button>
        </div>

        {formData.resources.length > 0 && (
          <div className="mt-4 space-y-2.5">
            {formData.resources.map((item, index) => (
              <div
                key={index}
                className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50/60 p-3.5 transition"
              >
                <div className="min-w-0 pr-2">
                  <p className="text-xs md:text-sm font-bold text-slate-800 truncate">
                    {item.title}
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium text-slate-400 truncate">
                    <span className="text-indigo-600 font-semibold">
                      {item.type}
                    </span>{" "}
                    • {item.url}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => removeResource(index)}
                  className="rounded-xl p-2 text-rose-500 transition hover:bg-rose-50 shrink-0"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ACTIONS */}
      <div className="flex items-center justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-xs md:text-sm font-bold text-slate-600 shadow-xs transition hover:bg-slate-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-2xl bg-linear-to-r from-indigo-600 to-blue-600 px-6 py-3 text-xs md:text-sm font-bold text-white shadow-md transition hover:scale-[1.02] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
        >
          <CheckCircle2 size={16} />
          {loading ? "Processing..." : submitText}
        </button>
      </div>
    </motion.form>
  );
};

export default CourseForm;
